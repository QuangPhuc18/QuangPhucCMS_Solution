using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CMS_DATA.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToCategoryProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Bỏ qua DropColumn LinkUrl vì trong CSDL đã bị xóa thủ công

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "CategoriesProducts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "CategoriesProducts");

            // Bỏ qua việc add lại LinkUrl
        }
    }
}
