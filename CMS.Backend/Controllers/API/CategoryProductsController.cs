using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS_DATA;
using CMS_DATA.Entities;
using CMS_DATA.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/category-products")]
    [ApiController]
    public class CategoryProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryProduct>>> GetCategoryProducts()
        {
            return await _context.CategoriesProducts.OrderByDescending(c => c.Id).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryProduct>> GetCategoryProduct(int id)
        {
            var categoryProduct = await _context.CategoriesProducts.FindAsync(id);
            if (categoryProduct == null) return NotFound();
            return categoryProduct;
        }

        [HttpPost]
        public async Task<ActionResult<CategoryProduct>> PostCategoryProduct(CategoryProductCreateDto dto)
        {
            var categoryProduct = new CategoryProduct
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.CategoriesProducts.Add(categoryProduct);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategoryProduct), new { id = categoryProduct.Id }, categoryProduct);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoryProduct(int id, CategoryProductCreateDto dto)
        {
            var categoryProduct = await _context.CategoriesProducts.FindAsync(id);
            if (categoryProduct == null) return NotFound();

            categoryProduct.Name = dto.Name;
            categoryProduct.Description = dto.Description;

            _context.Entry(categoryProduct).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoryProduct(int id)
        {
            var categoryProduct = await _context.CategoriesProducts.FindAsync(id);
            if (categoryProduct == null) return NotFound();
            _context.CategoriesProducts.Remove(categoryProduct);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}