using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    //[Authorize]
    //[Authorize(Roles = "Administrator")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH
        public async Task<IActionResult> Index()
        {
            return View(await _context.Users.ToListAsync());
        }

        // 2. TẠO MỚI
        [HttpGet]
        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(User model)
        {
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            // 🔥 THÊM DÒNG NÀY: Băm mật khẩu người dùng vừa nhập
            model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);

            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // 3. SỬA (Lưu ý logic Password)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User model, string? NewPassword)
        {
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
            if (existingUser == null) return NotFound();

            if (!string.IsNullOrEmpty(NewPassword))
            {
                // 🔥 THÊM DÒNG NÀY: Nếu họ nhập mật khẩu mới -> Băm mật khẩu mới
                model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(NewPassword);
            }
            else
            {
                // Nếu để trống -> Giữ nguyên chuỗi mã hóa cũ
                model.PasswordHash = existingUser.PasswordHash;
            }

            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
        // 4. XÓA
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}