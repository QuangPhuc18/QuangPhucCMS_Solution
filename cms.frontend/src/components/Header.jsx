import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 🔥 Import Link
import productService from '../services/productService'; // 🔥 Import service

const Header = () => {
    // Khai báo state lưu danh sách danh mục
    const [categories, setCategories] = useState([]);

    // Gọi API lấy danh mục khi Header vừa render
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục Header:", error);
            }
        };
        fetchCategories();
    }, []);

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
                        <button aria-label="shopping_cart" className="p-2 hover:text-primary transition-colors duration-200 relative group">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
                        </button>
                        <button aria-label="person" className="p-2 hover:text-primary transition-colors duration-200">
                            <span className="material-symbols-outlined">person</span>
                        </button>
                        <button aria-label="headset_mic" className="p-2 hover:text-primary transition-colors duration-200 md:hidden">
                            <span className="material-symbols-outlined">headset_mic</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden w-full relative pt-2">
                    <input className="w-full h-10 pl-10 pr-4 rounded-DEFAULT border border-outline-variant bg-surface-container-lowest text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Tìm kiếm sản phẩm..." type="text" />
                    <span className="material-symbols-outlined absolute left-3 top-4.5 text-on-surface-variant">search</span>
                </div>

                {/* 🔥 MENU DANH MỤC ĐỘNG TỪ DATABASE */}
                <nav className="hidden md:flex items-center gap-lg mt-sm overflow-x-auto hide-scroll">
                    {/* Nút mặc định luôn có */}
                    <Link to="/shop" className="text-on-surface-variant font-medium pb-1 whitespace-nowrap hover:text-primary transition-colors duration-200">
                        Tất cả
                    </Link>

                    {/* Dùng map() để lặp mảng danh mục ra thành các thẻ Link */}
                    {categories.length > 0 ? categories.map((cat) => (
                        <Link
                            key={cat.id}
                            // Khi click, nó sẽ truyền ID danh mục lên URL (VD: /shop/category/2)
                            to={`/shop/category/${cat.id}`}
                            className="text-on-surface-variant font-medium pb-1 whitespace-nowrap hover:text-primary transition-colors duration-200"
                        >
                            {cat.name}
                        </Link>
                    )) : (
                        <span className="text-slate-400 text-sm">Đang tải danh mục...</span>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;