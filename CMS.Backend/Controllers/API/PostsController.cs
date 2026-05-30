using CMS_DATA;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. API LẤY TOÀN BỘ BÀI VIẾT MỚI NHẤT
        // URL: GET https://localhost:xxxx/api/posts
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    CreatedDate = p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ==========================================
        // 2. API LẤY BÀI VIẾT THEO ID DANH MỤC
        // URL: GET https://localhost:xxxx/api/posts/category/1
        // ==========================================
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    CreatedDate = p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ==========================================
        // 🔥 3. API LẤY CHI TIẾT 1 BÀI VIẾT THEO ID (MỚI BỔ SUNG)
        // URL: GET https://localhost:xxxx/api/posts/5
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // Tìm bài viết theo ID, lấy kèm luôn thông tin Category
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            // Nếu không tìm thấy, trả về lỗi 404 kèm gói JSON thông báo
            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            // Nếu tìm thấy, trả về toàn bộ Object (bao gồm cả Content HTML)
            return Ok(post);
        }
    }
}