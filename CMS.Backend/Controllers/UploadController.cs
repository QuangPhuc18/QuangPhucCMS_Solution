using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class UploadController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> CKEditor(IFormFile upload)
        {
            if (upload != null && upload.Length > 0)
            {
                // Thư mục lưu ảnh cho CKEditor
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "ckeditor");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Chống trùng tên file
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(upload.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Lưu ảnh vào vật lý
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(fileStream);
                }

                // Chuẩn JSON trả về cho CKEditor 5
                var url = $"/images/ckeditor/{uniqueFileName}";
                return Json(new { uploaded = 1, fileName = uniqueFileName, url = url });
            }

            return Json(new { uploaded = 0, error = new { message = "Không có file nào được tải lên." } });
        }
    }
}
