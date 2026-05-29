//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Controller Quản lý Danh mục Sản phẩm

using System.Threading.Tasks;
using System.Linq;
using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH DANH MỤC
        public async Task<IActionResult> Index()
        {
            // Sử dụng CategoriesProducts như bạn đã khai báo trong ApplicationDbContext
            return View(await _context.CategoriesProducts.ToListAsync());
        }

        // 2. THÊM MỚI
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProduct model)
        {
            // Bỏ qua kiểm tra danh sách sản phẩm liên kết
            ModelState.Remove("Products");

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // 3. CHỈNH SỬA
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
        public async Task<IActionResult> Edit(CategoryProduct model)
        {
            ModelState.Remove("Products");

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // 4. XÓA
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}