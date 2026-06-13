import axiosClient from '../api/axiosClient';

const categoryProductService = {
    // Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
    getAllCategoryProducts: () => {
        // 🔥 ĐÃ SỬA CHÍNH XÁC: Khớp với [Route("api/category-products")] của Backend em hôm trước
        const url = '/category-products';
        return axiosClient.get(url);
    }
};

export default categoryProductService;