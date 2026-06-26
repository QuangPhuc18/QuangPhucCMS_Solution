using System;
using System.Threading.Tasks;
using CMS_DATA;
using CMS_DATA.Entities;
using CMS_DATA.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Backend.Helpers;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(CustomerRegisterDto dto)
        {
            try
            {
                // Kiểm tra xem Email đã có ai đăng ký chưa
                if (await _context.Customers.AnyAsync(c => c.Email == dto.Email))
                {
                    return BadRequest(new { message = "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng Email khác!" });
                }

                // Tạo Entity Customer mới
                var customer = new Customer
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Address = dto.Address,
                    // BĂM MẬT KHẨU bằng BCrypt trước khi lưu vào CSDL
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
                };

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đăng ký tài khoản thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi hệ thống khi đăng ký: {ex.Message}" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(CustomerLoginDto dto)
        {
            try
            {
                // 1. Tìm Khách hàng bằng Email
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
                if (customer == null)
                {
                    return BadRequest(new { message = "Email hoặc Mật khẩu không chính xác!" });
                }

                // 2. So khớp Mật khẩu nhập vào với Mật khẩu đã Băm (Hash) trong Database
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, customer.Password);
                if (!isPasswordValid)
                {
                    return BadRequest(new { message = "Email hoặc Mật khẩu không chính xác!" });
                }

                // 3. Trả về Token giả lập (Có thể thay bằng JWT thực tế sau này) và thông tin Khách hàng
                // Frontend mong muốn: response.data.token và response.data.user
                var fakeToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

                var userInfo = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    role = "Customer" // Phân biệt với Admin/Staff
                };

                return Ok(new 
                { 
                    message = "Đăng nhập thành công!",
                    token = fakeToken, 
                    user = userInfo 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi hệ thống khi đăng nhập: {ex.Message}" });
            }
        }
        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, CustomerUpdateProfileDto dto)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                    return NotFound(new { message = "Không tìm thấy người dùng!" });

                customer.FullName = dto.FullName;
                customer.Phone = dto.Phone;
                customer.Address = dto.Address;

                _context.Entry(customer).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Trả về thông tin user mới để Frontend cập nhật localStorage
                var userInfo = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    role = "Customer"
                };

                return Ok(new { message = "Cập nhật hồ sơ thành công!", user = userInfo });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi hệ thống khi cập nhật hồ sơ: {ex.Message}" });
            }
        }

        [HttpPut("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, CustomerChangePasswordDto dto)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                    return NotFound(new { message = "Không tìm thấy người dùng!" });

                // Kiểm tra mật khẩu hiện tại
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, customer.Password);
                if (!isPasswordValid)
                {
                    return BadRequest(new { message = "Mật khẩu hiện tại không chính xác!" });
                }

                // Cập nhật mật khẩu mới
                customer.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

                _context.Entry(customer).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đổi mật khẩu thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi hệ thống khi đổi mật khẩu: {ex.Message}" });
            }
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            try
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
                if (customer == null)
                {
                    // Trả về OK giả lập để tránh bị hacker dùng kỹ thuật Email Enumeration dò tìm tài khoản
                    return Ok(new { message = "Nếu email này tồn tại, chúng tôi đã gửi mật khẩu mới cho bạn." });
                }

                // Tạo mật khẩu mới ngẫu nhiên (Ví dụ: Mật khẩu mới gồm 6 chữ số)
                string newPassword = new Random().Next(100000, 999999).ToString();
                
                // MẸO HỖ TRỢ TEST: In mật khẩu mới ra màn hình đen Console của Backend để bạn dễ dàng nhìn thấy mà không cần vào Email thật
                Console.WriteLine($"\n===========================================");
                Console.WriteLine($"[TESTING] KHÁCH YÊU CẦU QUÊN MẬT KHẨU");
                Console.WriteLine($"Email: {customer.Email}");
                Console.WriteLine($"MẬT KHẨU MỚI LÀ: {newPassword}");
                Console.WriteLine($"===========================================\n");

                // Mã hóa mật khẩu mới
                customer.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);

                _context.Entry(customer).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Gửi email cho khách hàng
                string emailBody = $@"
                    <h2>Yêu cầu cấp lại mật khẩu</h2>
                    <p>Chào <b>{customer.FullName}</b>,</p>
                    <p>Mật khẩu mới của bạn là: <b>{newPassword}</b></p>
                    <p>Vui lòng đăng nhập và đổi lại mật khẩu ngay sau khi truy cập thành công.</p>
                    <br/>
                    <p>Trân trọng,<br/>Quang Phuc CMS Team</p>
                ";

                await EmailHelper.SendEmailAsync(customer.Email, "Mật khẩu mới - Quang Phuc CMS", emailBody);

                return Ok(new { message = "Mật khẩu mới đã được gửi vào Email của bạn. Vui lòng kiểm tra hòm thư!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi hệ thống khi cấp lại mật khẩu: {ex.Message}" });
            }
        }
    }
}
