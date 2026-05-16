//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả: Thực thể  người dùng
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS_DATA.Entities
{
    public class User
    {
        public int Id { get; set; } //Mã người dùng
        public string Username { get; set; } //Tên đăng nhập
        public string PasswordHash { get; set; }    // Mật khẩu đã được băm
        public string FullName { get; set; } // Họ và tên đầy đủ

        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên

    }
}
