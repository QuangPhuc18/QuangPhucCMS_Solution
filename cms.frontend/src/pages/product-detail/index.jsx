import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService'; // Chú ý đường dẫn lùi 2 cấp
import ProductInfo from './ProductInfo';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                // Cần đảm bảo file productService.js của em có hàm getProductById(id)
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

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
            <nav aria-label="Breadcrumb" className="mb-lg">
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
                    <button className="px-lg py-sm font-label-md text-label-md text-primary border-b-2 border-primary whitespace-nowrap">
                        Mô tả sản phẩm
                    </button>
                    <button className="px-lg py-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">
                        Thông số kỹ thuật
                    </button>
                    <button className="px-lg py-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">
                        Đánh giá (128)
                    </button>
                </div>

                <div className="bg-surface-container-lowest p-lg rounded-lg border border-surface-variant shadow-sm text-on-surface-variant text-body-md font-body-md">
                    {product.description ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description }} className="whitespace-pre-line leading-relaxed" />
                    ) : (
                        <p>Đang cập nhật nội dung mô tả chi tiết cho sản phẩm này.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;