//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026 (Cập nhật 23/05/2026)
//Mô tả : Controller Quản lý người dùng (User) đầy đủ tính năng CRUD

using System.Threading.Tasks;
using System.Linq;
using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm (Inject) ApplicationDbContext vào Controller
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. HIỂN THỊ DANH SÁCH (READ)
        // ==========================================
        public async Task<IActionResult> Index()
        {
            // Lấy dữ liệu thật từ bảng Users trong SQL Server một cách bất đồng bộ
            var users = await _context.Users.ToListAsync();
            return View(users);
        }

        // ==========================================
        // 2. THÊM MỚI NGƯỜI DÙNG (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(User model)
        {
            if (ModelState.IsValid)
            {
                // Lưu ý cho Backend thực tế: Ở đây thường phải có bước băm mật khẩu (Hash Password)
                // trước khi lưu vào model.PasswordHash để bảo mật.

                _context.Users.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // ==========================================
        // 3. CHỈNH SỬA NGƯỜI DÙNG (UPDATE)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(User model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Users.Update(model);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(model.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // ==========================================
        // 4. XÓA NGƯỜI DÙNG (DELETE)
        // ==========================================
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        // Hàm bổ trợ kiểm tra tồn tại
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}