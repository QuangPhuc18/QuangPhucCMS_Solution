//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Controller xử lý Đăng nhập và Đăng xuất (Cookie Authentication)

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS_DATA;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Hiển thị form đăng nhập
        [HttpGet]
        public IActionResult Login()
        {
            // Nếu đã đăng nhập rồi mà lỡ bấm vào trang Login thì đá thẳng về Home
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        // 2. Xử lý thông tin người dùng gửi lên
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            // 1. Chỉ tìm User bằng Username trước (Không check password ở đây)
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            // 2. Kiểm tra nếu có User VÀ Mật khẩu nhập vào khớp với mã băm trong DB
            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role ?? "Editor"),
            new Claim("FullName", user.FullName)
        };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Home");
            }

            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            return View();
        }
        // 3. Đăng xuất
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // 4. Trang báo lỗi cấm truy cập
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}