//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Controller quản lý Sản phẩm - Đã liên kết đồng bộ bảng Brand vào luồng CRUD

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
    [Authorize(Roles = "Administrator,Staff")]
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
            // 🔥 FIX: Nối thêm .Include(p => p.Brand) để hiển thị tên Thương hiệu (Sony, LG...) ra ngoài danh sách bảng
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Include(p => p.Brand)
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
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");

            // 🔥 FIX THẦN THÁNH: Nạp dữ liệu từ bảng Brands vào ViewBag để đổ ra ô Chọn của View
            ViewBag.BrandList = new SelectList(_context.Brands, "Id", "Name");

            return View();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product model, IFormFile? uploadImage)
        {
            // Bỏ qua validate khóa ngoại và ảnh để tự xử lý bằng code dưới
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("Brand"); // Loại bỏ validate thực thể Brand tự động của EF Core
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

            // 🔥 FIX: Nếu dính lỗi nhập liệu (Validation Fail), phải nạp lại cả 2 danh sách trước khi trả lại View
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            ViewBag.BrandList = new SelectList(_context.Brands, "Id", "Name", model.BrandId);
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

            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", product.CategoryProductId);

            // 🔥 FIX: Nạp danh sách hãng và đánh dấu chọn đúng Hãng hiện tại của sản phẩm đó
            ViewBag.BrandList = new SelectList(_context.Brands, "Id", "Name", product.BrandId);

            return View(product);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product model, IFormFile? uploadImage)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("CategoryProduct");
            ModelState.Remove("Brand");
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
                    productToUpdate.CategoryProductId = model.CategoryProductId;
                    productToUpdate.BrandId = model.BrandId; // 🔥 FIX: Cho phép lưu cập nhật Hãng sản xuất mới

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

            // 🔥 FIX: Nạp lại dữ liệu khi lỗi
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            ViewBag.BrandList = new SelectList(_context.Brands, "Id", "Name", model.BrandId);
            return View(model);
        }

        // ==========================================
        // 4. XÓA SẢN PHẨM (DELETE)
        // ==========================================
        [Authorize(Roles = "Administrator")]
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