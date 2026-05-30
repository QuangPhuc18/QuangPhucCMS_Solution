//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Controller quản lý Bài viết (Hoàn thiện Fix lỗi Create/Edit)

using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
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
        // 2. XEM CHI TIẾT BÀI VIẾT
        // ==========================================
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (post == null) return NotFound();

            return View(post);
        }

        // ==========================================
        // 🔥 3. THÊM MỚI BÀI VIẾT (FIX LỖI CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        // ĐÃ SỬA: Thêm dấu "?" vào IFormFile? uploadImage để cho phép bài viết không cần có ảnh ngay
        public async Task<IActionResult> Create(Post model, IFormFile? uploadImage)
        {
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");
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

            // Nếu có lỗi, trả lại View kèm danh sách lỗi
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        // ==========================================
        // 🔥 4. CHỈNH SỬA BÀI VIẾT (FIX LỖI EDIT)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Post model, IFormFile? uploadImage)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");
            if (ModelState.IsValid)
            {
                try
                {
                    var postToUpdate = await _context.Posts.FindAsync(id);
                    if (postToUpdate == null) return NotFound();

                    postToUpdate.Title = model.Title;
                    postToUpdate.Content = model.Content;
                    postToUpdate.CategoryId = model.CategoryId;

                    if (uploadImage != null && uploadImage.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(postToUpdate.ImageUrl))
                        {
                            var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", postToUpdate.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldFilePath)) System.IO.File.Delete(oldFilePath);
                        }

                        string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                        string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                        string filePath = Path.Combine(folder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await uploadImage.CopyToAsync(stream);
                        }

                        postToUpdate.ImageUrl = "/uploads/" + fileName;
                    }

                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Posts.Any(e => e.Id == id)) return NotFound();
                    else throw;
                }
            }

            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        // ==========================================
        // 5. XÓA BÀI VIẾT
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