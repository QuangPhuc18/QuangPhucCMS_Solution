//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả: Thực thể sản phẩm


using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS_DATA.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; } // Mã sản phẩm

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; } // Tên sản phẩm

        public string? Description { get; set; } // Mô tả sản phẩm

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; } // Số lượng tồn kho

        public string? ImageUrl { get; set; } // URL hình ảnh sản phẩm

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; } // Mã danh mục sản phẩm  

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; } // Tham chiếu tới danh mục sản phẩm

    }
}
