using Microsoft.EntityFrameworkCore;
using CMS_DATA;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// 1. ĐĂNG KÝ CÁC DỊCH VỤ (SERVICES CONTAINER)
// =========================================================

// Đăng ký Controllers với Views (MVC) + Cấu hình JSON để fix vòng lặp thực thể
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Đăng ký kết nối Cơ sở dữ liệu SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký Cookie Authentication dành cho trang quản trị Admin
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

// Đăng ký chính sách CORS (Cho phép ReactJS Front-end gọi API)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Mở cổng chính xác cho ứng dụng ReactJS
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Đăng ký Swagger để làm tài liệu và test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Bắt Swagger chỉ quét các Controller dành cho API (có chứa [ApiController])
    // Điều này giúp loại bỏ các MVC Controller ra khỏi tài liệu, tránh gây lỗi 500
    options.DocInclusionPredicate((docName, apiDesc) =>
    {
        var hasApiController = apiDesc.ActionDescriptor.EndpointMetadata.OfType<Microsoft.AspNetCore.Mvc.ApiControllerAttribute>().Any();
        return hasApiController;
    });
});

var app = builder.Build();

// =========================================================
// 2. CẤU HÌNH ĐƯỜNG ỐNG XỬ LÝ (HTTP REQUEST PIPELINE / MIDDLEWARE)
// =========================================================

// Kích hoạt giao diện hiển thị Swagger (Đặt ở đầu để test API không bị chặn)
app.UseSwagger();
app.UseSwaggerUI();

// Cấu hình môi trường Production / Development
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// 1. Chuyển hướng HTTPS (Luôn đặt trên cùng)
app.UseHttpsRedirection();

// 2. Quyền truy cập các file tĩnh trong wwwroot (Ảnh sản phẩm, ảnh banner...)
app.UseStaticFiles();

// 3. Phân tích định tuyến URL
app.UseRouting();

// 4. 🔥 KÍCH HOẠT CORS (Bắt buộc phải đặt ngay sau UseRouting và trước Auth)
app.UseCors("AllowReactApp");

// 5. 🔥 KÍCH HOẠT XÁC THỰC DANH TÍNH (Kiểm tra đăng nhập)
app.UseAuthentication();

// 6. 🔥 KÍCH HOẠT ỦY QUYỀN TRUY CẬP (Kiểm tra quyền Admin / Khách hàng)
app.UseAuthorization();

// 7. 🔥 ĐỊNH NGHĨA ROUTE ĐIỀU HƯỚNG MẶC ĐỊNH CHO WEB MVC VÀ ÁNH XẠ API
app.MapControllers(); // Ánh xạ các Web API Controllers

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Khởi chạy ứng dụng
app.Run();