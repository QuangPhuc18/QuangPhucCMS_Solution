//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể người dùng nội bộ (Admin/Editor)

namespace CMS_DATA.Entities
{
    public class User
    {
        public int Id { get; set; } // Mã người dùng quản trị
        public string Username { get; set; } // Tên đăng nhập
        public string PasswordHash { get; set; } // Chuỗi mật khẩu bảo mật sau khi băm bằng BCrypt
        public string FullName { get; set; } // Họ và tên đầy đủ nhân sự
        public string Role { get; set; } // Quyền hạn truy cập hệ thống (Admin hoặc Editor)
    }
}