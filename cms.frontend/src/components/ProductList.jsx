import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // 🔥 Thêm useParams
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 Lấy categoryId từ thanh URL (nếu có)
    const { categoryId } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                // 🔥 NẾU CÓ CATEGORY ID THÌ GỌI API LỌC, NẾU KHÔNG THÌ LẤY TẤT CẢ
                if (categoryId) {
                    data = await productService.getProductsByCategory(categoryId);
                } else {
                    data = await productService.getAllProducts();
                }
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        // Gọi lại hàm mỗi khi categoryId trên URL thay đổi
        fetchProducts();
    }, [categoryId]);

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sản phẩm bán chạy</h2>
                    <p className="text-slate-500 mt-1">Những lựa chọn tuyệt vời nhất dành cho bạn.</p>
                </div>
                <a className="text-sm font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1 transition-colors" href="/shop">
                    Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 group">

                        {/* Tag Brand */}
                        <div className="text-[10px] uppercase tracking-widest font-bold text-orange-800 bg-orange-50 px-3 py-1 rounded-full w-max mb-4">
                            {item.brand ? item.brand.name : 'SIGNATURE'}
                        </div>

                        {/* 🔥 Hình ảnh - Bọc trong Link để click vào bay sang trang chi tiết */}
                        <Link to={`/product/${item.id}`} className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden block">
                            {item.imageUrl ? (
                                <img
                                    src={`https://localhost:7008${item.imageUrl}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-slate-300">image</span>
                            )}
                        </Link>

                        {/* 🔥 Tiêu đề - Bọc trong Link */}
                        <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-4 group-hover:text-orange-800 transition-colors">
                            <Link to={`/product/${item.id}`} className="outline-none">
                                {item.name}
                            </Link>
                        </h3>

                        {/* Phần giá và bộ đôi nút bấm - Tách hàng ngang */}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                            {/* Giá tiền */}
                            <div className="text-lg font-bold text-red-700 mb-3 block">
                                {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                            </div>

                            {/* Khu vực chứa Nút Mua và Icon Giỏ hàng */}
                            <div className="flex gap-2">
                                {/* Nút Icon giỏ hàng (Chỉ thêm vào giỏ, không chuyển trang) */}
                                <button className="w-12 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900" title="Thêm vào giỏ hàng">
                                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                </button>

                                {/* 🔥 Nút Mua chính - Đổi thành Link để dẫn thẳng sang trang chi tiết */}
                                <Link
                                    to={`/product/${item.id}`}
                                    className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-800 transition-all flex items-center justify-center shadow-sm"
                                >
                                    Mua ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductList;