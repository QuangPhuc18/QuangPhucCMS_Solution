import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    // Các State quản lý trạng thái Đăng nhập, Menu & Số lượng giỏ hàng
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [cartCount, setCartCount] = useState(0); // 🔥 State đếm số lượng giỏ hàng
    const menuRef = useRef(null);

    useEffect(() => {
        // 1. Kiểm tra Token đăng nhập
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }

        // 2. Sự kiện click ra ngoài vùng menu dropdown thì đóng lại
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // 🔥 3. Hàm tính tổng số lượng sản phẩm trong giỏ hàng
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Tính tổng số lượng (quantity) của tất cả sản phẩm
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalItems);
        };

        // Chạy lần đầu khi load trang
        updateCartCount();

        // Lắng nghe sự kiện 'cartUpdated' phát ra từ các trang khác (Chi tiết SP, Giỏ hàng)
        window.addEventListener('cartUpdated', updateCartCount);

        // Cleanup function (Dọn dẹp sự kiện khi component bị hủy)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    // Hàm xử lý Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="bg-surface dark:bg-surface-dim fixed top-0 w-full z-50 shadow-md dark:bg-surface-container">
            <div className="flex flex-col w-full max-w-[1200px] mx-auto px-grid-margin py-base">
                <div className="flex items-center justify-between pb-sm">
                    {/* Brand Logo */}
                    <Link className="flex items-center gap-2" to="/">
                        <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        <span className="text-headline-lg font-headline-lg text-primary dark:text-primary-fixed-dim tracking-tight">DigiHome</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-lg relative">
                        <input className="w-full h-10 pl-10 pr-4 rounded-DEFAULT border border-outline-variant bg-surface-container-lowest text-body-md focus:border-on-secondary-fixed focus:ring-1 focus:ring-on-secondary-fixed outline-none transition-colors shadow-[0px_2px_8px_rgba(0,0,0,0.05)]" placeholder="Tìm kiếm sản phẩm..." type="text" />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant">search</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-md">
                        <div className="hidden lg:flex items-center gap-xs">
                            <span className="material-symbols-outlined text-primary">call</span>
                            <div className="flex flex-col">
                                <span className="text-label-sm font-label-sm text-on-surface-variant">Hotline 24/7</span>
                                <span className="text-label-md font-label-md text-primary">1800 1234</span>
                            </div>
                        </div>

                        {/* 🔥 Nút Giỏ Hàng (Tự động cập nhật số lượng) */}
                        <Link to="/cart" aria-label="shopping_cart" className="p-2 hover:text-primary transition-colors duration-200 relative group outline-none">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {/* Chỉ hiển thị bong bóng đỏ khi có sản phẩm trong giỏ */}
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-fade-in">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* KHU VỰC ICON USER & DROPDOWN ĐĂNG NHẬP */}
                        <div className="relative" ref={menuRef}>
                            <button
                                aria-label="person"
                                className={`p-2 transition-colors duration-200 ${showUserMenu ? 'text-primary' : 'hover:text-primary'}`}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <span className="material-symbols-outlined">person</span>
                            </button>

                            {/* Menu xổ xuống */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in animate-duration-200">
                                    {!isLoggedIn ? (
                                        <>
                                            <div className="px-4 py-2 text-xs text-slate-400 font-medium border-b border-slate-50">Xin chào khách quý!</div>
                                            <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-medium" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg">login</span> Đăng nhập
                                            </Link>
                                            <Link to="/register" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg">person_add</span> Đăng ký tài khoản
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg">account_circle</span> Trang cá nhân
                                            </Link>
                                            <Link to="/my-orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg">package_2</span> Đơn hàng của tôi
                                            </Link>
                                            <hr className="my-1 border-slate-100" />
                                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left">
                                                <span className="material-symbols-outlined text-lg">logout</span> Đăng xuất
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <button aria-label="headset_mic" className="p-2 hover:text-primary transition-colors duration-200 md:hidden">
                            <span className="material-symbols-outlined">headset_mic</span>
                        </button>
                    </div>
                </div>

                <div className="md:hidden w-full relative pt-2">
                    <input className="w-full h-10 pl-10 pr-4 rounded-DEFAULT border border-outline-variant bg-surface-container-lowest text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Tìm kiếm sản phẩm..." type="text" />
                    <span className="material-symbols-outlined absolute left-3 top-4.5 text-on-surface-variant">search</span>
                </div>

                {/* MENU CHÍNH CỐ ĐỊNH */}
                <nav className="hidden md:flex items-center gap-lg mt-sm overflow-x-auto hide-scroll">
                    <Link to="/" className="text-on-surface-variant font-medium pb-1 whitespace-nowrap hover:text-primary transition-colors duration-200">
                        Trang chủ
                    </Link>
                    <Link to="/shop" className="text-on-surface-variant font-medium pb-1 whitespace-nowrap hover:text-primary transition-colors duration-200">
                        Cửa hàng
                    </Link>
                    <Link to="/blog" className="text-on-surface-variant font-medium pb-1 whitespace-nowrap hover:text-primary transition-colors duration-200">
                        Tin tức / Blog
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;