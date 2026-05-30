//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả : Controller quản lý danh mục sản phẩm

using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    //Ngày 23/05/2026:Update lại category
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Categories trong SQL
            var data = _context.Categories.ToList();
            return View(data);
        }
        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho  nhập
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
            _context.Categories.Add(model);

            // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, tự động quay về trang danh sách
            return RedirectToAction("Index");
        }
        // Action nhận vào Id của danh mục cần xóa (Gọi từ thẻ <a> trên View)
        public async Task<IActionResult> Delete(int id)
        {
            // Bước 1: Tìm đối tượng danh mục trong Database bằng Id
            var category = await _context.Categories.FindAsync(id);

            // Kiểm tra nếu tìm thấy thì mới thực hiện xóa
            if (category != null)
            {
                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                _context.Categories.Remove(category);

                // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
                await _context.SaveChangesAsync();
            }

            // Sau khi xóa xong, tự động load lại trang danh sách để cập nhật giao diện
            return RedirectToAction(nameof(Index));
        }
        // 1. Hàm GET: Tìm dữ liệu cũ dựa vào ID và đổ ngược lên Form để sửa
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            // Tìm danh mục trong Database theo Id một cách bất đồng bộ
            var category = await _context.Categories.FindAsync(id);

            // Nếu không tìm thấy (ví dụ người dùng cố tình gõ sai ID trên URL), trả về trang lỗi 404
            if (category == null)
            {
                return NotFound();
            }

            // Gửi đối tượng tìm được sang giao diện Edit.cshtml
            return View(category);
        }

        // 2. Hàm POST: Đón nhận dữ liệu mới sau khi người dùng sửa trên Form và lưu lại
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Category model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Categories.Update(model);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CategoryExists(model.Id)) return NotFound();
                    else throw;
                }

                // CHỈNH SỬA TẠI ĐÂY: Ép hệ thống quay về đúng trang Index của Category
                return RedirectToAction("Index", "Category");
            }
            return View(model);
        }

        // Hàm bổ trợ kiểm tra xem danh mục có tồn tại hay không
        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }

    }

}
