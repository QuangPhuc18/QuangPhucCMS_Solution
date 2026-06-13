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
    [Route("api/brands")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BrandsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/brands
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
        {
            return await _context.Brands.OrderByDescending(b => b.Id).ToListAsync();
        }

        // GET: api/brands/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null) return NotFound(new { message = "Không tìm thấy thương hiệu!" });
            return Ok(brand);
        }

        // POST: api/brands
        [HttpPost]
        public async Task<ActionResult<Brand>> PostBrand(BrandCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var brand = new Brand
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, brand);
        }

        // PUT: api/brands/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, BrandCreateDto dto)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null) return NotFound(new { message = "Không tìm thấy thương hiệu này!" });

            brand.Name = dto.Name;
            brand.Description = dto.Description;

            _context.Entry(brand).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/brands/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null) return NotFound();

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}