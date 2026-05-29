//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 29/05/2026 (Cập nhật chặn số âm tồn kho)
//Mô tả: Thực thể sản phẩm

using System;
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

        // 🔥 ĐÃ CẬP NHẬT: Chặn không cho nhập số âm và bắt buộc nhập
        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho không được nhỏ hơn 0")]
        [Required(ErrorMessage = "Vui lòng nhập số lượng tồn kho")]
        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}