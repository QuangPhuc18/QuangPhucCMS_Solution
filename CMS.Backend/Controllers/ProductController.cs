//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Controller quản lý Sản phẩm (Đã FIX lỗi không hiện danh mục bằng ViewBag.CategoryList)

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
    [ApiExplorerSettings(IgnoreApi = true)] // Chặn Swagger không quét file này để tránh lỗi trắng trang
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. HIỂN THỊ DANH SÁCH SẢN PHẨM
        // ==========================================
        public async Task<IActionResult> Index()
        {
            // Đã đổi sang Include CategoryProduct
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .ToListAsync();
            return View(products);
        }

        // ==========================================
        // 2. THÊM MỚI SẢN PHẨM (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            // 🔥 FIX: Đổi tên thành ViewBag.CategoryList để không bị trùng tên thuộc tính
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product model, IFormFile? uploadImage)
        {
            // Bỏ qua validate khóa ngoại và ảnh để tự xử lý
            ModelState.Remove("CategoryProduct");
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

                _context.Products.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            // 🔥 FIX: Đổi tên thành ViewBag.CategoryList
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        // ==========================================
        // 3. CHỈNH SỬA SẢN PHẨM (EDIT)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            // 🔥 FIX: Đổi tên thành ViewBag.CategoryList
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product model, IFormFile? uploadImage)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                try
                {
                    var productToUpdate = await _context.Products.FindAsync(id);
                    if (productToUpdate == null) return NotFound();

                    // Cập nhật các trường thông tin cơ bản
                    productToUpdate.Name = model.Name;
                    productToUpdate.Description = model.Description;
                    productToUpdate.Price = model.Price;
                    productToUpdate.StockQuantity = model.StockQuantity;
                    productToUpdate.CategoryProductId = model.CategoryProductId; // Cập nhật đúng khóa ngoại mới

                    // Xử lý cập nhật ảnh
                    if (uploadImage != null && uploadImage.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(productToUpdate.ImageUrl))
                        {
                            var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", productToUpdate.ImageUrl.TrimStart('/'));
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
                        productToUpdate.ImageUrl = "/uploads/" + fileName;
                    }

                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Products.Any(e => e.Id == id)) return NotFound();
                    else throw;
                }
            }

            // 🔥 FIX: Đổi tên thành ViewBag.CategoryList
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        // ==========================================
        // 4. XÓA SẢN PHẨM (DELETE)
        // ==========================================
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}