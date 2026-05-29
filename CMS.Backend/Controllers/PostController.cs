//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Controller quản lý Bài viết (Đầy đủ Index, Details, Create, Edit, Delete)

using System;
using System.Threading.Tasks;
using System.Linq;
using System.IO;
using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. DANH SÁCH BÀI VIẾT
        // ==========================================
        public async Task<IActionResult> Index()
        {
            var posts = await _context.Posts.Include(p => p.Category).OrderByDescending(p => p.Id).ToListAsync();
            return View(posts);
        }

        // ==========================================
        // 🔥 2. XEM CHI TIẾT BÀI VIẾT (MỚI BỔ SUNG)
        // ==========================================
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            // Phải Include(p => p.Category) để ngoài giao diện hiển thị được tên danh mục
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (post == null) return NotFound();

            return View(post);
        }

        // ==========================================
        // 3. THÊM MỚI BÀI VIẾT (GET & POST)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Post model, IFormFile uploadImage)
        {
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    string filePath = Path.Combine(folder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await uploadImage.CopyToAsync(stream);
                    }
                    model.ImageUrl = "/uploads/" + fileName;
                }

                if (model.CreatedDate == default) model.CreatedDate = DateTime.Now;

                _context.Posts.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        // ==========================================
        // 4. CHỈNH SỬA BÀI VIẾT (GET & POST)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var post = await _context.Products.FindAsync(id); // Tìm bài viết
            var postReal = await _context.Posts.FindAsync(id);
            if (postReal == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", postReal.CategoryId);
            return View(postReal);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Post model, IFormFile? uploadImage)
        {
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    string filePath = Path.Combine(folder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await uploadImage.CopyToAsync(stream);
                    }
                    model.ImageUrl = "/uploads/" + fileName;
                }
                else
                {
                    var oldPost = await _context.Posts.AsNoTracking().FirstOrDefaultAsync(p => p.Id == model.Id);
                    if (oldPost != null) model.ImageUrl = oldPost.ImageUrl;
                }

                _context.Posts.Update(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        // ==========================================
        // 🔥 5. XÓA BÀI VIẾT (MỚI BỔ SUNG KHỚP VỚI NÚT XÓA)
        // ==========================================
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}