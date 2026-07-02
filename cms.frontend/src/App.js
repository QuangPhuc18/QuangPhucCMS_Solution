import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail'; // 🔥 Import trang chi tiết mới tạo
import CategoryMenu from './components/CategoryMenu'; // Component danh mục tách rời
import ProductDetail from './pages/product-detail/index';
import HeroBanner from './pages/Home/HeroBanner';
import Login from './pages/login/index';
import Register from './pages/register/index';
import ForgotPassword from './pages/login/ForgotPassword';
import BlogList from './pages/blog/index'; // Nhập trang danh sách bài viết riêng
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';
import Profile from './pages/profile/index'; // Nhập trang Profile

function App() {
    return (
        <Router> {/* Bọc toàn bộ ứng dụng trong bộ định tuyến Router */}
            <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
                <Header />
            
                {/* Phần Main Content */}
                <main className="flex-grow pt-[140px] md:pt-[130px] pb-xl max-w-[1200px] mx-auto w-full px-grid-margin">
                    <Routes>

                        {/* TRANG CHỦ: Hiển thị Banner, Danh mục, Sản phẩm, Tin tức */}
                        <Route path="/" element={
                            <>
                                {/* Khối Banner Động */}
                                <HeroBanner />

                                {/* Component Danh Mục (CategoryMenu) */}
                                <CategoryMenu />

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
                        <Route path="/checkout" element={<Checkout />} />
                        {/* TRANG CHI TIẾT BÀI VIẾT: Tự động bật lên khi khớp URL */}
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/blog" element={<BlogList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/my-orders" element={<Profile />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;