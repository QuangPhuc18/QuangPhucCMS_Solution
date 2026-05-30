//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể chi tiết danh mục sản phẩm trong đơn hàng

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

        [Range(1, int.MaxValue, ErrorMessage = "Số lượng mua tối thiểu phải từ 1")]
        public int Quantity { get; set; } // Số lượng sản phẩm mua

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; } // Giá sản phẩm chốt tại thời điểm mua

        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; } // Tham chiếu tới thực thể đơn hàng

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; } // Tham chiếu tới thực thể sản phẩm
    }
}