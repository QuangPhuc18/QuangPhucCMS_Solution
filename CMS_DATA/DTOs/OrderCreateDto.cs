using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.DTOs
{
    // 1. DTO cho từng món hàng trong giỏ
    public class OrderDetailDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public int Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }
    }

    // 2. DTO tổng cho Đơn hàng gửi lên
    public class OrderCreateDto
    {
        [Required]
        public int CustomerId { get; set; }

        public string? Notes { get; set; }

        // Mảng chứa các món hàng khách đã chọn (Dùng DTO nhỏ ở trên)
        [Required]
        public List<OrderDetailDto> OrderDetails { get; set; }
    }
}