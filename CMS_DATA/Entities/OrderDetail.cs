//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả: Thực thể chi tiết đơn hàng

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_DATA.Entities
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; } // Mã chi tiết đơn hàng

        public int OrderId { get; set; } // Mã đơn hàng

        public int ProductId { get; set; } // Mã sản phẩm

        public int Quantity { get; set; } // Số lượng sản phẩm trong đơn hàng

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; } // Giá tại thời điểm mua

        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; } // Tham chiếu tới đơn hàng

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }   // Tham chiếu tới sản phẩm

    }
}
