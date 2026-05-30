//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể sản phẩm Coffee Shop

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_DATA.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá sản phẩm không được nhỏ hơn 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho không được nhỏ hơn 0")]
        [Required(ErrorMessage = "Vui lòng nhập số lượng tồn kho")]
        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        // 🔥 ĐÃ SỬA CHÍNH XÁC: Liên kết trực tiếp sang CategoryProduct thay vì Category bài viết cũ
        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }

        // Mối quan hệ: Một sản phẩm xuất hiện trong nhiều chi tiết đơn hàng
        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}