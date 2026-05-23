//SinhVien: Lê Quang Phúc
//MSSV:2123110118
//Lớp: CCQ2311D
//Ngày : 16/05/2026
//Mô tả: Lớp ApplicationDbContext đại diện cho ngữ cảnh cơ sở dữ liệu.

using CMS_DATA.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS_DATA
{
    public class ApplicationDbContext :DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // Khai báo các bảng dữ liệu
        public DbSet<Category> Categories { get; set; } // Bảng danh mục sản phẩm
        public DbSet<Post> Posts { get; set; } // Bảng bài viết
        public DbSet<User> Users { get; set; }  // Bảng người dùng
        public DbSet<CategoryProduct> CategoriesProducts { get; set; } // Bảng liên kết nhiều-nhiều giữa danh mục và sản phẩm
        public DbSet<Product> Products { get; set; } // Bảng sản phẩm
        public DbSet<Customer> Customers { get; set; } // Bảng khách hàng
        public DbSet<Order> Orders { get; set; } // Bảng đơn hàng
        public DbSet<OrderDetail> OrderDetails { get; set; } // Bảng chi tiết đơn hàng



    }
}
