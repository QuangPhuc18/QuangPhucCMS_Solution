//import React, { useState } from 'react';

//const ProductInfo = ({ product }) => {
//    const [quantity, setQuantity] = useState(1);

//    const handleDecrease = () => {
//        if (quantity > 1) setQuantity(quantity - 1);
//    };

//    const handleIncrease = () => {
//        setQuantity(quantity + 1);
//    };

//    return (
//        <div className="flex flex-col lg:flex-row gap-xl mb-xl">
//            {/* CỘT TRÁI: HÌNH ẢNH (55%) */}
//            <div className="w-full lg:w-[55%] flex flex-col gap-md">
//                <div className="relative bg-surface-container-lowest rounded-lg border border-surface-variant p-lg zoom-container cursor-crosshair">
//                    <img
//                        // 🔥 Đổi xxxx thành cổng Backend của em (VD: 7008, 7123...)
//                        src={product?.imageUrl ? `https://localhost:7008${product.imageUrl}` : "https://via.placeholder.com/500x500?text=No+Image"}
//                        alt={product?.name}
//                        className="w-full h-auto object-contain max-h-[500px] zoom-image mix-blend-multiply"
//                    />
//                    <div className="absolute top-md left-md bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded-full flex items-center gap-xs shadow-sm">
//                        <span className="material-symbols-outlined text-[14px] text-tertiary">local_fire_department</span>
//                        <span className="font-label-sm text-label-sm text-on-surface">Đã bán 1.2k+</span>
//                    </div>
//                </div>

//                {/* Các ảnh thu nhỏ (Thumbnails) */}
//                {/*<div className="grid grid-cols-5 gap-sm">*/}
//                {/*    <div className="bg-surface-container-lowest border-2 border-primary rounded-md p-xs cursor-pointer">*/}
//                {/*        <img*/}
//                {/*            src={product?.imageUrl ? `https://localhost:xxxx${product.imageUrl}` : "https://via.placeholder.com/100x100"}*/}
//                {/*            alt="Thumbnail 1"*/}
//                {/*            className="w-full h-full object-contain mix-blend-multiply"*/}
//                {/*        />*/}
//                {/*    </div>*/}
//                {/*    */}{/* Các ô thumbnail trống làm màu theo thiết kế */}
//                {/*    {[1, 2, 3, 4].map(idx => (*/}
//                {/*        <div key={idx} className="bg-surface-container-lowest border border-surface-variant rounded-md p-xs cursor-pointer hover:border-primary transition-colors flex items-center justify-center">*/}
//                {/*            <span className="material-symbols-outlined text-outline">image</span>*/}
//                {/*        </div>*/}
//                {/*    ))}*/}
//                {/*</div>*/}
//            </div>

//            {/* CỘT PHẢI: THÔNG TIN (45%) */}
//            <div className="w-full lg:w-[45%] flex flex-col">
//                <span className="inline-block bg-secondary text-on-secondary font-label-sm text-label-sm px-sm py-xs rounded-full w-max mb-sm uppercase">
//                    {product?.brand?.name || 'SAMSUNG'}
//                </span>
//                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
//                    {product?.name || 'Đang tải tên sản phẩm...'}
//                </h1>

//                {/* Đánh giá */}
//                <div className="flex items-center gap-xs mb-lg">
//                    <div className="flex text-[#FFC107]">
//                        <span className="material-symbols-outlined filled text-[18px]">star</span>
//                        <span className="material-symbols-outlined filled text-[18px]">star</span>
//                        <span className="material-symbols-outlined filled text-[18px]">star</span>
//                        <span className="material-symbols-outlined filled text-[18px]">star</span>
//                        <span className="material-symbols-outlined text-[18px]">star_half</span>
//                    </div>
//                    <span className="font-label-md text-label-md text-on-surface">4.5/5</span>
//                    <span className="font-body-sm text-body-sm text-on-surface-variant ml-xs">(128 đánh giá)</span>
//                </div>

//                {/* Khối Giá */}
//                <div className="bg-surface-container-lowest border border-surface-variant p-lg rounded-lg mb-lg shadow-sm">
//                    <div className="flex items-end gap-md mb-xs">
//                        <span className="font-price-xl text-price-xl text-primary">
//                            {product?.price ? new Intl.NumberFormat('vi-VN').format(product.price) : 0}đ
//                        </span>
//                        {/* Fake giá gốc cao hơn 20% để làm hiệu ứng giảm giá */}
//                        <span className="font-body-md text-body-md text-on-surface-variant line-through mb-1">
//                            {product?.price ? new Intl.NumberFormat('vi-VN').format(product.price * 1.2) : 0}đ
//                        </span>
//                        <span className="bg-[#E8F5E9] text-[#2E7D32] font-label-sm text-label-sm px-xs py-[2px] rounded-sm mb-1">-20%</span>
//                    </div>
//                    <p className="font-body-sm text-body-sm text-on-surface-variant">Trả góp 0% qua thẻ tín dụng</p>
//                </div>

//                {/* Số lượng */}
//                <div className="mb-xl">
//                    <h3 className="font-label-md text-label-md text-on-surface mb-sm">Số lượng:</h3>
//                    <div className="flex items-center border border-outline-variant rounded-md w-max bg-surface-container-lowest">
//                        <button onClick={handleDecrease} className="px-sm py-xs text-on-surface hover:bg-surface-container transition-colors">-</button>
//                        <span className="px-md py-xs font-label-md text-label-md border-l border-r border-outline-variant w-12 text-center">
//                            {quantity}
//                        </span>
//                        <button onClick={handleIncrease} className="px-sm py-xs text-on-surface hover:bg-surface-container transition-colors">+</button>
//                    </div>
//                    <p className="text-body-sm text-on-surface-variant mt-2">
//                        Kho: {product?.stockQuantity || 0} sản phẩm
//                    </p>
//                </div>

//                {/* Nút Hành động */}
//                <div className="flex flex-col sm:flex-row gap-md mb-xl">
//                    <button className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm">
//                        MUA NGAY
//                    </button>
//                    <button className="flex-1 border-2 border-primary text-primary font-label-md text-label-md py-md rounded-lg hover:bg-primary-fixed transition-colors">
//                        THÊM VÀO GIỎ
//                    </button>
//                </div>

//                {/* Cam kết */}
//                <div className="flex flex-col gap-sm border-t border-surface-variant pt-md">
//                    <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
//                        <span className="material-symbols-outlined text-secondary">local_shipping</span>
//                        <span>Giao hàng 2H nội thành HCM</span>
//                    </div>
//                    <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
//                        <span className="material-symbols-outlined text-secondary">verified_user</span>
//                        <span>Bảo hành chính hãng toàn quốc</span>
//                    </div>
//                </div>
//            </div>
//        </div>
//    );
//};

//export default ProductInfo;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getCart, saveCart } from '../../utils/cartUtils';

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    // 🔥 1. State quản lý việc hiển thị thông báo (Toast Alert)
    const [showToast, setShowToast] = useState(false);
    
    // Toast báo lỗi số lượng
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    // 🔥 2. Hàm xử lý khi nhấn nút "THÊM VÀO GIỎ"
    const handleAddToCart = () => {
        if (!isLoggedIn()) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate('/login');
            return;
        }

        // 1. Kéo giỏ hàng hiện tại từ bộ nhớ ra (Nếu chưa có thì tạo mảng rỗng [])
        const currentCart = getCart();

        // 2. Kiểm tra xem sản phẩm này đã từng được thêm vào giỏ chưa
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            // Nếu có rồi -> Chỉ cần cộng dồn số lượng
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu chưa có -> Thêm nguyên một object sản phẩm mới vào mảng
            currentCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl, // Lấy luôn đường dẫn ảnh để qua trang kia hiện
                quantity: quantity,
                stockQuantity: product.stockQuantity // Lưu lại tồn kho cho Cart kiểm tra sau này
            });
        }

        // 3. Đẩy mảng mới cập nhật ngược lại vào bộ nhớ
        saveCart(currentCart);

        // 5. Hiển thị thông báo thành công (code cũ)
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-xl mb-xl relative">

            {/* 🔥 3. GIAO DIỆN HỘP THÔNG BÁO (TOAST ALERT) XUẤT HIỆN Ở GÓC TRÊN PHẢI */}
            <div className={`fixed top-24 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 transition-all duration-300 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-green-500 text-white rounded-full p-1 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Thêm vào giỏ thành công!</span>
                    <span className="text-[12px] text-slate-400">Đã thêm {quantity} sản phẩm vào giỏ hàng.</span>
                </div>
                <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-white ml-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>

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


            {/* CỘT TRÁI: HÌNH ẢNH (55%) */}
            <div className="w-full lg:w-[55%] flex flex-col gap-md">
                <div className="relative bg-surface-container-lowest rounded-lg border border-surface-variant p-lg zoom-container cursor-crosshair">
                    <img
                        src={product?.imageUrl ? `${process.env.REACT_APP_IMAGE_BASE_URL}${product.imageUrl}` : "https://via.placeholder.com/500x500?text=No+Image"}
                        alt={product?.name}
                        className="w-full h-auto object-contain max-h-[500px] zoom-image mix-blend-multiply"
                    />
                    <div className="absolute top-md left-md bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded-full flex items-center gap-xs shadow-sm">
                        <span className="material-symbols-outlined text-[14px] text-tertiary">local_fire_department</span>
                        <span className="font-label-sm text-label-sm text-on-surface">Đã bán 1.2k+</span>
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN (45%) */}
            <div className="w-full lg:w-[45%] flex flex-col">
                <span className="inline-block bg-secondary text-on-secondary font-label-sm text-label-sm px-sm py-xs rounded-full w-max mb-sm uppercase">
                    {product?.brand?.name || 'SAMSUNG'}
                </span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
                    {product?.name || 'Đang tải tên sản phẩm...'}
                </h1>

                {/* Đánh giá */}
                <div className="flex items-center gap-xs mb-lg">
                    <div className="flex text-[#FFC107]">
                        <span className="material-symbols-outlined filled text-[18px]">star</span>
                        <span className="material-symbols-outlined filled text-[18px]">star</span>
                        <span className="material-symbols-outlined filled text-[18px]">star</span>
                        <span className="material-symbols-outlined filled text-[18px]">star</span>
                        <span className="material-symbols-outlined text-[18px]">star_half</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface">4.5/5</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant ml-xs">(128 đánh giá)</span>
                </div>

                {/* Khối Giá */}
                <div className="bg-surface-container-lowest border border-surface-variant p-lg rounded-lg mb-lg shadow-sm">
                    <div className="flex items-end gap-md mb-xs">
                        <span className="font-price-xl text-price-xl text-primary">
                            {product?.price ? new Intl.NumberFormat('vi-VN').format(product.price) : 0}đ
                        </span>
                        <span className="font-body-md text-body-md text-on-surface-variant line-through mb-1">
                            {product?.price ? new Intl.NumberFormat('vi-VN').format(product.price * 1.2) : 0}đ
                        </span>
                        <span className="bg-[#E8F5E9] text-[#2E7D32] font-label-sm text-label-sm px-xs py-[2px] rounded-sm mb-1">-20%</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Trả góp 0% qua thẻ tín dụng</p>
                </div>

                {/* Số lượng */}
                <div className="mb-xl">
                    <h3 className="font-label-md text-label-md text-on-surface mb-sm">Số lượng:</h3>
                    <div className="flex items-center border border-outline-variant rounded-md w-max bg-surface-container-lowest">
                        <button onClick={handleDecrease} className="px-sm py-xs text-on-surface hover:bg-surface-container transition-colors">-</button>
                        <span className="px-md py-xs font-label-md text-label-md border-l border-r border-outline-variant w-12 text-center">
                            {quantity}
                        </span>
                        <button onClick={handleIncrease} className="px-sm py-xs text-on-surface hover:bg-surface-container transition-colors">+</button>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                        Kho: {product?.stockQuantity || 0} sản phẩm
                    </p>
                </div>

                {/* Nút Hành động */}
                <div className="flex flex-col sm:flex-row gap-md mb-xl">
                    <button 
                        onClick={() => {
                            if (!isLoggedIn()) {
                                alert("Vui lòng đăng nhập để mua hàng!");
                                navigate('/login');
                                return;
                            }
                            
                            const currentCart = getCart();
                            const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
                            const currentQty = existingItemIndex !== -1 ? currentCart[existingItemIndex].quantity : 0;

                            if (currentQty + quantity > product.stockQuantity) {
                                setErrorMessage(`Sản phẩm "${product.name}" chỉ còn ${product.stockQuantity} cái trong kho! Bạn đang cố mua tổng cộng ${currentQty + quantity} cái.`);
                                setShowErrorToast(true);
                                setTimeout(() => setShowErrorToast(false), 4000);
                                return;
                            }
                            
                            handleAddToCart();
                            navigate('/checkout');
                        }}
                        className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
                    >
                        MUA NGAY
                    </button>

                    {/* 🔥 4. GẮN SỰ KIỆN CLICK VÀO NÚT THÊM VÀO GIỎ */}
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 border-2 border-primary text-primary font-label-md text-label-md py-md rounded-lg hover:bg-primary-fixed transition-colors"
                    >
                        THÊM VÀO GIỎ
                    </button>
                </div>

                {/* Cam kết */}
                <div className="flex flex-col gap-sm border-t border-surface-variant pt-md">
                    <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary">local_shipping</span>
                        <span>Giao hàng 2H nội thành HCM</span>
                    </div>
                    <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary">verified_user</span>
                        <span>Bảo hành chính hãng toàn quốc</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;