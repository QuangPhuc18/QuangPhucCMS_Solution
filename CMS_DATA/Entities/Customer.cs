//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể khách hàng ứng dụng

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.Entities
{
    public class Customer
    {
        [Key]
        public int Id { get; set; } // Mã khách hàng

        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string FullName { get; set; } // Họ và tên khách hàng

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; } // Địa chỉ email khách hàng

        public string? Phone { get; set; } // Số điện thoại khách hàng
        public string? Address { get; set; } // Địa chỉ khách hàng

        [Required]
        public string Password { get; set; } // Lưu mật khẩu phục vụ mục đích tối giản học tập

        // Quan hệ: Một khách hàng thực hiện nhiều đơn hàng
        public virtual ICollection<Order>? Orders { get; set; }
    }
}