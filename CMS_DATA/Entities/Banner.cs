using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề Banner là bắt buộc")]
        public string Title { get; set; }

        public string Subtitle { get; set; }

        [Required(ErrorMessage = "Hình ảnh Banner là bắt buộc")]
        public string ImageUrl { get; set; }

      

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; } = 0; // Để sắp xếp vị trí Banner
    }
}
