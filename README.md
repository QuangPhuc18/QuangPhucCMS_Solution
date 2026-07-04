# BÁO CÁO CHI TIẾT ĐỒ ÁN MÔN HỌC
## HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ DIGISHOP

**THÔNG TIN SINH VIÊN:**
- **Sinh viên thực hiện:** Lê Quang Phúc


---

## CHƯƠNG 1: TỔNG QUAN VỀ ĐỀ TÀI VÀ MỤC TIÊU DỰ ÁN

### 1.1 Lời mở đầu
Trong thời đại công nghệ số 4.0, thương mại điện tử (E-Commerce) đã trở thành một phần không thể thiếu trong cuộc sống hàng ngày. Các doanh nghiệp chuyển dịch từ mô hình bán hàng truyền thống sang kinh doanh trực tuyến nhằm tiếp cận khách hàng trên quy mô rộng lớn hơn, tối ưu hóa chi phí vận hành và nâng cao trải nghiệm mua sắm. Xuất phát từ nhu cầu thực tiễn đó, hệ thống "Digishop" được phát triển nhằm mục đích cung cấp một giải pháp bán hàng trực tuyến toàn diện, chuyên biệt cho mảng điện máy và thiết bị công nghệ.

### 1.2 Mục tiêu của dự án
Dự án hướng đến việc xây dựng một hệ thống hoàn chỉnh bao gồm hai phần tách biệt (Decoupled Architecture):
- **Phần Client (Frontend):** Ứng dụng Single Page Application (SPA) xây dựng bằng React.js, cung cấp trải nghiệm mượt mà, tốc độ tải trang nhanh và giao diện thân thiện (UI/UX) với người dùng. Khách hàng có thể dễ dàng duyệt sản phẩm, xem chi tiết, thêm vào giỏ hàng và thực hiện quy trình thanh toán (Checkout) một cách nhanh chóng.
- **Phần Server (Backend):** Hệ thống API mạnh mẽ được phát triển bằng ASP.NET Core 8.0, kết hợp với Entity Framework Core để quản lý cơ sở dữ liệu SQL Server. Backend cung cấp cả giao diện Quản trị viên (Admin Dashboard) dạng MVC truyền thống, giúp chủ cửa hàng dễ dàng quản lý kho hàng, đơn đặt hàng, bài viết và các danh mục sản phẩm.

### 1.3 Phạm vi và giới hạn của đề tài
**Phạm vi:**
- Phân hệ Khách hàng: Duyệt danh mục, xem sản phẩm, tìm kiếm, quản lý giỏ hàng (Guest Cart và Logged-in Cart), đặt hàng, theo dõi lịch sử mua hàng, đọc tin tức/blog.
- Phân hệ Quản trị viên: Quản lý CRUD (Thêm, Đọc, Sửa, Xóa) cho Sản phẩm, Hãng sản xuất, Danh mục, Đơn hàng, Người dùng và Bài viết. Quản lý trạng thái đơn hàng (Đang xử lý, Đang giao, Hoàn thành).

**Giới hạn:**
- Ở giai đoạn hiện tại, hệ thống tập trung vào phương thức thanh toán truyền thống (Thanh toán khi nhận hàng - COD).
- Hệ thống đề xuất sản phẩm dựa trên logic "Bán chạy" (Hot Products) tính toán tự động qua số lượng bán ra.

---

## CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ SỬ DỤNG

### 2.1 Kiến trúc Decoupled (Tách biệt Frontend - Backend)
Khác với các ứng dụng nguyên khối (Monolithic), dự án sử dụng kiến trúc tách biệt. Backend chỉ đóng vai trò cung cấp dữ liệu thô dưới dạng JSON thông qua các RESTful API. Frontend sẽ đảm nhận toàn bộ việc render giao diện HTML/CSS, xử lý logic hiển thị và điều hướng trang (Routing).
- **Ưu điểm:** Khả năng mở rộng tốt (Scalability). Khi cần xây dựng thêm ứng dụng di động (iOS/Android), ta chỉ cần viết app kết nối thẳng vào hệ thống Web API đã có mà không cần sửa đổi Backend.

### 2.2 Công nghệ Backend (ASP.NET Core 8.0)
ASP.NET Core là một framework mã nguồn mở đa nền tảng mạnh mẽ của Microsoft. 
- **ASP.NET Core Web API:** Được sử dụng để xây dựng các Endpoint cung cấp dữ liệu cho React.
- **ASP.NET Core MVC:** Được dùng để xây dựng nhanh trang Quản trị (Admin) bằng Razor Pages, tận dụng khả năng render phía server (Server-Side Rendering) giúp bảo mật tốt hơn đối với các chức năng nhạy cảm.
- **Entity Framework Core (EF Core):** Đóng vai trò là ORM (Object-Relational Mapper), giúp thao tác với cơ sở dữ liệu SQL Server thông qua các class C# (Code-First Approach) thay vì phải viết các câu truy vấn SQL thuần túy phức tạp. EF Core tự động sinh ra các đoạn mã Migration để đồng bộ hóa cấu trúc Database.
- **Identity & JWT:** Sử dụng thư viện Identity để mã hóa mật khẩu, phân quyền. JSON Web Token (JWT) được dùng để duy trì phiên đăng nhập bảo mật cho API Frontend.

### 2.3 Công nghệ Frontend (React.js)
React là thư viện JavaScript phổ biến nhất hiện nay do Meta (Facebook) phát triển, chuyên dùng để xây dựng giao diện người dùng.
- **Virtual DOM:** Kỹ thuật đặc trưng của React giúp tối ưu hóa hiệu suất, chỉ cập nhật những thành phần UI có sự thay đổi thay vì tải lại toàn bộ trang.
- **Tailwind CSS:** Một thư viện CSS dạng tiện ích (Utility-first), cho phép viết CSS trực tiếp vào các thẻ HTML qua class name, giúp thiết kế nhanh chóng giao diện Responsive tương thích mọi thiết bị (Mobile, Tablet, PC).
- **Axios:** Công cụ gửi các request HTTP (GET, POST, PUT, DELETE) từ React đến ASP.NET Core API.

---

## CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1 Phân tích Yêu cầu chức năng (Functional Requirements)

**1. Đối với Khách vãng lai (Guest):**
- Có thể xem toàn bộ danh mục sản phẩm, bài viết tin tức.
- Có thể xem chi tiết thông số kỹ thuật, giá cả, thương hiệu, độ tồn kho của một sản phẩm.
- Có thể thêm sản phẩm vào giỏ hàng (hệ thống lưu giỏ hàng vào trình duyệt bằng LocalStorage).
- Được yêu cầu bắt buộc phải Đăng ký / Đăng nhập nếu muốn tiến hành Thanh toán (Checkout) nhằm đảm bảo thông tin liên lạc giao hàng.

**2. Đối với Khách hàng đã có tài khoản (Customer):**
- Kế thừa toàn bộ quyền hạn của Khách vãng lai.
- Có thể cập nhật thông tin cá nhân (Tên, Số điện thoại, Địa chỉ giao hàng).
- Thực hiện Đặt hàng (Checkout).
- Xem lịch sử các đơn hàng đã đặt và trạng thái hiện tại của chúng.

**3. Đối với Quản trị viên (Administrator / Staff):**
- Đăng nhập vào khu vực Dashboard bảo mật.
- Xem bảng điều khiển tóm tắt tổng số sản phẩm, tổng đơn hàng.
- Quản lý Hãng (Brands): Thêm, xóa, sửa các hãng (Samsung, LG, Sony...).
- Quản lý Danh mục (Categories): Tạo các danh mục cấp 1 để phân loại sản phẩm.
- Quản lý Sản phẩm (Products): Đăng tải sản phẩm mới kèm Hình ảnh (Upload File vật lý), thiết lập giá, mô tả, gán vào Danh mục và Hãng.
- Quản lý Đơn hàng (Orders): Xem thông tin khách đặt, các món hàng trong đơn, cập nhật trạng thái giao hàng.

### 3.2 Thiết kế Cơ sở dữ liệu (Database Schema)

Hệ thống được thiết kế tối ưu, tập trung vào 8 bảng dữ liệu cốt lõi (Core Tables) phục vụ trọn vẹn nghiệp vụ Thương mại điện tử:

**1. Bảng `Users` (Người dùng)**
- Chứa thông tin đăng nhập và thông tin cá nhân (Họ tên, Email, Mật khẩu mã hóa, Số điện thoại, Địa chỉ). Quản lý cả tài khoản Admin và Khách hàng.

**2. Bảng `CategoriesProducts` (Danh mục sản phẩm)**
- Lưu trữ các nhóm ngành hàng chính của hệ thống như: Điện thoại, Máy tính xách tay, Phụ kiện, v.v. Có trường chứa liên kết hình ảnh mô tả danh mục.

**3. Bảng `Brands` (Hãng sản xuất)**
- Chứa danh sách các thương hiệu nhà cung cấp. Một hãng có thể có rất nhiều sản phẩm thuộc các danh mục khác nhau.

**4. Bảng `Products` (Sản phẩm)**
- Bảng trung tâm của hệ thống. Chứa thông tin mô tả sản phẩm, giá bán, số lượng tồn kho (StockQuantity). Bảng này liên kết khóa ngoại (Foreign Key) trực tiếp với `Brands` và `CategoriesProducts`.

**5. Bảng `Orders` (Đơn đặt hàng)**
- Lưu trữ thông tin tổng quan của một hóa đơn khi khách hàng thanh toán thành công (Bao gồm Tổng tiền, Trạng thái giao hàng, Ngày đặt, Thông tin người nhận hàng).

**6. Bảng `OrderDetails` (Chi tiết Đơn hàng)**
- Bảng phân tách quan hệ nhiều-nhiều giữa Orders và Products. Mỗi dòng lưu trữ mã một sản phẩm được mua trong một hóa đơn cụ thể, kèm theo số lượng mua (Quantity) và đơn giá (UnitPrice) được chốt tại thời điểm mua.

**7. Bảng `Posts` (Bài viết / Tin tức)**
- Chứa nội dung các bài viết chia sẻ kinh nghiệm, tin tức công nghệ nhằm thu hút lưu lượng truy cập (SEO) cho trang web.

**8. Bảng `Banners` (Bảng Quảng cáo)**
- Lưu trữ cấu hình các hình ảnh Banner, Carousel chuyển động trên trang chủ, giúp Admin linh hoạt thay đổi các chương trình khuyến mãi theo sự kiện.

---

## CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG BACKEND (ASP.NET CORE)

### 4.1. Thiết lập Entity Framework Core
Entity Framework Core là "trái tim" xử lý dữ liệu của hệ thống. Các thực thể (Entities) được ánh xạ (Mapping) bằng cấu hình Fluent API để thiết lập các khóa ngoại chặt chẽ, quy tắc xóa dữ liệu (Cascade/Restrict) để bảo vệ toàn vẹn dữ liệu. Khi có sự thay đổi cấu trúc bảng, lệnh Migration sẽ được chạy để tự động sinh ra tập lệnh SQL cập nhật thẳng vào hệ quản trị SQL Server.

### 4.2. Cấu trúc MVC cho Quản trị viên (Admin Panel)
Trang quản trị (Admin Dashboard) được thiết kế bằng công nghệ MVC truyền thống thay vì React. Các View được viết bằng ngôn ngữ Razor, chạy bằng công nghệ Server-Side Rendering (SSR). Việc sử dụng SSR cho Admin giúp nâng cao tính bảo mật, tránh lộ các đoạn mã logic nhạy cảm ra môi trường Client. 
Hệ thống sử dụng Session và Cookie để bảo mật các route quản trị, kiên quyết chặn những người dùng không có cờ (role) Administrator.

### 4.3. Quản lý Tệp Hình Ảnh (File Upload)
Khác với việc lưu chuỗi mã hóa base64 trực tiếp vào CSDL gây nặng máy chủ SQL, dự án áp dụng chiến lược tối ưu: Lưu tệp tin vật lý vào ổ cứng cục bộ (`wwwroot/uploads`) và chỉ lưu đường dẫn tương đối vào SQL. Khi khách hàng tải ảnh lên, file sẽ được hệ thống mã hóa tên bằng UUID để tránh bị trùng lặp tên với các ảnh cũ.

### 4.4. Thuật toán "Sản phẩm Bán chạy" (Hot Products)
Hệ thống KHÔNG SỬ DỤNG một cột tĩnh (`SoldQuantity`) trong bảng Products để đếm số lượng bán. Thay vào đó, API thiết kế thuật toán linh hoạt và Real-time (Động) dựa trên công nghệ LINQ. 
Khi API được gọi, EF Core sẽ tạo câu truy vấn SQL để JOIN bảng Products với bảng OrderDetails. Nó tính tổng (Sum) toàn bộ số lượng hàng đã bán của mỗi mặt hàng, sau đó sắp xếp giảm dần (Order By Descending) và chỉ cắt lấy 3 sản phẩm có tổng số lượng bán cao nhất (Take 3) để đẩy ra Frontend. Nhờ vậy, dữ liệu luôn chính xác tuyệt đối mà không cần cronjob đồng bộ.

### 4.5 Tự động hóa Gửi Email (Email Notification)
Mỗi khi khách hàng hoàn tất thủ tục thanh toán, Controller sẽ nhận dữ liệu, ghi hóa đơn vào DB, thực hiện thuật toán trừ lùi số lượng tồn kho của sản phẩm, và cuối cùng kích hoạt tiến trình gửi thư điện tử. Lớp tiện ích SMTP của hệ thống sẽ soạn sẵn một HTML Template chứa chi tiết đơn hàng, đơn giá, tổng tiền, tự động kết nối với Server Gmail và gửi đến Hộp thư khách hàng.

---

## CHƯƠNG 5: TRIỂN KHAI VÀ XÂY DỰNG FRONTEND (REACT.JS)

### 5.1. Tổ chức Component và React Router
Dự án áp dụng phương pháp phát triển Component-based. Toàn bộ giao diện Digishop được tách nhỏ thành các khối độc lập (Header, Footer, Danh sách sản phẩm, Thẻ sản phẩm) nhằm tăng cường khả năng tái sử dụng (Reusability). React Router DOM quản lý các đường dẫn URL ảo trên trình duyệt, biến Digishop thành một Single Page Application (Trang web đơn) thực thụ, người dùng chuyển trang không hề có độ trễ tải lại (Page Reload).

### 5.2. Quản lý trạng thái (State Management) với Hooks
Sử dụng hàm `useState` để lưu trữ dữ liệu từ API và các thay đổi người dùng nhập vào. Sử dụng `useEffect` để bắt các sự kiện vòng đời (Lifecycle), giúp tự động kích hoạt lời gọi Axios lên Server lấy dữ liệu ngay khi Component được xuất hiện trên màn hình.

### 5.3. Trải nghiệm Giỏ hàng Khách (Guest Cart)
Hệ thống Digishop được tối ưu UX (User Experience) bằng cách cho phép khách duyệt web vãng lai thoải mái thêm hàng vào giỏ mà không cần tạo tài khoản. 
- Giỏ hàng được lưu trữ an toàn trong `localStorage` của trình duyệt. 
- Ngay khi khách bấm thêm vào giỏ, Javascript sẽ đối chiếu ngay lập tức với `StockQuantity` của mặt hàng. Nếu khách vô tình chọn quá nhiều, hệ thống cảnh báo và chặn lại để ngăn quá tải (Overselling).
- Khách hàng chỉ bị hệ thống "ép" phải Đăng nhập (hoặc Đăng ký) khi họ quyết định nhấn vào nút "Thanh toán", mục đích là để hệ thống thu thập chính xác Địa chỉ và Số điện thoại giao hàng.

### 5.4. Giao tiếp API và Xử lý CORS
Frontend tích hợp Axios đóng vai trò là "Sứ giả" vận chuyển tín hiệu HTTP. Backend ASP.NET được thiết lập cơ chế CORS cho phép duy nhất tên miền của React được phép đọc dữ liệu. Đối với các thao tác nhạy cảm (Đăng đơn hàng, Xem lịch sử), Axios được cấu hình cơ chế tự động đính kèm chìa khóa Bearer Token (JWT) vào Header của mọi request.

---

## CHƯƠNG 6: CẤU TRÚC THƯ MỤC CỦA DỰ ÁN

Dưới đây là sơ đồ cấu trúc của toàn bộ giải pháp (Solution) được tổ chức và liên kết một cách chuẩn mực dựa theo thực tế dự án:

```text
D:\QuangPhucCMS_Solution
│
├── CMS.Backend/            # Dự án chính của Backend (ASP.NET Core Web API & MVC)
│   ├── Controllers/        # Chứa API Controllers (cho React) và MVC Controllers (cho Admin)
│   ├── Helpers/            # Các hàm hỗ trợ (Ví dụ: Tiện ích Gửi Email SMTP)
│   ├── Views/              # Các giao diện Razor Pages dành cho trang Admin
│   └── wwwroot/uploads/    # Nơi lưu trữ vật lý các file hình ảnh upload từ hệ thống
│
├── CMS_DATA/               # Data Access Layer (Class Library chứa Database)
│   ├── DTOs/               # Các Data Transfer Object
│   ├── Entities/           # Định nghĩa 8 bảng cốt lõi (Products, Orders, v.v...)
│   └── Migrations/         # Lịch sử cập nhật Database từ EF Core
│
├── cms.frontend/           # Dự án Frontend Client (React.js)
│   ├── public/             # Chứa tệp index.html và icon tĩnh
│   ├── src/
│   │   ├── api/            # Cấu hình API và Interceptors
│   │   ├── components/     # Giao diện dùng chung (Header, Footer, v.v.)
│   │   ├── pages/          # Các trang chính (Home, Checkout, Product Detail, Cart, v.v.)
│   │   ├── services/       # Nơi tập trung các file gọi API bằng Axios
│   │   └── utils/          # Các hàm logic tái sử dụng (Quản lý Guest Cart localStorage)
│   └── package.json        # Khai báo cấu hình và thư viện Node Modules
│
├── image/                  # Thư mục lưu trữ assets hình ảnh ban đầu (Banners, Icons, Danh mục)
│
└── QuangPhucCMS_Solution.sln # Tệp gốc của Solution dùng để mở toàn bộ dự án bằng Visual Studio
```

---

## CHƯƠNG 7: HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH DỰ ÁN

Để triển khai dự án Digishop trên môi trường Localhost, cần thực hiện đồng bộ giữa Backend và Frontend như sau:

### 7.1 Môi trường yêu cầu (Prerequisites)
1. **Phần mềm:** Visual Studio 2022 (Community/Enterprise), Visual Studio Code, SQL Server Management Studio (SSMS).
2. **Framework & Runtime:** .NET 8.0 SDK, Node.js (phiên bản v18.x trở lên).

### 7.2 Khởi tạo Cơ sở dữ liệu và Backend
**Bước 1:** Mở tệp Solution `QuangPhucCMS_Solution.sln` bằng công cụ Visual Studio 2022.
**Bước 2:** Mở tệp `CMS.Backend/appsettings.json`. Điều chỉnh thuộc tính `"DefaultConnection"` (Chuỗi kết nối) trỏ về đúng máy chủ SQL Server cục bộ của máy tính bạn.
**Bước 3:** Sử dụng công cụ Migration của Entity Framework để tạo bảng. Bật cửa sổ `Package Manager Console` (View -> Other Windows -> Package Manager Console). Đảm bảo ô *Default project* đang trỏ vào `CMS_DATA`. Chạy dòng lệnh sau:
> `Update-Database`
Hệ thống sẽ tự động quét thư mục Entities và đẩy các bảng vào SQL Server.
**Bước 4:** Ấn phím `F5` hoặc nút "Start Debugging" để khởi động Server Backend. Cửa sổ dòng lệnh sẽ chạy và Backend sẽ trực chiến ở cổng mạng `https://localhost:7008`.

### 7.3 Khởi động Frontend
**Bước 1:** Mở một cửa sổ Terminal riêng biệt, di chuyển đường dẫn vào thư mục của giao diện:
> `cd D:\QuangPhucCMS_Solution\cms.frontend`
**Bước 2:** Cài đặt toàn bộ các thư viện phụ thuộc của React được khai báo trong `package.json` bằng lệnh:
> `npm install`
**Bước 3:** Khởi động Webpack Server để khởi chạy ứng dụng React:
> `npm start`
**Bước 4:** Trình duyệt sẽ tự động kích hoạt trang web tại địa chỉ `http://localhost:3000`. Tại đây bạn có thể thao tác với giao diện Digishop trơn tru với dữ liệu được tải về từ cổng 7008.

---

## CHƯƠNG 8: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 8.1 Kết quả đạt được
Qua quá trình nỗ lực và phát triển, hệ thống **Digishop** đã hoàn thành xuất sắc các mục tiêu đề ra ban đầu. 
- Xây dựng thành công kiến trúc Decoupled hiện đại, tách biệt hoàn toàn vai trò của C# (Xử lý tác vụ nặng, Database, Security) và Javascript (Xử lý giao diện động, Trải nghiệm khách hàng).
- Cung cấp trải nghiệm mua sắm mượt mà, cho phép khách hàng thao tác thả ga mà không cần đăng nhập ngay lập tức (Guest Cart).
- Áp dụng các công nghệ bảo mật tiêu chuẩn công nghiệp (JWT, CORS, Identity).
- Trang quản trị (Admin Dashboard) hoạt động trơn tru với các tính năng quản lý, phân loại, tìm kiếm và thao tác với tệp vật lý (Image Upload).

### 8.2 Hạn chế của dự án
Dự án hiện đang chạy trên môi trường cục bộ (Localhost) và sử dụng dữ liệu mô phỏng. Việc lưu trữ hình ảnh vật lý trực tiếp lên ổ cứng Server (`wwwroot/uploads`) trong tương lai nếu Server có lượng truy cập cao sẽ dẫn đến khó khăn trong việc mở rộng ổ đĩa.

### 8.3 Hướng phát triển trong tương lai
Để biến Digishop thành một sản phẩm có thể thương mại hóa (Production-ready), các tính năng sau sẽ được tiếp tục nghiên cứu:
1. **Lưu trữ Cloud (Cloud Storage):** Chuyển đổi cơ chế lưu ảnh sang các dịch vụ đám mây chuyên dụng như Amazon S3 nhằm tối ưu hóa tốc độ tải ảnh (CDN).
2. **Tích hợp thanh toán số (Digital Payments):** Bổ sung API của VNPAY, MoMo, PayPal, cho phép khách thanh toán trực tiếp qua thẻ tín dụng và nhận xác nhận tự động thông qua Webhook.
3. **Phân tích dữ liệu (Data Analytics):** Xây dựng trang biểu đồ dạng Chart.js cho Dashboard nhằm giúp Admin theo dõi doanh thu theo Tuần/Tháng/Năm, so sánh tỉ lệ tăng trưởng.
4. **Hệ thống Đề xuất (Recommendation System):** Thu thập dữ liệu giỏ hàng và áp dụng Machine Learning cơ bản để gợi ý các sản phẩm liên quan (Ví dụ: Khách mua điện thoại sẽ gợi ý thêm ốp lưng, sạc nhanh).

---

