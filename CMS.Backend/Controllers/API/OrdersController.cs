using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS_DATA;
using CMS_DATA.Entities;
using CMS_DATA.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                // 0. BẮT LỖI KHÓA NGOẠI: Kiểm tra CustomerId có tồn tại trong bảng Customers không!
                // Rất nhiều trường hợp người dùng lấy ID của bảng Users truyền sang bảng Customers gây ra lỗi Foreign Key.
                var customerExists = await _context.Customers.AnyAsync(c => c.Id == dto.CustomerId);
                if (!customerExists)
                {
                    throw new Exception($"Không tìm thấy Khách hàng nào có mã ID = {dto.CustomerId} trong bảng Customers. Vui lòng tạo dữ liệu Khách hàng trước khi đặt đơn!");
                }

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

                // 3. 🔥 Trừ số lượng tồn kho của từng sản phẩm trong đơn hàng
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
                    }
                    else
                    {
                        throw new Exception($"Không tìm thấy sản phẩm có ID {detail.ProductId} trong kho.");
                    }
                }

                // Lưu tất cả thay đổi vào Database
                await _context.SaveChangesAsync();

                // Xác nhận Transaction thành công
                await transaction.CommitAsync();

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