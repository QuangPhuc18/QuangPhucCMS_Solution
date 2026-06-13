import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail'; // 🔥 Import trang chi tiết mới tạo
import ProductDetail from './pages/product-detail/index';
import HeroBanner from './pages/Home/HeroBanner';
import Login from './pages/login/index';
import Register from './pages/register/index';
import BlogList from './pages/blog/index'; // Nhập trang danh sách bài viết riêng
import Cart from './pages/cart/index';
function App() {
    return (
        <Router> {/* Bọc toàn bộ ứng dụng trong bộ định tuyến Router */}
            <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
                <Header />
            
                {/* Phần Main Content */}
                <main className="flex-grow pt-[140px] md:pt-[130px] pb-xl max-w-[1200px] mx-auto w-full px-grid-margin">
                    <Routes>

                        {/* TRANG CHỦ: Hiển thị Banner, Sản phẩm, Tin tức */}
                        <Route path="/" element={
                            <>
                                {/* Khối Banner đỏ */}
                                <section className="mb-xl relative rounded-xl overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.05)] bg-primary-container h-[200px] md:h-[400px] flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-surface-tint opacity-90"></div>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-on-primary text-[48px] md:text-[80px] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                        <h1 className="text-display-lg font-display-lg text-on-primary mb-md tracking-tight">SIÊU SALE HÔM NAY</h1>
                                        <div className="flex gap-sm items-center bg-on-primary text-primary px-lg py-sm rounded-full font-headline-md">
                                            <span>05</span><span className="text-on-surface-variant text-body-md">:</span>
                                            <span>42</span><span className="text-on-surface-variant text-body-md">:</span>
                                            <span>18</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Danh sách sản phẩm điện máy */}
                                <ProductList />

                                {/* Danh sách bài viết tin tức */}
                                <PostList />
                            </>
                        } />
                        <Route path="/shop" element={<ProductList />} />

                        {/* 🔥 3. TRANG DANH MỤC (Lọc sản phẩm khi bấm vào Tivi, Tủ lạnh...) */}
                        <Route path="/shop/category/:categoryId" element={<ProductList />} />
                        <Route path="/cart" element={<Cart />} />
                        {/* TRANG CHI TIẾT BÀI VIẾT: Tự động bật lên khi khớp URL */}
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/blog" element={<BlogList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;