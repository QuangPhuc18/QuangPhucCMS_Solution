using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS_DATA;
using CMS_DATA.Entities;
using CMS_DATA.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Backend.Helpers;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.Id)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng!" });
            return Ok(order);
        }

        // 🔥 API MỚI: Lấy danh sách đơn hàng theo CustomerId
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate) // Xếp đơn mới nhất lên đầu
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderCreateDto dto)
        {
            // Bắt đầu Transaction để đảm bảo tính toàn vẹn dữ liệu (tránh lỗi nửa chừng)
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 0. BẮT LỖI KHÓA NGOẠI & CẬP NHẬT THÔNG TIN:
                var customer = await _context.Customers.FindAsync(dto.CustomerId);
                if (customer == null)
                {
                    throw new Exception($"Không tìm thấy Khách hàng nào có mã ID = {dto.CustomerId} trong bảng Customers. Vui lòng tạo dữ liệu Khách hàng trước khi đặt đơn!");
                }

                // Cập nhật thông tin Khách hàng (Tên, SĐT, Địa chỉ) từ Form Checkout (Tiêu chí 29)
                if (!string.IsNullOrEmpty(dto.FullName)) customer.FullName = dto.FullName;
                if (!string.IsNullOrEmpty(dto.Phone)) customer.Phone = dto.Phone;
                if (!string.IsNullOrEmpty(dto.Address)) customer.Address = dto.Address;
                _context.Customers.Update(customer);

                // 1. Ánh xạ thông tin chung của đơn hàng
                var order = new Order
                {
                    CustomerId = dto.CustomerId,
                    Notes = dto.Notes,
                    OrderDate = DateTime.Now,
                    Status = 0, // Mặc định là 0 (Chờ duyệt)

                    // 2. Tự động ánh xạ mảng các món hàng bên trong DTO sang Entity OrderDetail
                    OrderDetails = dto.OrderDetails.Select(detail => new OrderDetail
                    {
                        ProductId = detail.ProductId,
                        Quantity = detail.Quantity,
                        UnitPrice = detail.UnitPrice
                    }).ToList()
                };

                _context.Orders.Add(order);

                // 3. 🔥 Trừ số lượng tồn kho của từng sản phẩm trong đơn hàng & Tạo bảng HTML chi tiết
                string orderDetailsHtml = @"
                    <table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 15px;'>
                        <tr style='background-color: #ea580c; color: white;'>
                            <th align='left'>Sản phẩm</th>
                            <th align='center'>Số lượng</th>
                            <th align='right'>Đơn giá</th>
                            <th align='right'>Thành tiền</th>
                        </tr>";
                decimal totalAmount = 0;

                foreach (var detail in dto.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        if (product.StockQuantity < detail.Quantity)
                        {
                            throw new Exception($"Sản phẩm '{product.Name}' chỉ còn {product.StockQuantity} cái, không đủ số lượng để đặt {detail.Quantity} cái.");
                        }

                        // Trừ tồn kho
                        product.StockQuantity -= detail.Quantity;
                        _context.Products.Update(product);

                        // Thêm vào bảng HTML
                        decimal lineTotal = detail.Quantity * detail.UnitPrice;
                        totalAmount += lineTotal;
                        orderDetailsHtml += $@"
                        <tr>
                            <td align='left'><b>{product.Name}</b></td>
                            <td align='center'>{detail.Quantity}</td>
                            <td align='right'>{detail.UnitPrice:N0}đ</td>
                            <td align='right'><b>{lineTotal:N0}đ</b></td>
                        </tr>";
                    }
                    else
                    {
                        throw new Exception($"Không tìm thấy sản phẩm có ID {detail.ProductId} trong kho.");
                    }
                }

                orderDetailsHtml += $@"
                        <tr style='background-color: #f8f9fa; font-size: 16px;'>
                            <td colspan='3' align='right'><b>Tổng thanh toán:</b></td>
                            <td align='right'><b style='color: #ea580c;'>{totalAmount:N0}đ</b></td>
                        </tr>
                    </table>";

                // Lưu tất cả thay đổi vào Database
                await _context.SaveChangesAsync();

                // Xác nhận Transaction thành công
                await transaction.CommitAsync();

                // 4. 🔥 GỬI EMAIL XÁC NHẬN ĐƠN HÀNG (Tiêu chí 31)
                string emailBody = $@"
                    <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                        <h2 style='color: #ea580c;'>Cảm ơn bạn đã đặt hàng tại Quang Phuc CMS!</h2>
                        <p>Chào <b>{customer.FullName}</b>,</p>
                        <p>Đơn hàng <b>#{order.Id}</b> của bạn đã được ghi nhận hệ thống thành công.</p>
                        <p>Chúng tôi sẽ giao hàng đến địa chỉ: <b>{customer.Address}</b> trong thời gian sớm nhất.</p>
                        
                        <h3 style='margin-bottom: 5px;'>Chi tiết đơn hàng của bạn:</h3>
                        {orderDetailsHtml}

                        <br/>
                        <p>Trân trọng,<br/><b>Quang Phuc CMS Team</b></p>
                    </div>
                ";
                await EmailHelper.SendEmailAsync(customer.Email, $"Xác nhận đơn hàng #{order.Id} - Quang Phuc CMS", emailBody);

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                // Nếu có bất kỳ lỗi gì (ví dụ kho không đủ), hủy toàn bộ thao tác thêm đơn hàng và trừ kho
                await transaction.RollbackAsync();
                
                // Trích xuất thông báo lỗi sâu nhất (Inner Exception)
                var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                
                return BadRequest(new { message = $"Lỗi hệ thống: {errorMessage}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderCreateDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng!" });

            order.CustomerId = dto.CustomerId;
            order.Notes = dto.Notes;

            // Xóa chi tiết món cũ và thay bằng mảng chi tiết món mới
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            order.OrderDetails = dto.OrderDetails.Select(detail => new OrderDetail
            {
                ProductId = detail.ProductId,
                Quantity = detail.Quantity,
                UnitPrice = detail.UnitPrice
            }).ToList();

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            if (order.OrderDetails != null && order.OrderDetails.Any())
            {
                _context.OrderDetails.RemoveRange(order.OrderDetails);
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}