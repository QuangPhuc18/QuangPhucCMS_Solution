import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
    // 1. Khởi tạo giỏ hàng từ localStorage
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 🔥 2. State quản lý Modal xác nhận xóa custom
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Lắng nghe thay đổi của giỏ hàng để lưu vào localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cartUpdated'));
    }, [cartItems]);

    // Xử lý Tăng số lượng
    const handleIncrease = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    // Xử lý Giảm số lượng
    const handleDecrease = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    // 🔥 3. Khi bấm nút Xóa: Mở modal và lưu lại ID sản phẩm cần xóa chứ không alert nữa
    const handleRemoveClick = (id) => {
        setItemToDelete(id);
        setIsModalOpen(true);
    };

    // 🔥 4. Khi người dùng bấm nút "Xác nhận xóa" trên Modal
    const confirmDelete = () => {
        if (itemToDelete) {
            setCartItems(cartItems.filter(item => item.id !== itemToDelete));
            setIsModalOpen(false);
            setItemToDelete(null);
        }
    };

    // 🔥 5. Khi người dùng bấm "Hủy"
    const cancelDelete = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    // Tính tổng tiền
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="w-full py-6 relative">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex items-center space-x-2 text-body-sm font-body-sm text-slate-500">
                    <li><Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link></li>
                    <li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li aria-current="page" className="text-slate-900 font-semibold">Giỏ hàng của bạn</li>
                </ol>
            </nav>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">
                Giỏ hàng <span className="text-slate-500 text-lg font-medium">({cartItems.length} sản phẩm)</span>
            </h1>

            {cartItems.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[48px] text-slate-300">shopping_cart_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Giỏ hàng của bạn đang trống</h3>
                    <p className="text-slate-500 mb-6">Có vẻ như bạn chưa chọn mua sản phẩm nào.</p>
                    <Link to="/shop" className="bg-[#b7131a] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-md">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-4">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-600">
                            <div className="col-span-6">Sản phẩm</div>
                            <div className="col-span-2 text-center">Đơn giá</div>
                            <div className="col-span-2 text-center">Số lượng</div>
                            <div className="col-span-2 text-right">Thành tiền</div>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 md:px-6 md:py-4 rounded-2xl border border-slate-100 shadow-sm relative group">
                                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                                    <Link to={`/product/${item.id}`} className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                                        <img
                                            src={item.imageUrl ? `https://localhost:7008${item.imageUrl}` : "https://via.placeholder.com/150?text=DigiHome"}
                                            alt={item.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </Link>
                                    <div className="flex flex-col">
                                        <Link to={`/product/${item.id}`} className="text-sm md:text-base font-semibold text-slate-800 hover:text-primary transition-colors line-clamp-2 mb-1">
                                            {item.name}
                                        </Link>
                                        {/* Thay thế hàm xóa gọi qua handleRemoveClick */}
                                        <button
                                            onClick={() => handleRemoveClick(item.id)}
                                            className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center gap-1 w-max mt-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">delete</span> Xóa
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 text-left md:text-center">
                                    <span className="md:hidden text-sm text-slate-500 mr-2">Đơn giá:</span>
                                    <span className="font-bold text-slate-800">
                                        {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                                    </span>
                                </div>

                                <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                                    <div className="flex items-center border border-slate-200 rounded-lg w-max bg-slate-50">
                                        <button onClick={() => handleDecrease(item.id)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors rounded-l-lg">-</button>
                                        <span className="px-3 py-1.5 text-sm font-semibold border-l border-r border-slate-200 w-10 text-center bg-white">
                                            {item.quantity}
                                        </span>
                                        <button onClick={() => handleIncrease(item.id)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors rounded-r-lg">+</button>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 text-left md:text-right">
                                    <span className="md:hidden text-sm text-slate-500 mr-2">Thành tiền:</span>
                                    <span className="font-bold text-red-600 text-lg">
                                        {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-28">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Tóm tắt đơn hàng</h3>
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex justify-between items-center text-slate-600 text-sm">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 text-sm">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 text-sm">
                                    <span>Thuế VAT</span>
                                    <span className="font-semibold">Đã bao gồm</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-800 font-bold">Tổng cộng</span>
                                    <span className="text-2xl font-black text-red-600">
                                        {new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ
                                    </span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full bg-[#b7131a] text-white py-3.5 rounded-xl font-bold hover:bg-red-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/10 uppercase tracking-wide"
                            >
                                Tiến hành thanh toán
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Link>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                                <span className="material-symbols-outlined text-[16px] text-green-600">shield</span>
                                Thanh toán bảo mật & an toàn 100%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔥 ĐÃ THÊM: CUSTOM BOX CHAT / MODAL XÁC NHẬN XÓA SẢN PHẨM */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isModalOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                {/* Lớp nền mờ bên dưới modal */}
                <div onClick={cancelDelete} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

                {/* Hộp thoại chat xác nhận */}
                <div className={`bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-slate-100 z-10 transform transition-all duration-300 ${isModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                    <div className="flex items-start gap-4">
                        <div className="bg-red-50 text-red-600 p-2.5 rounded-full flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-2xl">delete_forever</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-base font-bold text-slate-900">Xóa sản phẩm này?</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Bạn có chắc chắn muốn bỏ sản phẩm này ra khỏi giỏ hàng của mình không?
                            </p>
                        </div>
                    </div>

                    {/* Bộ đôi nút bấm Xác nhận / Hủy */}
                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            onClick={cancelDelete}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/10 transition-all"
                        >
                            Đồng ý xóa
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Cart;