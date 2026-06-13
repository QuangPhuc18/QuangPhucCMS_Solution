using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.DTOs
{
    public class CategoryProductCreateDto
    {
        [Required(ErrorMessage = "Tên danh mục sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }
    }
}