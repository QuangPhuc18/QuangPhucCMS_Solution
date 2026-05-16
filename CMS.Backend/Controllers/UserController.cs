//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả : Controller Quản lý người dùng (User)

using CMS_DATA.Entities; // Phải có dòng này để dùng lớp User
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public IActionResult Index()
        {
            // 1. Tạo danh sách Người dùng giả (Mock Data)
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Username = "admin_Phuc",
                    FullName = "Lê Quang Phúc",
                    Role = "Administrator"
                },
                new User
                {
                    Id = 2,
                    Username = "editor_01",
                    FullName = "Trần Văn Biên Tập",
                    Role = "Editor"
                },
                new User
                {
                    Id = 3,
                    Username = "author_minh",
                    FullName = "Lê Quang Minh",
                    Role = "Author"
                }
            };

            // 2. Trả về View kèm theo danh sách người dùng
            return View(users);
        }
    }
}
