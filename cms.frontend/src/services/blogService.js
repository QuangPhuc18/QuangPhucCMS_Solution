import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách toàn bộ bài viết (Post)
    getAllPosts: () => {
        const url = '/posts'; // Đã sửa thành chữ thường để khớp với PostsApiController
        return axiosClient.get(url);
    },

    // 2. Hàm lấy chi tiết 1 bài viết theo ID
    // Hàm 2: Lấy chi tiết 1 bài viết theo ID
    getPostById: (id) => {
        // Chỉ cần dùng đường dẫn tương đối vì axiosClient đã cấu hình sẵn base URL (https://localhost:7008) rồi
        const url = `/posts/${id}`;
        return axiosClient.get(url);
    },

    // 3. BÀI TẬP MỞ RỘNG: Hàm lấy danh sách Chuyên mục tin tức (Category)
    getBlogCategories: () => {
        const url = '/categories'; // Khớp chính xác với CategoriesApiController của em
        return axiosClient.get(url);
    }
};

export default blogService;