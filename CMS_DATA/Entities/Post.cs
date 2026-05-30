//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể bài viết tin tức

using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_DATA.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } // Tiêu đề bài viết
        public string Content { get; set; } // Nội dung chi tiết
        public string ImageUrl { get; set; } // Hình ảnh đại diện
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Khóa ngoại liên kết chính xác tới bảng Category (Danh mục bài viết)
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}