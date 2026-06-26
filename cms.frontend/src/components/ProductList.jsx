import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import productService from '../services/productService';
import { isLoggedIn, getCart, saveCart } from '../utils/cartUtils';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Quản lý tham số lọc (Query Params)
    const [filterParams, setFilterParams] = useState({
        brandId: '',
        minPrice: '',
        maxPrice: ''
    });

    // Input cho giá (hiển thị giao diện, khi bấm Áp dụng mới đưa vào filterParams)
    const [priceInput, setPriceInput] = useState({ min: '', max: '' });

    // Quản lý trạng thái ẩn/hiện Toast thông báo tự custom
    const [showToast, setShowToast] = useState(false);

    // Kích hoạt hook điều hướng bằng mã độc lập của react-router-dom
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const location = useLocation();
    
    // Lấy từ khóa tìm kiếm từ URL
    const searchParams = new URLSearchParams(location.search);
    const keywordFromUrl = searchParams.get('keyword') || '';
    
    // Kiểm tra xem có đang ở trang /shop không
    const isShopPage = location.pathname.includes('/shop');

    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                const catData = await productService.getCategories();
                setCategories(catData);
                
                const brandData = await productService.getBrands();
                setBrands(brandData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu lọc:", error);
            }
        };

        fetchFiltersData();
    }, []); // Chỉ chạy 1 lần khi load trang

    // Tự động gọi lại API khi thay đổi Category hoặc FilterParams
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                // Chuẩn bị object params chỉ chứa các trường có giá trị
                const activeParams = {};
                if (filterParams.brandId) activeParams.brandId = filterParams.brandId;
                if (filterParams.minPrice) activeParams.minPrice = filterParams.minPrice;
                if (filterParams.maxPrice) activeParams.maxPrice = filterParams.maxPrice;
                if (keywordFromUrl) activeParams.keyword = keywordFromUrl;

                let data;
                if (categoryId) {
                    data = await productService.getProductsByCategory(categoryId, activeParams);
                } else {
                    data = await productService.getAllProducts(activeParams);
                }
                setProducts(data);
                setCurrentPage(1); // Reset về trang 1 khi đổi bộ lọc hoặc danh mục
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, filterParams, keywordFromUrl]);

    const handleApplyPrice = () => {
        setFilterParams({
            ...filterParams,
            minPrice: priceInput.min,
            maxPrice: priceInput.max
        });
    };

    // Thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product) => {
        // 1. Kiểm tra đăng nhập
        if (!isLoggedIn()) {
            // Có thể dùng toast hoặc custom popup, ở đây tạm thời alert và redirect
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate('/login');
            return;
        }

        const currentCart = getCart();
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

        saveCart(currentCart);

        // Mở Toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Xử lý nút Mua ngay
    const handleBuyNow = (product) => {
        handleAddToCart(product);
        navigate('/cart');
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-8 relative">
            
            {/* KHU VỰC THANH LỌC DANH MỤC SẢN PHẨM (CHỈ HIỆN Ở TRANG CHỦ) */}
            {!isShopPage && (
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
            )}

            <div className={`flex flex-col ${isShopPage ? 'md:flex-row gap-8' : 'gap-0'}`}>
                {/* 🛒 SIDEBAR BỘ LỌC BÊN TRÁI (25%) */}
                {isShopPage && (
                <aside className="w-full md:w-1/4 shrink-0 space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0px_4px_16px_rgba(0,0,0,0.03)] sticky top-24">
                        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#b7131a]">filter_alt</span>
                            Bộ Lọc Sản Phẩm
                        </h3>

                        {/* 1. LỌC THEO DANH MỤC */}
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <h4 className="font-bold text-slate-700 mb-3 text-sm tracking-wide uppercase">Danh mục</h4>
                            <div className="space-y-2.5">
                                <Link 
                                    to="/shop" 
                                    className={`flex items-center gap-2 text-sm transition-colors ${!categoryId ? 'text-[#b7131a] font-bold' : 'text-slate-600 hover:text-[#b7131a]'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{!categoryId ? 'check_circle' : 'circle'}</span>
                                    Tất cả sản phẩm
                                </Link>
                                {categories.map(cat => (
                                    <Link 
                                        key={cat.id} 
                                        to={`/shop/category/${cat.id}`} 
                                        className={`flex items-center gap-2 text-sm transition-colors ${Number(categoryId) === cat.id ? 'text-[#b7131a] font-bold' : 'text-slate-600 hover:text-[#b7131a]'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{Number(categoryId) === cat.id ? 'check_circle' : 'circle'}</span>
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* 2. LỌC THEO THƯƠNG HIỆU */}
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <h4 className="font-bold text-slate-700 mb-3 text-sm tracking-wide uppercase">Thương hiệu</h4>
                            <div className="space-y-2.5 max-h-[200px] overflow-y-auto custom-scrollbar">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="brand" 
                                        checked={filterParams.brandId === ''} 
                                        onChange={() => setFilterParams({...filterParams, brandId: ''})} 
                                        className="w-4 h-4 text-[#b7131a] focus:ring-[#b7131a] border-slate-300 cursor-pointer" 
                                    />
                                    <span className="text-sm text-slate-700 font-medium">Tất cả thương hiệu</span>
                                </label>
                                {brands.map(brand => (
                                    <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 rounded px-1 transition-colors">
                                        <input 
                                            type="radio" 
                                            name="brand" 
                                            checked={Number(filterParams.brandId) === brand.id} 
                                            onChange={() => setFilterParams({...filterParams, brandId: brand.id})} 
                                            className="w-4 h-4 text-[#b7131a] focus:ring-[#b7131a] border-slate-300 cursor-pointer" 
                                        />
                                        <span className="text-sm text-slate-600">{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 3. LỌC THEO GIÁ MIN - MAX */}
                        <div>
                            <h4 className="font-bold text-slate-700 mb-3 text-sm tracking-wide uppercase">Khoảng giá (VNĐ)</h4>
                            <div className="flex items-center gap-2 mb-4">
                                <input 
                                    type="number" 
                                    placeholder="Từ giá" 
                                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b7131a] focus:ring-1 focus:ring-[#b7131a] bg-slate-50 transition-all" 
                                    value={priceInput.min} 
                                    onChange={e => setPriceInput({...priceInput, min: e.target.value})} 
                                />
                                <span className="text-slate-400 font-medium">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Đến giá" 
                                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b7131a] focus:ring-1 focus:ring-[#b7131a] bg-slate-50 transition-all" 
                                    value={priceInput.max} 
                                    onChange={e => setPriceInput({...priceInput, max: e.target.value})} 
                                />
                            </div>
                            <button 
                                onClick={handleApplyPrice} 
                                className="w-full bg-[#b7131a] text-white hover:bg-red-800 text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-900/10 flex justify-center items-center gap-1 uppercase tracking-wide"
                            >
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                Áp dụng bộ lọc
                            </button>
                        </div>
                    </div>
                </aside>
                )}

                {/* 🎁 DANH SÁCH SẢN PHẨM BÊN PHẢI (75%) */}
                <div className={`w-full ${isShopPage ? 'md:w-3/4' : ''} flex flex-col`}>
                    
                    {/* Tiêu đề Khối Sản phẩm */}
                    <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                {!categoryId
                                    ? "Tất cả sản phẩm"
                                    : `Sản phẩm ${categories.find(c => c.id === Number(categoryId))?.name || ''}`
                                }
                            </h2>
                            <p className="text-slate-500 mt-1 text-sm md:text-base">Hiển thị {products.length} kết quả phù hợp nhất.</p>
                        </div>
                    </div>

                    {/* Lưới hiển thị Sản phẩm */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <span className="material-symbols-outlined animate-spin text-[40px] text-[#b7131a] mb-4">refresh</span>
                            <span>Đang nạp dữ liệu sản phẩm...</span>
                        </div>
                    ) : products.length === 0 ? (
                        // Giao diện Empty State (Không tìm thấy kết quả theo Rubric)
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-500 w-full text-center px-4">
                            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-[64px] text-slate-300">search_off</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm nào!</h3>
                            <p className="text-slate-500 max-w-sm">Rất tiếc, không có sản phẩm nào phù hợp với các tiêu chí lọc (Danh mục, Thương hiệu, Khoảng giá) mà bạn đã chọn. Vui lòng thử lại với các tiêu chí khác.</p>
                            <button 
                                onClick={() => {
                                    setFilterParams({brandId: '', minPrice: '', maxPrice: ''});
                                    setPriceInput({min: '', max: ''});
                                    navigate('/shop');
                                }}
                                className="mt-6 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 font-bold py-2.5 px-6 rounded-xl transition-all"
                            >
                                Xóa toàn bộ bộ lọc
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={`grid grid-cols-2 ${isShopPage ? 'md:grid-cols-3 xl:grid-cols-3' : 'md:grid-cols-4'} gap-4 md:gap-6`}>
                                {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                    <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">

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
                                            {/* Nút Xem Nhanh giả lập */}
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    Xem chi tiết
                                                </div>
                                            </div>
                                        </Link>

                                        <h3 className="text-sm md:text-base font-semibold text-slate-800 line-clamp-2 mb-4 group-hover:text-[#b7131a] transition-colors min-h-[40px] md:min-h-[48px]">
                                            <Link to={`/product/${item.id}`} className="outline-none">
                                                {item.name}
                                            </Link>
                                        </h3>

                                        <div className="mt-auto pt-4 border-t border-slate-100/60">
                                            <div className="text-lg md:text-xl font-bold text-[#b7131a] mb-3 block">
                                                {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    className="w-11 md:w-12 h-10 md:h-11 shrink-0 border border-slate-200 rounded-xl flex items-center justify-center bg-white hover:bg-[#b7131a] hover:text-white hover:border-[#b7131a] transition-all text-slate-500 shadow-sm"
                                                    title="Thêm vào giỏ hàng"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                                </button>

                                                <button
                                                    onClick={() => handleBuyNow(item)}
                                                    className="flex-1 bg-orange-600 text-white h-10 md:h-11 rounded-xl text-sm font-bold hover:bg-[#b7131a] transition-all flex items-center justify-center shadow-md uppercase tracking-wide"
                                                >
                                                    Mua ngay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* UI PHÂN TRANG (PAGINATION) */}
                            {Math.ceil(products.length / itemsPerPage) > 1 && (
                                <div className="flex justify-center items-center mt-10 gap-2">
                                    <button 
                                        onClick={() => {
                                            setCurrentPage(prev => Math.max(prev - 1, 1));
                                            window.scrollTo({ top: 300, behavior: 'smooth' }); // Tự cuộn lên đầu danh sách
                                        }}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>
                                    
                                    {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentPage(i + 1);
                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-[#ea580c] text-white shadow-md border-none' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => {
                                            setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)));
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* TOAST THÔNG BÁO CUSTOM */}
            <div className={`fixed top-24 right-5 z-50 bg-white text-slate-800 px-5 py-3.5 rounded-2xl shadow-[0px_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3 transition-all duration-500 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Thêm vào giỏ thành công!</span>
                    <span className="text-[12px] text-slate-500">Giỏ hàng của bạn đã được cập nhật.</span>
                </div>
                <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600 ml-2 transition-colors p-1">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>

        </section>
    );
};

export default ProductList;