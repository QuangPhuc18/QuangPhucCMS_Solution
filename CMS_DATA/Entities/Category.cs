//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả: Thực thể danh mục bài viết

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS_DATA.Entities
{
    public class Category
    {
        public int Id { get; set; } //Mã danh mục bài viết
        public string Name { get; set; } //Tên danh mục bài viết
        public string Description { get; set; } //Mô tả danh mục bài viết

        public virtual ICollection<Post> Posts { get; set; }
    }
}
