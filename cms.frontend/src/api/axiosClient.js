import axios from 'axios';

// Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    baseURL: 'https://localhost:7008/api', // Đã đồng bộ đúng cổng Port 7008 Backend của em
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