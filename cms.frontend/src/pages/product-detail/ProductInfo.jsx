import React, { useState } from 'react';

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-xl mb-xl">
            {/* CỘT TRÁI: HÌNH ẢNH (55%) */}
            <div className="w-full lg:w-[55%] flex flex-col gap-md">
                <div className="relative bg-surface-container-lowest rounded-lg border border-surface-variant p-lg zoom-container cursor-crosshair">
                    <img
                        // 🔥 Đổi xxxx thành cổng Backend của em (VD: 7008, 7123...)
                        src={product?.imageUrl ? `https://localhost:7008${product.imageUrl}` : "https://via.placeholder.com/500x500?text=No+Image"}
                        alt={product?.name}
                        className="w-full h-auto object-contain max-h-[500px] zoom-image mix-blend-multiply"
                    />
                    <div className="absolute top-md left-md bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded-full flex items-center gap-xs shadow-sm">
                        <span className="material-symbols-outlined text-[14px] text-tertiary">local_fire_department</span>
                        <span className="font-label-sm text-label-sm text-on-surface">Đã bán 1.2k+</span>
                    </div>
                </div>

                {/* Các ảnh thu nhỏ (Thumbnails) */}
                {/*<div className="grid grid-cols-5 gap-sm">*/}
                {/*    <div className="bg-surface-container-lowest border-2 border-primary rounded-md p-xs cursor-pointer">*/}
                {/*        <img*/}
                {/*            src={product?.imageUrl ? `https://localhost:xxxx${product.imageUrl}` : "https://via.placeholder.com/100x100"}*/}
                {/*            alt="Thumbnail 1"*/}
                {/*            className="w-full h-full object-contain mix-blend-multiply"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    */}{/* Các ô thumbnail trống làm màu theo thiết kế */}
                {/*    {[1, 2, 3, 4].map(idx => (*/}
                {/*        <div key={idx} className="bg-surface-container-lowest border border-surface-variant rounded-md p-xs cursor-pointer hover:border-primary transition-colors flex items-center justify-center">*/}
                {/*            <span className="material-symbols-outlined text-outline">image</span>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}
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
                        {/* Fake giá gốc cao hơn 20% để làm hiệu ứng giảm giá */}
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
                    <button className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm">
                        MUA NGAY
                    </button>
                    <button className="flex-1 border-2 border-primary text-primary font-label-md text-label-md py-md rounded-lg hover:bg-primary-fixed transition-colors">
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