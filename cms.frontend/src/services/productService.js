import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: (params) => {
        const url = '/products';
        return axiosClient.get(url, { params });
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
    getProductsByCategory: (categoryId, params) => {
        // Sửa lại đường dẫn này cho khớp với API GetProductsByCategory bên C#
        const url = `/products/category/${categoryId}`;
        return axiosClient.get(url, { params });
    },
    
    // Bổ sung hàm lấy thương hiệu
    getBrands: () => {
        const url = '/brands';
        return axiosClient.get(url);
    }
};

export default productService;