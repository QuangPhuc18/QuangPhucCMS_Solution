using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.DTOs
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá sản phẩm không được nhỏ hơn 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập số lượng tồn kho")]
        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho không được nhỏ hơn 0")]
        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn danh mục sản phẩm")]
        public int CategoryProductId { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn thương hiệu sản phẩm")]
        public int BrandId { get; set; } // Thêm dòng này
    }
}