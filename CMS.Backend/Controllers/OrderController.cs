//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả : Controller Quản lý Đơn hàng (Order) và Chi tiết đơn hàng

using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Administrator,Staff")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. HIỂN THỊ DANH SÁCH ĐƠN HÀNG
        // ==========================================
        public async Task<IActionResult> Index()
        {
            // Cần .Include(Customer) để hiển thị tên khách hàng thay vì chỉ hiện CustomerId
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id) // Đơn hàng mới nhất lên đầu
                .ToListAsync();

            return View(orders);
        }

        // ==========================================
        // 2. XEM CHI TIẾT ĐƠN HÀNG (QUAN TRỌNG NHẤT)
        // ==========================================
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            // KỸ THUẬT NÂNG CAO: Kết nối 3 bảng (Order -> OrderDetail -> Product)
            var order = await _context.Orders
                .Include(o => o.Customer)                           // Lấy thông tin người mua
                .Include(o => o.OrderDetails)                       // Lấy danh sách chi tiết đơn
                    .ThenInclude(od => od.Product)                  // Từ chi tiết đơn, móc nối lấy tên Sản phẩm
                .FirstOrDefaultAsync(m => m.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }

        // ==========================================
        // 3. THÊM MỚI ĐƠN HÀNG (Thường Admin ít dùng, chủ yếu khách tự đặt trên web)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            // Truyền danh sách khách hàng sang View để tạo Menu thả xuống (Dropdown)
            ViewData["CustomerId"] = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Order model)
        {
            // Bỏ qua kiểm tra các đối tượng liên kết phức tạp để tránh lỗi
            ModelState.Remove("Customer");
            ModelState.Remove("OrderDetails");

            if (ModelState.IsValid)
            {
                _context.Orders.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewData["CustomerId"] = new SelectList(_context.Customers, "Id", "FullName", model.CustomerId);
            return View(model);
        }

        // ==========================================
        // 4. CHỈNH SỬA ĐƠN HÀNG (Dùng để cập nhật trạng thái: Đang giao, Đã hủy...)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var order = await _context.Orders
                .Include(o => o.Customer)                           // Lấy thông tin người mua
                .Include(o => o.OrderDetails)                       // Lấy danh sách chi tiết đơn
                    .ThenInclude(od => od.Product)                  // Từ chi tiết đơn lấy sản phẩm
                .FirstOrDefaultAsync(m => m.Id == id);
                
            if (order == null) return NotFound();

            ViewData["CustomerId"] = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int Id, int Status, string Notes,
            string CustomerFullName, string CustomerEmail, string CustomerPhone, string CustomerAddress,
            int[] DetailIds, int[] DetailQuantities, int[] DeletedDetailIds)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == Id);

            if (order == null) return NotFound();

            try
            {
                // 1. CẬP NHẬT THÔNG TIN ĐƠN HÀNG
                order.Status = Status;
                order.Notes = Notes;

                // 2. CẬP NHẬT THÔNG TIN KHÁCH HÀNG
                if (order.Customer != null)
                {
                    order.Customer.FullName = CustomerFullName;
                    order.Customer.Email = CustomerEmail;
                    order.Customer.Phone = CustomerPhone;
                    order.Customer.Address = CustomerAddress;
                }

                // 3. CẬP NHẬT CHI TIẾT ĐƠN HÀNG & TỒN KHO
                if (DetailIds != null && DetailQuantities != null)
                {
                    for (int i = 0; i < DetailIds.Length; i++)
                    {
                        int detailId = DetailIds[i];
                        int newQuantity = DetailQuantities[i];

                        var detail = order.OrderDetails.FirstOrDefault(d => d.Id == detailId);
                        if (detail != null)
                        {
                            // A. Nếu Checkbox XÓA được tích
                            if (DeletedDetailIds != null && DeletedDetailIds.Contains(detailId))
                            {
                                // Hoàn trả tồn kho
                                if (detail.Product != null)
                                {
                                    detail.Product.StockQuantity += detail.Quantity;
                                }
                                _context.OrderDetails.Remove(detail);
                            }
                            // B. Nếu chỉ thay đổi SỐ LƯỢNG
                            else
                            {
                                if (detail.Quantity != newQuantity)
                                {
                                    int diff = newQuantity - detail.Quantity;
                                    
                                    // diff > 0 (Tăng SL mua) -> Trừ kho
                                    // diff < 0 (Giảm SL mua) -> Cộng kho
                                    if (detail.Product != null)
                                    {
                                        detail.Product.StockQuantity -= diff;
                                    }
                                    
                                    detail.Quantity = newQuantity;
                                }
                            }
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(Id)) return NotFound();
                else throw;
            }
        }

        // ==========================================
        // 5. XÓA ĐƠN HÀNG
        // ==========================================
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    
        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}