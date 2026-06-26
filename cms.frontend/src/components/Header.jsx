import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const Header = () => {
    const navigate = useNavigate();

    // Các State quản lý trạng thái
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const menuRef = useRef(null);

    // 🔥 STATE CHO TÍNH NĂNG TÌM KIẾM SUGGESTION
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        // 1. Kiểm tra Token đăng nhập
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    setUser(JSON.parse(userStr));
                } else {
                    setUser(null);
                }
            } catch (e) {
                setUser(null);
            }
        };
        
        checkAuth();
        window.addEventListener('authChange', checkAuth);

        // 2. Click outside cho menu user VÀ search dropdown
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // 3. Đếm giỏ hàng
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalItems);
        };
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    // 🔥 XỬ LÝ GỌI API THEO THỜI GIAN THỰC (DEBOUNCE 500ms)
    useEffect(() => {
        if (!searchKeyword.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                // Gọi API với params keyword
                const data = await productService.getAllProducts({ keyword: searchKeyword });
                // Chỉ lấy 5 sản phẩm đầu tiên để gợi ý cho Dropdown
                setSearchResults(data.slice(0, 5));
                setShowSearchDropdown(true);
            } catch (error) {
                console.error("Lỗi tìm kiếm gợi ý:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // Đợi 500ms sau khi người dùng ngừng gõ mới gọi API

        return () => clearTimeout(delayDebounceFn);
    }, [searchKeyword]);

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            setShowSearchDropdown(false);
            if (searchKeyword.trim()) {
                navigate(`/shop?keyword=${encodeURIComponent(searchKeyword)}`);
            } else {
                navigate(`/shop`);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setShowUserMenu(false);
        navigate('/');
    };

    // Component dùng chung cho ô thả xuống (tránh lặp code ở Desktop và Mobile)
    const SearchDropdownBlock = () => (
        showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0px_10px_40px_rgba(0,0,0,0.15)] py-3 z-50 animate-fade-in flex flex-col max-h-[400px] overflow-hidden">
                <div className="px-4 pb-2 border-b border-slate-50 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                        {isSearching ? 'Đang tìm kiếm...' : 'Sản phẩm gợi ý'}
                    </span>
                    {isSearching && <span className="material-symbols-outlined animate-spin text-[#ea580c] text-sm">refresh</span>}
                </div>
                
                <div className="overflow-y-auto custom-scrollbar flex-1 pt-2">
                    {!isSearching && searchResults.length === 0 ? (
                        <div className="px-4 py-4 text-center text-slate-500 text-sm font-medium">
                            Không tìm thấy sản phẩm "{searchKeyword}"
                        </div>
                    ) : (
                        searchResults.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => {
                                    setShowSearchDropdown(false);
                                    setSearchKeyword(''); // Reset ô nhập
                                    navigate(`/product/${item.id}`);
                                }}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                            >
                                <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                                    <img 
                                        src={item.imageUrl ? `${process.env.REACT_APP_IMAGE_BASE_URL}${item.imageUrl}` : "https://via.placeholder.com/150"} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover mix-blend-multiply"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-[#ea580c] transition-colors">{item.name}</span>
                                    <span className="text-sm font-bold text-red-600">{new Intl.NumberFormat('vi-VN').format(item.price)}₫</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!isSearching && searchResults.length > 0 && (
                    <div 
                        className="px-4 pt-3 mt-1 border-t border-slate-50 text-center"
                        onClick={() => {
                            setShowSearchDropdown(false);
                            navigate(`/shop?keyword=${encodeURIComponent(searchKeyword)}`);
                        }}
                    >
                        <span className="text-sm text-[#ea580c] font-bold hover:underline cursor-pointer flex justify-center items-center gap-1">
                            Xem tất cả kết quả cho "{searchKeyword}" <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </span>
                    </div>
                )}
            </div>
        )
    );

    return (
        <header className="bg-white fixed top-0 w-full z-50 shadow-sm border-b border-slate-100" ref={headerRef}>
            <div className="flex flex-col w-full max-w-[1200px] mx-auto px-4 lg:px-0 py-3">
                <div className="flex items-center justify-between pb-1">
                    {/* Brand Logo */}
                    <Link className="flex items-center gap-2 shrink-0" to="/">
                        <span className="material-symbols-outlined text-[#ea580c] text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        <span className="text-2xl font-black text-[#ea580c] tracking-tight">DigiHome</span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <input 
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all shadow-sm font-medium" 
                            placeholder="Bạn tìm gì hôm nay?" 
                            type="text" 
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchEnter}
                            onFocus={() => {
                                if (searchKeyword.trim()) setShowSearchDropdown(true);
                            }}
                        />
                        <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[24px]">search</span>
                        
                        {/* Dropdown Desktop */}
                        <SearchDropdownBlock />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-5">
                        <div className="hidden lg:flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#ea580c]">call</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Hotline 24/7</span>
                                <span className="text-sm text-[#ea580c] font-black tracking-tight">1800 1234</span>
                            </div>
                        </div>

                        {/* 🔥 Nút Giỏ Hàng */}
                        <Link to="/cart" aria-label="shopping_cart" className="p-2 text-slate-700 hover:text-[#ea580c] transition-colors relative group outline-none bg-slate-50 rounded-full w-10 h-10 flex items-center justify-center border border-slate-100 hover:border-orange-200">
                            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#ea580c] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-fade-in shadow-md border-2 border-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* KHU VỰC ICON USER & DROPDOWN ĐĂNG NHẬP */}
                        <div className="relative" ref={menuRef}>
                            <button
                                aria-label="person"
                                className={`transition-colors flex items-center justify-center rounded-full border ${showUserMenu ? 'text-[#ea580c] bg-orange-50 border-orange-200' : 'text-slate-700 bg-slate-50 border-slate-100 hover:text-[#ea580c] hover:border-orange-200'} ${isLoggedIn && user ? 'px-3 py-2 h-10 w-auto gap-1' : 'w-10 h-10 p-2'}`}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {isLoggedIn && user ? (
                                    <>
                                        <span className="text-[13px] font-bold truncate max-w-[120px]">Chào {user.fullName?.split(' ').pop() || user.email?.split('@')[0] || 'Bạn'}</span>
                                        <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                                    </>
                                ) : (
                                    <span className="material-symbols-outlined text-[22px]">person</span>
                                )}
                            </button>

                            {/* Menu xổ xuống */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                                    {!isLoggedIn ? (
                                        <>
                                            <div className="px-4 py-3 text-xs text-slate-400 font-bold border-b border-slate-50 uppercase tracking-wide bg-slate-50/50">Tài khoản của bạn</div>
                                            <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] transition-colors font-bold" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg text-slate-400">login</span> Đăng nhập
                                            </Link>
                                            <Link to="/register" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#ea580c] transition-colors font-medium" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg text-slate-400">person_add</span> Đăng ký tài khoản mới
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-4 py-3 text-xs text-slate-400 font-bold border-b border-slate-50 uppercase tracking-wide bg-slate-50/50">Quản lý cá nhân</div>
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] transition-colors font-semibold" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg text-slate-400">account_circle</span> Hồ sơ cá nhân
                                            </Link>
                                            <Link to="/my-orders" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] transition-colors font-semibold" onClick={() => setShowUserMenu(false)}>
                                                <span className="material-symbols-outlined text-lg text-slate-400">package_2</span> Đơn hàng của tôi
                                            </Link>
                                            <hr className="my-1 border-slate-50" />
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold text-left">
                                                <span className="material-symbols-outlined text-lg">logout</span> Đăng xuất an toàn
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <button aria-label="headset_mic" className="p-2 text-slate-700 hover:text-[#ea580c] transition-colors md:hidden bg-slate-50 rounded-full w-10 h-10 flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-[22px]">menu</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar - Mobile */}
                <div className="md:hidden w-full relative pt-2 pb-1">
                    <input 
                        className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none shadow-sm font-medium" 
                        placeholder="Bạn tìm gì hôm nay?" 
                        type="text" 
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleSearchEnter}
                        onFocus={() => {
                            if (searchKeyword.trim()) setShowSearchDropdown(true);
                        }}
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-5 text-slate-400 text-[24px]">search</span>
                    
                    {/* Dropdown Mobile */}
                    <div className="relative">
                        <SearchDropdownBlock />
                    </div>
                </div>

                {/* MENU CHÍNH CỐ ĐỊNH */}
                <nav className="hidden md:flex items-center gap-8 mt-1 overflow-x-auto hide-scroll pb-1">
                    <Link to="/" className="text-slate-600 font-bold text-[13px] uppercase tracking-wide whitespace-nowrap hover:text-[#ea580c] transition-colors">
                        Trang chủ
                    </Link>
                    <Link to="/shop" className="text-slate-600 font-bold text-[13px] uppercase tracking-wide whitespace-nowrap hover:text-[#ea580c] transition-colors">
                        Tất cả sản phẩm
                    </Link>
                    <Link to="/blog" className="text-slate-600 font-bold text-[13px] uppercase tracking-wide whitespace-nowrap hover:text-[#ea580c] transition-colors">
                        Tin tức / Blog công nghệ
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;