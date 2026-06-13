using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.DTOs
{
    public class PostCreateDto
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        public string Title { get; set; }

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        // Chỉ cần lấy ID của danh mục bài viết, không kéo nguyên mảng Category
        [Required(ErrorMessage = "Vui lòng chọn danh mục")]
        public int CategoryId { get; set; }
    }
}