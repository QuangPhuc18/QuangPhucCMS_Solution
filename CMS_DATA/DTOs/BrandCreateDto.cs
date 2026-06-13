using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.DTOs // 1. Xem kỹ chữ CMS_DATA viết hoa, DTOs viết hoa
{
    public class BrandCreateDto // 2. Xem kỹ chữ "Dto" (chữ 't' và 'o' viết thường)
    {
        [Required(ErrorMessage = "Tên thương hiệu không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }
    }
}