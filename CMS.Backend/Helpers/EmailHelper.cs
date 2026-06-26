using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CMS.Backend.Helpers
{
    public static class EmailHelper
    {
        // Cấu hình Email thật của hệ thống
        private const string SmtpServer = "smtp.gmail.com";
        private const int SmtpPort = 587;
        private const string SenderEmail = "lequangphuc18092005@gmail.com";
        private const string SenderPassword = "yjzpmxpafrdzwjcl"; // Mật khẩu ứng dụng (App Password)

        public static async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            try
            {
                using var client = new SmtpClient(SmtpServer, SmtpPort)
                {
                    Credentials = new NetworkCredential(SenderEmail, SenderPassword),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(SenderEmail, "Quang Phuc CMS"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(recipientEmail);

                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // Bắt lỗi để nếu tài khoản giả lập không chạy được, Website vẫn không bị văng lỗi màn hình đỏ 500
                Console.WriteLine($"[Email Error]: Không thể gửi email. Chi tiết: {ex.Message}");
            }
        }
    }
}
