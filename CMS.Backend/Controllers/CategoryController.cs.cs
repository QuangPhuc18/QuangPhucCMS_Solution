//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả : Controller quản lý danh mục sản phẩm

using CMS_DATA.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            // Tạo danh sách dữ liệu mẫu trực tiếp trong code
            var list = new List<Category>
            {
            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }

            };
            return View(list); // Gửi danh sách này sang giao diện
        }
    }
}
