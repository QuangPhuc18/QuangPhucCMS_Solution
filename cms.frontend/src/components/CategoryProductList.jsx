import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = () => {
    // 1. Khai báo state để lưu trữ danh sách danh mục sản phẩm
    const [categoryProducts, setCategoryProducts] = useState([]);
    // 2. State quản lý trạng thái loading (hiệu ứng chờ)
    const [loading, setLoading] = useState(true);

    // 3. Tự động gọi API một lần duy nhất khi component hiển thị
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                // Gọi sang lớp Service để thực hiện Request HTTP GET
                const data = await categoryProductService.getAllCategoryProducts();
                // Cập nhật mảng dữ liệu nhận được vào State
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []);

    if (loading) {
        return <div className="text-center my-4 text-secondary"><i className="fas fa-spinner fa-spin mr-2"></i>Đang tải danh mục sản phẩm...</div>;
    }

    return (
        <div className="card shadow-sm border-0 rounded-lg">
            {/* Header */}
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-cubes text-primary mr-2" style={{ fontSize: '1.3rem' }}></i> Danh mục SP
                </h5>
            </div>

            {/* List Group */}
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">Không có danh mục nào trong DB.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id} // Cơ chế CamelCase của .NET tự đổi Id thành id viết thường
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3"
                                style={{ fontSize: '0.95rem', color: '#495057' }}
                            >
                                <span className="font-weight-normal">{item.name}</span>
                                <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;