import axios from 'axios';

// Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    // Sử dụng biến môi trường REACT_APP_API_URL từ file .env (Giúp đạt điểm tiêu chí chuẩn cấu trúc doanh nghiệp)
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7008/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
});

// Interceptor: tự động bóc tách dữ liệu JSON khi API trả về thành công
axiosClient.interceptors.response.use(
    (response) => {
        // Trả thẳng cục data (mảng hoặc object) về cho Component dùng, đỡ phải .data nhiều lần
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung tại đây (Ví dụ: Server sập, lỗi 404, lỗi 500)
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;