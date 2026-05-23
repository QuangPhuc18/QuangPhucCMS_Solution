//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả : Controller quản lý  sản phẩm
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS_DATA; // Gọi namespace chứa ApplicationDbContext của bạn
using CMS_DATA.Entities; // Gọi namespace chứa class Post, Category

namespace CMS.BACKEND.Controllers // Đổi tên này theo tên Project Web thực tế của bạn
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm (Inject) ApplicationDbContext vào Controller
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Posts (Hiển thị danh sách bài viết)
        // GET: Posts (hoặc /Posts/Index/5)
        public async Task<IActionResult> Index(int? id)
        {
            // 1. Bắt đầu với IQueryable để xây dựng câu truy vấn (chưa gọi xuống DB)
            // Áp dụng ngay Include để lấy kèm tên Danh mục (tránh lỗi null)
            IQueryable<Post> query = _context.Posts.Include(p => p.Category);

            // 2. Màng lọc dữ liệu (Where)
            if (id != null)
            {
                // Nếu người dùng truyền id (ví dụ: /Posts/Index/2) -> Lọc bài viết của danh mục đó
                query = query.Where(p => p.CategoryId == id);

                // Tùy chọn: Truyền thêm thông báo ra View để biết đang lọc theo ID nào
                ViewBag.CurrentCategoryId = id;
            }

            // 3. Bộ sắp xếp và Lệnh chốt hạ (OrderByDescending & ToListAsync)
            // Sắp xếp bài mới nhất lên đầu và chính thức lấy dữ liệu từ SQL Server
            var posts = await query
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            // 4. Truyền dữ liệu ra View
            return View(posts);
        }

        // GET: Posts/Details/5 (Xem chi tiết 1 bài viết)
        // GET: Post/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // SỬA TẠI ĐÂY: Thêm .Include để ép SQL Server thực hiện câu lệnh JOIN bảng
            var post = await _context.Posts
                .Include(p => p.Category) // <--- Nạp kèm dữ liệu của danh mục liên kết
                .FirstOrDefaultAsync(m => m.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // GET: Posts/Create (Mở form thêm mới)
        public IActionResult Create()
        {
            // Lấy danh sách Categories đổ vào DropdownList
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        // POST: Posts/Create (Xử lý lưu dữ liệu thêm mới)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Content,ImageUrl,CategoryId")] Post post)
        {
            if (ModelState.IsValid)
            {
                // Gán thời gian hiện tại cho CreatedDate (bảo hiểm thêm 1 lớp ngoài class Entity)
                post.CreatedDate = DateTime.Now;

                _context.Add(post);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            // Nếu lỗi, trả về form và giữ nguyên danh sách Category đang chọn
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // GET: Posts/Edit/5 (Mở form sửa)
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Posts/Edit/5 (Xử lý lưu dữ liệu sau khi sửa)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Content,ImageUrl,CreatedDate,CategoryId")] Post post)
        {
            if (id != post.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(post);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PostExists(post.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // GET: Posts/Delete/5 (Mở trang xác nhận xóa)
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (post == null) return NotFound();

            return View(post);
        }

        // POST: Posts/Delete/5 (Xử lý xóa thật dưới DB)
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}