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
        <section className="max-w-7xl mx-auto px-4 mt-8 mb-4 relative">
            {/*<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">*/}
            {/*    <span className="material-symbols-outlined text-[#ea580c]">category</span>*/}
            {/*    Danh Mục Nổi Bật*/}
            {/*</h2>*/}
            <div className="flex items-center gap-3 overflow-x-auto hide-scroll pb-2">
                <Link
                    to="/"
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${!categoryId
                        ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-600'
                        }`}
                >
                    Tất cả sản phẩm
                </Link>

                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/shop/category/${cat.id}`}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${Number(categoryId) === cat.id
                            ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-600'
                            }`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryMenu;
