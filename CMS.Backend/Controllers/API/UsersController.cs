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
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            // Không trả về PasswordHash
            var users = await _context.Users
                .OrderByDescending(u => u.Id)
                .Select(u => new { u.Id, u.Username, u.FullName, u.Role })
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy tài khoản!" });
            user.PasswordHash = ""; // Ẩn mật khẩu
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserCreateDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest(new { message = "Tên đăng nhập này đã tồn tại!" });

            if (string.IsNullOrEmpty(dto.Password))
                return BadRequest(new { message = "Vui lòng nhập mật khẩu cho tài khoản mới!" });

            var user = new User
            {
                Username = dto.Username,
                FullName = dto.FullName,
                Role = dto.Role,
                // Băm mật khẩu từ DTO rồi gán vào Entity
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            user.PasswordHash = "";
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserCreateDto dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser == null) return NotFound(new { message = "Không tìm thấy tài khoản!" });

            // Kiểm tra đổi sang Username của người khác
            if (dto.Username != existingUser.Username && await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest(new { message = "Tên đăng nhập này đã có người sử dụng!" });

            existingUser.Username = dto.Username;
            existingUser.FullName = dto.FullName;
            existingUser.Role = dto.Role;

            // Chỉ cập nhật và băm lại mật khẩu nếu ReactJS có gửi mật khẩu mới lên
            if (!string.IsNullOrEmpty(dto.Password))
            {
                existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}