import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Dùng axios thẳng hoặc tạo authService riêng tùy em

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(false);

        // Validate cơ bản
        if (!formData.email || !formData.password) {
            setError('Vui lòng điền đầy đủ thông tin đăng nhập!');
            return;
        }

        try {
            setLoading(true);

            // 🔥 GỌI API ĐĂNG NHẬP XUỐNG BACKEND C# 
            // Đã đồng bộ sử dụng biến môi trường .env
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);

            if (response.data && response.data.token) {
                // 🔥 Lưu token vào localStorage để Header nhận diện trạng thái Đăng nhập
                localStorage.setItem('token', response.data.token);

                // Nếu Backend có trả về thông tin tên user, lưu thêm (tùy chọn)
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }

                // Đăng nhập thành công -> Bắn event để Header cập nhật
                window.dispatchEvent(new Event('authChange'));
                navigate('/');
            }
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Tài khoản hoặc mật khẩu không chính xác!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] border border-slate-100">

                {/* Đầu Form: Logo & Tiêu đề */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-primary/10 text-primary w-16 h-16 rounded-full mb-4">
                        <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Chào mừng trở lại!
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Đăng nhập vào tài khoản DigiHome của bạn
                    </p>
                </div>

                {/* Khối hiển thị lỗi nếu đăng nhập thất bại */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-pulse">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Form nhập liệu */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Ô nhập Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Địa chỉ Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                                    placeholder="name@example.com"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[20px]">mail</span>
                            </div>
                        </div>

                        {/* Ô nhập Mật khẩu */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                                    placeholder="••••••••"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[20px]">lock</span>
                            </div>
                        </div>
                    </div>

                    {/* Ghi nhớ đăng nhập & Quên mật khẩu */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded-md"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-slate-600 font-medium select-none">
                                Ghi nhớ tôi
                            </label>
                        </div>

                        <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* Nút bấm Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white h-11 rounded-xl text-sm font-bold hover:bg-red-800 transition-all flex items-center justify-center shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                            ) : (
                                'ĐĂNG NHẬP'
                            )}
                        </button>
                    </div>
                </form>

                {/* Điều hướng sang Đăng ký */}
                <div className="text-center text-sm border-t border-slate-100 pt-4">
                    <span className="text-slate-500">Bạn chưa có tài khoản? </span>
                    <Link to="/register" className="font-bold text-primary hover:underline">
                        Đăng ký ngay
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;