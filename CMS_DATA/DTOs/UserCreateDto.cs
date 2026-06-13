using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.DTOs
{
    public class UserCreateDto
    {
        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string FullName { get; set; }

        public string? Role { get; set; }

        // Mật khẩu có thể để trống khi Edit (giữ pass cũ) nên dùng dấu ?
        public string? Password { get; set; }
    }
}