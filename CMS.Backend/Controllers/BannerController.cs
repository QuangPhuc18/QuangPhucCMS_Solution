using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using CMS_DATA;
using CMS_DATA.Entities;

namespace CMS.Backend.Controllers
{
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public BannerController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // =========================================================
        // 🔥 PHẦN 1: ROUTE MVC DÀNH CHO ADMIN (Giao diện quản trị hệ thống)
        // =========================================================

        // GET: Banner
        public async Task<IActionResult> Index()
        {
            var banners = await _context.Banners.OrderByDescending(b => b.DisplayOrder).ToListAsync();
            return View(banners);
        }

        // GET: Banner/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Banner/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Subtitle,IsActive,DisplayOrder")] Banner banner, IFormFile? imageFile)
        {
            // Bỏ qua check bắt buộc ImageUrl của Entity để tránh lỗi ModelState
            ModelState.Remove(nameof(banner.ImageUrl));

            if (ModelState.IsValid)
            {
                try
                {
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "banners");
                        if (!Directory.Exists(uploadsFolder))
                            Directory.CreateDirectory(uploadsFolder);

                        string originalName = Path.GetFileName(imageFile.FileName).Replace(",", "").Replace(" ", "_");
                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + originalName;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(fileStream);
                        }

                        // Gán đường dẫn nội bộ cho object
                        banner.ImageUrl = "/images/banners/" + uniqueFileName;
                    }
                    else
                    {
                        ModelState.AddModelError("imageFile", "Vui lòng chọn một file ảnh từ máy tính!");
                        return View(banner);
                    }

                    _context.Add(banner);
                    await _context.SaveChangesAsync();

                    // Trả về trang danh sách an toàn sau khi lưu thành công
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    string inner = ex.InnerException != null ? ex.InnerException.Message : "";
                    ModelState.AddModelError("", "Lỗi hệ thống khi ghi DB: " + ex.Message + " | Chi tiết: " + inner);
                }
            }
            return View(banner);
        }

        // GET: Banner/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();
            return View(banner);
        }

        // POST: Banner/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Subtitle,ImageUrl,IsActive,DisplayOrder")] Banner banner, IFormFile? imageFile)
        {
            if (id != banner.Id) return NotFound();

            ModelState.Remove(nameof(banner.ImageUrl));

            if (ModelState.IsValid)
            {
                try
                {
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "banners");
                        if (!Directory.Exists(uploadsFolder))
                            Directory.CreateDirectory(uploadsFolder);

                        string originalName = Path.GetFileName(imageFile.FileName).Replace(",", "").Replace(" ", "_");
                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + originalName;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(fileStream);
                        }

                        banner.ImageUrl = "/images/banners/" + uniqueFileName;
                    }

                    _context.Update(banner);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BannerExists(banner.Id)) return NotFound();
                    else throw;
                }
            }
            return View(banner);
        }

        // GET: Banner/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var banner = await _context.Banners.FirstOrDefaultAsync(m => m.Id == id);
            if (banner == null) return NotFound();
            return View(banner);
        }

        // POST: Banner/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner != null)
            {
                _context.Banners.Remove(banner);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool BannerExists(int id)
        {
            return _context.Banners.Any(e => e.Id == id);
        }


        // =========================================================
        // 🔥 PHẦN 2: API ĐỘNG TRA ĐỂ LẤY BANNER LÊN TRANG CHỦ REACTJS
        // =========================================================

        [HttpGet("api/banners")]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public async Task<ActionResult<IEnumerable<Banner>>> GetBannersForReact()
        {
            // Lấy tất cả Banner đang kích hoạt, sắp xếp theo thứ tự hiển thị nhỏ trước
            var activeBanners = await _context.Banners
                .Where(b => b.IsActive == true)
                .OrderBy(b => b.DisplayOrder)
                .ToListAsync();

            return Ok(activeBanners);
        }
    }
}