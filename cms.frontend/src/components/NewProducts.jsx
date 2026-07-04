import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const data = await axiosClient.get('/products/newest');
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm mới nhất:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <span className="material-symbols-outlined animate-spin text-[40px] text-[#b7131a] mb-4">refresh</span>
                <span>Đang nạp dữ liệu sản phẩm mới...</span>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="mt-8 mb-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">SẢN PHẨM MỚI NHẤT</h2>
                    <p className="text-slate-500 mt-1">Khám phá những thiết bị công nghệ mới ra mắt</p>
                </div>
                <Link to="/shop" className="text-[#b7131a] font-semibold hover:underline flex items-center">
                    Xem tất cả <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 group relative">
                        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">NEW</div>
                        
                        <div className="text-[10px] uppercase tracking-widest font-bold text-[#b7131a] bg-red-50 px-3 py-1 rounded-full w-max mb-4">
                            {item.brand ? item.brand.name : 'SIGNATURE'}
                        </div>

                        <Link to={`/product/${item.id}`} className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden block relative">
                            {item.imageUrl ? (
                                <img
                                    src={`${process.env.REACT_APP_IMAGE_BASE_URL}${item.imageUrl}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-slate-300">image</span>
                            )}
                            
                            {item.stockQuantity === 0 && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                                    <div className="bg-red-500 text-white font-bold px-4 py-1.5 rounded-full shadow-md text-sm transform -rotate-12 border-2 border-white">
                                        Hết hàng
                                    </div>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <div className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    Xem chi tiết
                                </div>
                            </div>
                        </Link>

                        <div className="flex-grow flex flex-col justify-end">
                            <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-2 min-h-[48px] group-hover:text-[#b7131a] transition-colors">
                                {item.name}
                            </h3>

                            <div className="font-bold text-xl text-[#b7131a]">
                                {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewProducts;
