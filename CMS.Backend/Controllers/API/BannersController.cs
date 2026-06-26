using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS_DATA;
using CMS_DATA.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/banners")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/banners/active
        // API này Frontend sẽ gọi để lấy các banner đang chạy
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Banner>>> GetActiveBanners()
        {
            return await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .ThenByDescending(b => b.Id)
                .ToListAsync();
        }

        // GET: api/banners
        // API này Admin dùng để quản lý toàn bộ Banner (kể cả đã tắt)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Banner>>> GetAllBanners()
        {
            return await _context.Banners
                .OrderByDescending(b => b.Id)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Banner>> PostBanner(Banner banner)
        {
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetActiveBanners), new { id = banner.Id }, banner);
        }
    }
}
