//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả: Thực thể  Đơn hàng 

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS_DATA.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; } // Mã đơn hàng

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int CustomerId { get; set; }  // Mã khách hàng đặt hàng

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; } // Ghi chú đơn hàng

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; } // Tham chiếu tới khách hàng

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; } // Danh sách chi tiết đơn hàng

    }
}
