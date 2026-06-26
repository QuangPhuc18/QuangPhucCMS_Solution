// Lấy ra thông tin User đang đăng nhập từ LocalStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

// Tạo khóa Giỏ hàng riêng biệt dựa trên ID của user (VD: "cart_1")
export const getCartKey = () => {
    const user = getCurrentUser();
    if (!user) return null; // Nếu chưa đăng nhập, không có khóa giỏ hàng
    return `cart_${user.id}`;
};

// Lấy danh sách sản phẩm trong giỏ hàng CỦA USER ĐÓ
export const getCart = () => {
    const key = getCartKey();
    if (!key) return [];
    
    const cartStr = localStorage.getItem(key);
    if (!cartStr) return [];
    
    try {
        return JSON.parse(cartStr);
    } catch (e) {
        return [];
    }
};

// Lưu giỏ hàng CỦA USER ĐÓ
export const saveCart = (cartItems) => {
    const key = getCartKey();
    if (key) {
        localStorage.setItem(key, JSON.stringify(cartItems));
        // Kích hoạt sự kiện để Header tự động nhận diện và cập nhật số lượng
        window.dispatchEvent(new Event('cartUpdated'));
    }
};

// Dọn dẹp giỏ hàng CỦA USER ĐÓ (dùng khi Checkout thành công)
export const clearCart = () => {
    const key = getCartKey();
    if (key) {
        localStorage.removeItem(key);
        window.dispatchEvent(new Event('cartUpdated'));
    }
};

// Hàm kiểm tra xem đã Đăng nhập chưa
export const isLoggedIn = () => {
    return localStorage.getItem('token') !== null && getCurrentUser() !== null;
};
