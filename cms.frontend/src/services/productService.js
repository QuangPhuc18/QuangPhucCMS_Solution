import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách quần áo, váy dạ hội, điện thoại...
    getAllProducts: () => {
        // 🔥 ĐÃ SỬA: Chữ thường '/products' để khớp chính xác định tuyến Backend của em
        const url = '/products';
        return axiosClient.get(url);
    },
    getProductById: (id) => {
        const url = `/products/${id}`;
        return axiosClient.get(url);
    },
    getCategories: () => {
        // 🔥 Đã thêm dấu gạch ngang cho khớp 100% với [Route] trong C#
        const url = '/category-products';
        return axiosClient.get(url);
    },

    // 🔥 2. Thêm hàm lấy sản phẩm lọc theo ID của danh mục
    getProductsByCategory: (categoryId) => {
        // Sửa lại đường dẫn này cho khớp với API GetProductsByCategory bên C#
        const url = `/products/category/${categoryId}`;
        return axiosClient.get(url);
    }
};

export default productService;