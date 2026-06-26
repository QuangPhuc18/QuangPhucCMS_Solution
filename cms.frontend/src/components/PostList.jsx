import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import { Link } from 'react-router-dom'; // Tối ưu SPA không lo bị load lại trang

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Khai báo state phục vụ phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // CHỈNH THÀNH 2 ĐỂ DỄ THẤY PHÂN TRANG KHI ÍT BÀI VIẾT

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Quá trình kết nối API bài viết thất bại:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Hàm tiện ích: Xóa các thẻ HTML để văn bản hiển thị sạch sẽ
    const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    if (loading) {
        return (
            <div className="text-center py-12 text-primary flex justify-center items-center gap-2 font-bold">
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Đang nạp dữ liệu cẩm nang mới nhất...
            </div>
        );
    }

    return (
        <section className="my-16 px-2">
            {/* 🔥 PHẦN TIÊU ĐỀ ĐƯỢC ĐƯA VÀO GIỮA & LÀM NỔI BẬT */}
            <div className="text-center max-w-xl mx-auto mb-10 flex flex-col items-center">
                <div className="bg-primary/10 text-primary p-2 rounded-full mb-3 inline-flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">auto_stories</span>
                </div>
                <h2 className="text-3xl font-bold text-on-surface tracking-tight text-uppercase mb-2 relative pb-2">
                    Tin tức & Mẹo vặt
                </h2>
                <div className="w-16 h-1 bg-primary rounded-full mb-3"></div>
               
            </div>

            {posts.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 text-center rounded-xl border border-outline-variant/30 max-w-md mx-auto shadow-sm">
                    <p className="text-on-surface-variant font-body-md">Hiện tại chưa có bài viết nào trong hệ thống.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                            <div
                                key={item.id}
                                className="bg-surface-container-lowest rounded-2xl flex flex-col shadow-[0px_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden border border-outline-variant/10"
                            >
                                {/* 1. KHU VỰC ẢNH (BÊN TRÊN) - Bo tròn góc trên, giới hạn h-52 */}
                                <div className="w-full h-52 bg-surface-container relative overflow-hidden shrink-0">
                                    <img
                                        src={item.imageUrl ? `${process.env.REACT_APP_IMAGE_BASE_URL}${item.imageUrl}` : "https://via.placeholder.com/400x300?text=No+Image"}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Badge trang trí góc ảnh giống các trang báo chí lớn */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-on-surface text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                                        BÀI VIẾT NEW
                                    </div>
                                </div>

                                {/* 2. KHU VỰC NỘI DUNG (BÊN DƯỚI) */}
                                <div className="p-5 flex flex-col flex-grow bg-white">
                                    {/* Ngày tháng đẩy lên trên tiêu đề nhìn thanh lịch hơn */}
                                    <div className="text-xs text-on-surface-variant flex items-center gap-1 mb-2 font-medium">
                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                        {new Date().toLocaleDateString('vi-VN')}
                                    </div>

                                    <h5 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2.5 leading-snug">
                                        <Link to={`/post/${item.id}`}>{item.title}</Link>
                                    </h5>

                                    <p className="text-sm text-on-surface-variant line-clamp-3 mb-5 flex-grow leading-relaxed">
                                        {stripHtml(item.content)}
                                    </p>

                                    {/* CHÂN THẺ - NÚT ĐỌC BÀI VIẾT */}
                                    <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end">
                                        <Link
                                            to={`/post/${item.id}`}
                                            className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group/btn"
                                        >
                                            Đọc bài viết
                                            <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">
                                                arrow_right_alt
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* UI PHÂN TRANG CHO BÀI VIẾT */}
                    {Math.ceil(posts.length / itemsPerPage) > 1 && (
                        <div className="flex justify-center items-center mt-10 gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            
                            {[...Array(Math.ceil(posts.length / itemsPerPage))].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-[#ea580c] text-white shadow-md border-none' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(posts.length / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(posts.length / itemsPerPage)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default PostList;