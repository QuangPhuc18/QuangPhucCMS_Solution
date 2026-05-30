//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể Danh mục sản phẩm (E-commerce)

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100)]
        public string Name { get; set; } // Tên danh mục sản phẩm

        public string? Description { get; set; } // Mô tả danh mục sản phẩm

        // Quan hệ: Một danh mục sản phẩm có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }
    }
}