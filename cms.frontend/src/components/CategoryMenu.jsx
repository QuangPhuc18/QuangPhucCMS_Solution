import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import productService from '../services/productService';

const CategoryMenu = () => {
    const [categories, setCategories] = useState([]);
    const { categoryId } = useParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 mt-8 mb-8 relative">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ea580c]">category</span>
                Danh Mục Nổi Bật
            </h2>
            
            <div className="flex justify-center items-start gap-4 md:gap-8 overflow-x-auto hide-scroll pb-4 pt-2 snap-x w-full">
                {/* Nút Tất cả sản phẩm */}
                <Link
                    to="/shop"
                    className="flex flex-col items-center gap-3 group min-w-[80px] snap-start"
                >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm
                        ${!categoryId 
                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-200 shadow-lg scale-105' 
                            : 'bg-white text-slate-400 border border-slate-100 group-hover:border-orange-300 group-hover:text-orange-500 group-hover:shadow-md'
                        }`}
                    >
                        <span className="material-symbols-outlined text-3xl">grid_view</span>
                    </div>
                    <span className={`text-xs font-bold text-center w-full transition-colors ${!categoryId ? 'text-[#ea580c]' : 'text-slate-600 group-hover:text-[#ea580c]'}`}>
                        Tất cả
                    </span>
                </Link>

                {categories.map((cat) => {
                    const isActive = Number(categoryId) === cat.id;
                    const imageUrl = cat.imageUrl 
                        ? `${process.env.REACT_APP_IMAGE_BASE_URL}${cat.imageUrl}` 
                        : "https://via.placeholder.com/150?text=" + encodeURIComponent(cat.name);

                    return (
                        <Link
                            key={cat.id}
                            to={`/shop/category/${cat.id}`}
                            className="flex flex-col items-center gap-3 group min-w-[80px] snap-start"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 p-2
                                ${isActive 
                                    ? 'bg-orange-50 border-2 border-orange-500 shadow-md scale-105' 
                                    : 'bg-white border border-slate-100 group-hover:border-orange-300 group-hover:shadow-md group-hover:-translate-y-1'
                                }`}
                            >
                                <img 
                                    src={imageUrl} 
                                    alt={cat.name} 
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span className={`text-xs font-bold text-center w-full transition-colors line-clamp-2 ${isActive ? 'text-[#ea580c]' : 'text-slate-600 group-hover:text-[#ea580c]'}`}>
                                {cat.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
};

export default CategoryMenu;
