import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HeroBanner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/banners/active`);
                setBanners(response.data);
            } catch (error) {
                console.error("Lỗi khi tải Banner:", error);
            }
        };
        fetchBanners();
    }, []);

    // Autoplay Slider
    useEffect(() => {
        if (banners.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 3000); // Đổi banner mỗi 3s

        return () => clearInterval(timer);
    }, [banners.length]);

    // Nếu không có banner nào trong Database, hiển thị Banner tĩnh mặc định
    if (banners.length === 0) {
        return (
            <section className="mb-xl relative rounded-3xl overflow-hidden shadow-2xl bg-primary-container h-[300px] md:h-[500px] flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-primary to-orange-600 opacity-95"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-20 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
                
                <div className="relative z-10 text-center flex flex-col items-center px-4 w-full max-w-4xl">
                    <span className="material-symbols-outlined text-white text-[56px] md:text-[80px] mb-2 animate-pulse drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">ĐẠI TIỆC SIÊU SALE</h1>
                    <Link to="/shop" className="bg-white text-primary font-bold text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg hover:bg-surface hover:scale-105 transition-all duration-300 flex items-center gap-2">
                        Săn deal điện máy ngay
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                </div>
            </section>
        );
    }

    // Hiển thị danh sách Banner động
    return (
        <section className="mb-xl relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 w-full aspect-[16/5] group">

            {banners.map((banner, index) => (
                <div 
                    key={banner.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Hình ảnh nền nguyên bản (100% sáng, rõ nét) */}
                    <img 
                        src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `${process.env.REACT_APP_IMAGE_BASE_URL}${banner.imageUrl}`} 
                        alt={banner.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Ẩn text đi khỏi giao diện để không đè lên ảnh, nhưng vẫn giữ lại cho SEO */}
                    <div className="sr-only">
                        <h2>{banner.title}</h2>
                        {banner.subtitle && <p>{banner.subtitle}</p>}
                    </div>
                </div>
            ))}

            {/* Nút điều hướng (Dots) */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#ea580c] w-8' : 'bg-white/50 hover:bg-white'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroBanner;