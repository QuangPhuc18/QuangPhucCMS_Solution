import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService'; // Lùi 2 cấp thư mục để vào services

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Khai báo state phục vụ phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // CHỈNH LẠI THÀNH 2 ĐỂ BẠN DỄ THẤY PHÂN TRANG KHI CÓ ÍT BÀI VIẾT

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true);
                // Gọi tầng service lấy toàn bộ bài viết từ C# Backend
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết cẩm nang:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPosts();
    }, []);

    // Hàm lọc sạch thẻ HTML (như <p>, <strong> từ CKEditor) để hiển thị nội dung tóm tắt
    const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-primary flex justify-center items-center gap-2 font-bold">
                <span className="material-symbols-outlined animate-spin text-[28px]">refresh</span>
                Đang nạp dữ liệu cẩm nang điện máy...
            </div>
        );
    }

    return (
        <div className="w-full py-6">
            {/* 1. Breadcrumb dẫn đường */}
            <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex items-center space-x-2 text-body-sm font-body-sm text-on-surface-variant">
                    <li><Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link></li>
                    <li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li aria-current="page" class="text-on-surface font-semibold">Cẩm nang & Mẹo vặt</li>
                </ol>
            </nav>

            {/* 2. Tiêu đề khu vực thiết kế nổi bật */}
            <div className="bg-gradient-to-r from-red-800 to-primary text-white p-8 md:p-12 rounded-3xl shadow-md mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full filter blur-2xl translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                        <span className="material-symbols-outlined text-[14px]">local_fire_department</span> Tin mới nhất
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 uppercase">CẨM NANG ĐIỆN MÁY</h1>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed">
                        Nơi tổng hợp những mẹo vặt gia đình, hướng dẫn chọn mua và sử dụng các thiết bị công nghệ, điện tử, điện lạnh thông minh tối ưu nhất từ chuyên gia DigiHome.
                    </p>
                </div>
            </div>

            {/* 3. Lưới hiển thị danh sách bài viết */}
            {posts.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-outline-variant/30 max-w-md mx-auto shadow-sm">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">newspaper</span>
                    <p className="text-on-surface-variant font-medium">Hiện tại chưa có bài viết cẩm nang nào trong hệ thống.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                            <div
                                key={item.id}
                                className="bg-surface-container-lowest rounded-2xl flex flex-col shadow-[0px_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden border border-slate-100"
                            >
                                {/* Khu vực ảnh bìa bài viết */}
                                <div className="w-full aspect-[4/3] bg-surface-container relative overflow-hidden shrink-0">
                                    <img
                                        src={item.imageUrl ? `${process.env.REACT_APP_IMAGE_BASE_URL}${item.imageUrl}` : "https://via.placeholder.com/400x300?text=No+Image"}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute bottom-3 left-3 bg-inverse-surface/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm">
                                        Tin Tức
                                    </span>
                                </div>

                                {/* Khu vực thông tin chữ */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-body-lg font-headline-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2.5 min-h-[48px] leading-snug">
                                        <Link to={`/post/${item.id}`} className="outline-none">
                                            {item.title}
                                        </Link>
                                    </h3>

                                    <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-3 mb-5 flex-grow leading-relaxed">
                                        {stripHtml(item.content)}
                                    </p>

                                    {/* Chân thẻ chứa ngày tháng & nút đọc tiếp */}
                                    <div className="flex justify-between items-center mt-auto pt-3.5 border-t border-slate-100">
                                        <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
                                            {new Date().toLocaleDateString('vi-VN')}
                                        </span>
                                        <Link
                                            to={`/post/${item.id}`}
                                            className="text-label-md font-label-md text-primary hover:text-red-800 font-semibold flex items-center gap-0.5 group/btn"
                                        >
                                            Đọc tiếp
                                            <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">
                                                arrow_forward
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* UI PHÂN TRANG CHO BÀI VIẾT */}
                    {Math.ceil(posts.length / itemsPerPage) > 1 && (
                        <div className="flex justify-center items-center mt-12 gap-2">
                            <button 
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(prev - 1, 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            
                            {[...Array(Math.ceil(posts.length / itemsPerPage))].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-[#ea580c] text-white shadow-md border-none' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(prev + 1, Math.ceil(posts.length / itemsPerPage)));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === Math.ceil(posts.length / itemsPerPage)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BlogList;