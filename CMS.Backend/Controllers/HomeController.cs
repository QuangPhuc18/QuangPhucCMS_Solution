using CMS.Backend.Models;
using CMS_DATA; // Gọi thư mục chứa ApplicationDbContext
using CMS_DATA.Entities; // Gọi thư mục chứa các bảng (Post, Category)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Bắt buộc để dùng được Include() và ToListAsync()
using System.Diagnostics;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        // 1. Khai báo thêm biến _context để làm việc với Database
        private readonly ApplicationDbContext _context;

        // 2. Tiêm cả ILogger (mặc định) và ApplicationDbContext (mới thêm) vào Constructor
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // 3. Sửa hàm Index thành bất đồng bộ (async Task) và truy vấn 3 bài viết
        public async Task<IActionResult> Index()
        {
            // LINQ: Lấy 3 bài viết mới nhất
            var latestPosts = await _context.Posts
                .Include(p => p.Category)                  // Lấy kèm tên danh mục
                .OrderByDescending(p => p.CreatedDate)     // Sắp xếp ngày mới nhất lên đầu
                .Take(3)                                   // Cắt lấy đúng 3 bài
                .ToListAsync();                            // Tải về RAM

            // Truyền danh sách 3 bài viết ra View để hiển thị
            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}