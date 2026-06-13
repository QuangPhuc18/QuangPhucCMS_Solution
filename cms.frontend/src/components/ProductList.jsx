import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Quản lý trạng thái ẩn/hiện Toast thông báo tự custom
    const [showToast, setShowToast] = useState(false);

    // Kích hoạt hook điều hướng bằng mã độc lập của react-router-dom
    const navigate = useNavigate();
    const { categoryId } = useParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catData = await productService.getCategories();
                setCategories(catData);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };

        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
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

        fetchCategories();
        fetchProducts();
    }, [categoryId]);

    // Thêm sản phẩm vào giỏ hàng (Mặc định số lượng tăng 1)
    const handleAddToCart = (product) => {
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            currentCart[existingItemIndex].quantity += 1;
        } else {
            currentCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));

        // Phát tín hiệu cập nhật số lượng hiển thị trên Badge của Header
        window.dispatchEvent(new Event('cartUpdated'));

        // Mở Toast thông báo thành công
        setShowToast(true);

        // Tự động đóng thông báo sau 3 giây
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    // Xử lý nút Mua ngay: Thêm vào giỏ và chuyển thẳng hướng trang sang /cart
    const handleBuyNow = (product) => {
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            currentCart[existingItemIndex].quantity += 1;
        } else {
            currentCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('cartUpdated'));

        // Điều hướng trực tiếp người dùng về trang giỏ hàng
        navigate('/cart');
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-8 relative">

            {/* KHU VỰC THANH LỌC DANH MỤC SẢN PHẨM */}
            <div className="mb-10">
                <div className="flex items-center gap-3 overflow-x-auto hide-scroll pb-2">
                    <Link
                        to="/shop"
                        className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${!categoryId
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
                            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${Number(categoryId) === cat.id
                                ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-600'
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tiêu đề Khối Sản phẩm */}
            <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {!categoryId
                            ? "Sản phẩm bán chạy"
                            : `Sản phẩm ${categories.find(c => c.id === Number(categoryId))?.name || ''}`
                        }
                    </h2>
                    <p className="text-slate-500 mt-1">Những lựa chọn tuyệt vời nhất dành cho bạn.</p>
                </div>
            </div>

            {/* Lưới hiển thị Sản phẩm */}
            {loading ? (
                <div className="text-center py-20 text-slate-500">Đang nạp dữ liệu sản phẩm...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
                    Hiện tại chưa có sản phẩm nào trong danh mục này.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 group">

                            <div className="text-[10px] uppercase tracking-widest font-bold text-orange-800 bg-orange-50 px-3 py-1 rounded-full w-max mb-4">
                                {item.brand ? item.brand.name : 'SIGNATURE'}
                            </div>

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

                            <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-4 group-hover:text-orange-800 transition-colors">
                                <Link to={`/product/${item.id}`} className="outline-none">
                                    {item.name}
                                </Link>
                            </h3>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <div className="text-lg font-bold text-red-700 mb-3 block">
                                    {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                                </div>
                                <div className="flex gap-2">
                                    {/* Nút 1: Thêm vào giỏ hàng */}
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-12 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900"
                                        title="Thêm vào giỏ hàng"
                                    >
                                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                    </button>

                                    {/* Nút 2: Mua ngay (Thêm vào giỏ và đi tới trang giỏ hàng) */}
                                    <button
                                        onClick={() => handleBuyNow(item)}
                                        className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-800 transition-all flex items-center justify-center shadow-sm"
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TOAST THÔNG BÁO CUSTOM SANG TRỌNG */}
            <div className={`fixed top-24 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 transition-all duration-300 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-green-500 text-white rounded-full p-1 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Thêm vào giỏ thành công!</span>
                    <span className="text-[12px] text-slate-400">Đã thêm 1 sản phẩm vào giỏ hàng.</span>
                </div>
                <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-white ml-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>

        </section>
    );
};

export default ProductList;