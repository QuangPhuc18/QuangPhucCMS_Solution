//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả: Thực thể khách hàng


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace CMS_DATA.Entities
{
    public class Customer
    {
        [Key]
        public int Id { get; set; } // Mã khách hàng

        [Required]
        public string FullName { get; set; } // Họ và tên khách hàng

        [Required]
        [EmailAddress]
        public string Email { get; set; } // Địa chỉ email khách hàng

        public string? Phone { get; set; } // Số điện thoại khách hàng

        public string? Address { get; set; } // Địa chỉ khách hàng

        [Required]
        public string Password { get; set; } // Lưu mật khẩu thô theo yêu cầu tối giản

        public virtual ICollection<Order>? Orders { get; set; } // Danh sách đơn hàng của khách hàng    

    }
}
