//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể thông tin tổng quát của đơn hàng

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_DATA.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; } // Mã đơn hàng

        public DateTime OrderDate { get; set; } = DateTime.Now; // Ngày đặt hàng

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; } // Ghi chú đơn hàng

        // Khóa ngoại liên kết tới Customer
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }

        // Quan hệ: Một đơn hàng chứa nhiều chi tiết sản phẩm cụ thể
        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}