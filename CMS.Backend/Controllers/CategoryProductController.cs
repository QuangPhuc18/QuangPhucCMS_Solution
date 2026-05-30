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

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)] // Chặn Swagger quét file này
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
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
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
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
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryProduct model)
        {
            if (id != model.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
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