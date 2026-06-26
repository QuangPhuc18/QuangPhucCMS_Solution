import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';

const PostDetail = () => {
    const { id } = useParams(); // Lấy ID bài viết từ thanh địa chỉ URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(id);
                setPost(data);
            } catch (error) {
                console.error("Không thể tải chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-20 text-primary flex justify-center items-center gap-2 font-bold">
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Đang tải nội dung bài viết...
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-[800px] mx-auto my-10 p-8 text-center bg-surface-container-lowest rounded-xl border">
                <p className="text-on-surface-variant font-medium">Không tìm thấy bài viết này trong hệ thống.</p>
                <Link to="/" className="text-primary mt-4 inline-block hover:underline">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <article className="max-w-[800px] mx-auto bg-surface-container-lowest rounded-2xl p-6 md:p-10 shadow-[0px_2px_8px_rgba(0,0,0,0.05)] mt-6">
            {/* NÚT QUAY LẠI */}
            <Link to="/" className="inline-flex items-center gap-1 text-label-md font-label-md text-secondary hover:text-primary mb-6 transition-colors group">
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Quay lại trang chủ
            </Link>

            {/* TIÊU ĐỀ BÀI VIẾT */}
            <h1 className="text-[28px] md:text-[36px] font-bold text-on-surface leading-tight mb-4 tracking-tight">
                {post.title}
            </h1>

            {/* THÔNG TIN NGÀY THÁNG */}
            <div className="flex items-center gap-4 text-on-surface-variant border-b border-outline-variant/30 pb-6 mb-6 text-body-sm">
                <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] font-semibold">
                    Cẩm nang DigiHome
                </span>
            </div>

            {/* HÌNH ẢNH LỚN ĐẠI DIỆN */}
            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-surface-container mb-8 shadow-sm">
                <img
                    // 🔥 Thay xxxx thành số cổng Backend của em
                    src={post.imageUrl ? `${process.env.REACT_APP_IMAGE_BASE_URL}${post.imageUrl}` : "https://via.placeholder.com/800x450?text=DigiHome+Electronics"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* NỘI DUNG CHI TIẾT ĐẦY ĐỦ */}
            {/* Sử dụng dangerouslySetInnerHTML giúp hiển thị chuẩn định dạng văn bản, xuống dòng từ Rich Text Editor của Admin */}
            <div
                className="text-on-background font-body-lg text-body-lg leading-relaxed space-y-4 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    );
};

export default PostDetail;