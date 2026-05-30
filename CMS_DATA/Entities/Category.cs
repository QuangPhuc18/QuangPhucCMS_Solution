//SinhVien: Lê Quang Phúc
//MSSV: 2123110118
//Lớp: CCQ2311D
//Mô tả: Thực thể danh mục bài viết (Tin tức)

using System.Collections.Generic;

namespace CMS_DATA.Entities
{
    public class Category
    {
        public int Id { get; set; } // Mã danh mục bài viết
        public string Name { get; set; } // Tên danh mục bài viết
        public string Description { get; set; } // Mô tả danh mục bài viết

        // Quan hệ: Một danh mục bài viết có nhiều bài viết
        public virtual ICollection<Post>? Posts { get; set; }
    }
}