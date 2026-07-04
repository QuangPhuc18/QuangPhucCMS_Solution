import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService'; // Chú ý đường dẫn lùi 2 cấp
import ProductInfo from './ProductInfo';
import { isLoggedIn, getCart, saveCart } from '../../utils/cartUtils';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Toast báo lỗi số lượng
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Cuộn lên đầu trang mỗi khi vào một sản phẩm mới
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);

                // Nếu sản phẩm có CategoryId, gọi API lấy danh sách cùng Category
                if (data && data.categoryProductId) {
                    const related = await productService.getProductsByCategory(data.categoryProductId);
                    // Lọc bỏ sản phẩm hiện tại và lấy 4 sản phẩm đầu tiên
                    const filtered = related.filter(p => p.id !== data.id).slice(0, 4);
                    setRelatedProducts(filtered);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

    const handleAddToCart = (item) => {
        const currentCart = getCart();
        const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            currentCart[existingItemIndex].quantity += 1;
        } else {
            currentCart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1,
                stockQuantity: item.stockQuantity // Lưu thêm stockQuantity để check bên trang giỏ hàng
            });
        }
        saveCart(currentCart);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    };

    const handleBuyNow = (item) => {
        const currentCart = getCart();
        const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
        const currentQty = existingItemIndex !== -1 ? currentCart[existingItemIndex].quantity : 0;

        if (currentQty + 1 > item.stockQuantity) {
            setErrorMessage(`Sản phẩm "${item.name}" chỉ còn ${item.stockQuantity} cái trong kho!`);
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 4000);
            return;
        }

        handleAddToCart(item);
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-primary">
                <span className="material-symbols-outlined animate-spin text-[32px] mr-2">refresh</span>
                <span className="font-label-md text-label-md">Đang tải dữ liệu sản phẩm...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20 bg-surface-container-lowest rounded-lg border my-10">
                <p className="text-on-surface-variant font-body-md mb-4">Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.</p>
                <Link to="/" className="text-primary hover:underline font-label-md">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Breadcrumb (Đường dẫn) */}
            <nav aria-label="Breadcrumb" className="mb-lg mt-4">
                <ol className="flex items-center space-x-2 text-body-sm font-body-sm text-on-surface-variant">
                    <li><Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link></li>
                    <li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li><Link className="hover:text-primary transition-colors" to="/shop">Cửa hàng</Link></li>
                    <li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li aria-current="page" className="text-on-surface line-clamp-1">{product.name}</li>
                </ol>
            </nav>

            {/* Truyền dữ liệu xuống Component Con để Render giao diện */}
            <ProductInfo product={product} />

            {/* KHỐI TABS BÊN DƯỚI */}
            <div className="mb-xl">
                <div className="flex border-b border-surface-variant mb-lg overflow-x-auto hide-scroll">
                    <button className="px-lg py-sm font-label-md text-label-md text-[#ea580c] border-b-2 border-[#ea580c] whitespace-nowrap">
                        Mô tả sản phẩm
                    </button>
                    {/*<button className="px-lg py-sm font-label-md text-label-md text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap">*/}
                    {/*    Thông số kỹ thuật*/}
                    {/*</button>*/}
                    {/*<button className="px-lg py-sm font-label-md text-label-md text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap">*/}
                    {/*    Đánh giá*/}
                    {/*</button>*/}
                </div>

                <div className="bg-white p-lg rounded-2xl border border-slate-100 shadow-sm text-slate-700 text-body-md font-body-md">
                    {product.description ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description }} className="whitespace-pre-line leading-relaxed" />
                    ) : (
                        <p>Đang cập nhật nội dung mô tả chi tiết cho sản phẩm này.</p>
                    )}
                </div>
            </div>

            {/* KHỐI SẢN PHẨM LIÊN QUAN */}
            {relatedProducts.length > 0 && (
                <div className="mt-16 mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ea580c] text-[28px]">category</span>
                        Sản phẩm liên quan
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((item) => (
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
                </div>
            )}
            
            {/* TOAST BÁO LỖI SỐ LƯỢNG KHI MUA NGAY */}
            <div className={`fixed top-24 right-5 z-50 bg-white text-slate-800 px-5 py-3.5 rounded-2xl shadow-[0px_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3 transition-all duration-500 transform ${showErrorToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-red-100 text-red-600 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] font-bold">warning</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Không đủ số lượng!</span>
                    <span className="text-[12px] text-slate-500 max-w-[250px]">{errorMessage}</span>
                </div>
                <button onClick={() => setShowErrorToast(false)} className="text-slate-400 hover:text-slate-600 ml-2 transition-colors p-1">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;