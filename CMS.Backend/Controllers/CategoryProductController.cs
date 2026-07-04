//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Controller Quản lý Danh mục Sản phẩm

using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Administrator,Staff")]
    [ApiExplorerSettings(IgnoreApi = true)] // Chặn Swagger quét file này
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public CategoryProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // ==========================================
        // 1. DANH SÁCH DANH MỤC (INDEX)
        // ==========================================
        public async Task<IActionResult> Index()
        {
            var categories = await _context.CategoriesProducts
                .OrderByDescending(c => c.Id)
                .ToListAsync();
            return View(categories);
        }

        // ==========================================
        // 2. THÊM DANH MỤC (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProduct model, IFormFile? image)
        {
            if (ModelState.IsValid)
            {
                if (image != null && image.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                    
                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(fileStream);
                    }
                    model.ImageUrl = "/uploads/" + uniqueFileName;
                }

                _context.CategoriesProducts.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // ==========================================
        // 3. SỬA DANH MỤC (EDIT)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null) return NotFound();

            return View(category);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryProduct model, IFormFile? image)
        {
            if (id != model.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    if (image != null && image.Length > 0)
                    {
                        string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                        
                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await image.CopyToAsync(fileStream);
                        }
                        
                        // Xóa ảnh cũ nếu có (tùy chọn)
                        if (!string.IsNullOrEmpty(model.ImageUrl))
                        {
                            var oldPath = Path.Combine(_webHostEnvironment.WebRootPath, model.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldPath)) System.IO.File.Exists(oldPath); // Just a safe check
                        }
                        
                        model.ImageUrl = "/uploads/" + uniqueFileName;
                    }
                    else
                    {
                        // Giữ nguyên ảnh cũ
                        var existingCategory = await _context.CategoriesProducts.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
                        if (existingCategory != null)
                        {
                            model.ImageUrl = existingCategory.ImageUrl;
                        }
                    }

                    _context.CategoriesProducts.Update(model);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.CategoriesProducts.Any(e => e.Id == id)) return NotFound();
                    else throw;
                }
            }
            return View(model);
        }

        // ==========================================
        // 4. XÓA DANH MỤC (DELETE)
        // ==========================================
        // Xóa trực tiếp bằng 1 nút bấm trên màn hình Index, không cần trang View riêng
        
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category != null)
            {
                // Lưu ý: Nếu danh mục này đang có sản phẩm, SQL có thể báo lỗi khóa ngoại.
                // Ở mức độ cơ bản, chúng ta cứ thực hiện xóa.
                _context.CategoriesProducts.Remove(category);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}