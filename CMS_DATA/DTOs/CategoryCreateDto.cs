using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.DTOs
{
    public class CategoryCreateDto
    {
        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }
    }
}