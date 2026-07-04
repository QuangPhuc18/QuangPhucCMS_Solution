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

// Tạo khóa Giỏ hàng. Nếu đã đăng nhập thì lưu theo ID, nếu chưa thì lưu vào giỏ hàng vãng lai (Guest)
export const getCartKey = () => {
    const user = getCurrentUser();
    if (!user) return 'cart_guest'; // Sử dụng giỏ hàng khách khi chưa đăng nhập
    return `cart_${user.id}`;
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCart = () => {
    const key = getCartKey();
    
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
