using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS_DATA.Entities
{
    public class Brand
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên thương hiệu không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        // Một thương hiệu thì có nhiều sản phẩm
        public ICollection<Product>? Products { get; set; }
    }
}