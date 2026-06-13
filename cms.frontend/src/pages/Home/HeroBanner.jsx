import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
    return (
        <section className="mb-xl relative rounded-3xl overflow-hidden shadow-2xl bg-primary-container h-[250px] md:h-[420px] flex items-center justify-center group">
            {/* Lớp nền màu Gradient đỏ rực rỡ */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-primary to-orange-600 opacity-95"></div>

            {/* Hiệu ứng ánh sáng trang trí (Abstract Blobs) */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-20 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/3 translate-y-1/3"></div>

            {/* Nội dung chính giữa Banner */}
            <div className="relative z-10 text-center flex flex-col items-center px-4 w-full max-w-4xl">
                {/* Icon sấm sét có hiệu ứng nhịp tim */}
                <span className="material-symbols-outlined text-white text-[56px] md:text-[80px] mb-2 animate-pulse drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bolt
                </span>

                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                    ĐẠI TIỆC SIÊU SALE
                </h1>

                {/* Đồng hồ đếm ngược phong cách Glassmorphism (Kính mờ) */}
                <div className="flex gap-4 md:gap-6 items-center bg-white/20 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] mb-8">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-4xl font-bold text-white">05</span>
                        <span className="text-[11px] md:text-xs text-white/90 uppercase font-medium tracking-wider">Giờ</span>
                    </div>
                    <span className="text-white font-bold text-2xl mb-4">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-4xl font-bold text-white">42</span>
                        <span className="text-[11px] md:text-xs text-white/90 uppercase font-medium tracking-wider">Phút</span>
                    </div>
                    <span className="text-white font-bold text-2xl mb-4">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-4xl font-bold text-white animate-pulse">18</span>
                        <span className="text-[11px] md:text-xs text-white/90 uppercase font-medium tracking-wider">Giây</span>
                    </div>
                </div>

                {/* Nút Call to Action */}
                <Link to="/shop" className="bg-white text-primary font-bold text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg hover:bg-surface hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    Săn deal điện máy ngay
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
            </div>
        </section>
    );
};

export default HeroBanner;