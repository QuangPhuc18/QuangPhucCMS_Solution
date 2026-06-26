# QuangPhuc CMS Solution - Đồ Án Lập Trình Web

Dự án Hệ thống Quản trị Nội dung và Thương mại Điện tử (CMS & E-Commerce) được thiết kế theo cấu trúc chuẩn 3 phân tầng.

## 🏗️ Cấu trúc thư mục (3 Phân tầng)

Dự án được chia làm 3 phân hệ chính:
1. **CMS_DATA**: Tầng Data Access Layer (DAL) chứa cấu hình Entity Framework Core, ApplicationDbContext và 8 class thực thể (Entities) định nghĩa cấu trúc cơ sở dữ liệu.
2. **CMS.Backend**: Tầng Business Logic và Admin Presentation. Bao gồm trang quản trị (Admin Dashboard) được xây dựng bằng **ASP.NET Core MVC** và các điểm cuối **Web API** cung cấp dữ liệu cho ứng dụng Frontend.
3. **cms.frontend**: Tầng Presentation dành cho Khách hàng (User Interface). Được xây dựng bằng **ReactJS**, giao tiếp với Backend thông qua các API RESTful.

---

## 🚀 Hướng dẫn khởi chạy dự án

Để chạy toàn bộ dự án, bạn cần khởi động Backend trước để mở cổng API, sau đó mới khởi động Frontend.

### Phần 1: Khởi chạy Backend (C# / ASP.NET Core)
1. Mở phần mềm **Visual Studio 2022**.
2. Chọn **Open a project or solution** và tìm đến file `QuangPhucCMS_Solution.sln` nằm ở thư mục gốc.
3. Kiểm tra file `appsettings.json` trong project `CMS.Backend` để đảm bảo chuỗi kết nối (`DefaultConnection`) trỏ đúng vào SQL Server của bạn.
4. Mở **Package Manager Console** (Tools > NuGet Package Manager > Package Manager Console), chọn Default project là `CMS_DATA` và chạy lệnh:
   ```powershell
   Update-Database
   ```
   *(Lệnh này sẽ tạo tự động 8 bảng trong SQL Server dựa trên các file Migration có sẵn).*
5. Đảm bảo project `CMS.Backend` đang được set làm **Startup Project** (Click chuột phải vào CMS.Backend > Set as Startup Project).
6. Nhấn phím **F5** (hoặc nút Run màu xanh lá cây trên thanh công cụ) để khởi chạy Backend.
7. Trình duyệt sẽ tự động mở lên trang quản trị (Admin) hoặc Swagger API. Hãy **giữ nguyên cửa sổ Visual Studio này** chạy ngầm để API luôn mở.

### Phần 2: Khởi chạy Frontend (ReactJS)
1. Mở phần mềm **Visual Studio Code (VS Code)**.
2. Bấm File > Open Folder và chọn riêng thư mục `cms.frontend` (Nằm trong D:\QuangPhucCMS_Solution\cms.frontend).
3. Mở Terminal mới (Ctrl + `).
4. Nếu đây là lần chạy đầu tiên, bạn cần tải các thư viện bằng lệnh:
   ```bash
   npm install
   ```
5. Chạy ứng dụng ReactJS bằng lệnh:
   ```bash
   npm start
   ```
6. Trình duyệt sẽ tự động mở cửa sổ mới tại địa chỉ `http://localhost:3000` với giao diện trang chủ dành cho khách mua hàng.

---

## 🔑 Thông tin đăng nhập mặc định (Quản trị viên)
- **Đường dẫn Admin:** Khởi chạy Backend sẽ tự vào, hoặc truy cập `/Account/Login`.
- Vui lòng sử dụng tài khoản có Role là `Admin` để trải nghiệm toàn bộ các tính năng Quản lý Người dùng và Phân quyền.

## 📝 Chú thích về Git
- Dự án đã được cấu hình `.gitignore` chuẩn quốc tế, tự động loại bỏ các thư mục rác và file biên dịch như `node_modules/`, `bin/`, `obj/` để giữ cho Git Repository sạch sẽ.
- Lịch sử Git (Commit history) được ghi nhận đầy đủ theo từng tiến trình thực hành và xây dựng tính năng.
