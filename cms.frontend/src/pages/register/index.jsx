import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 🔥 Quản lý 5 trường dữ liệu như em yêu cầu
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra nhanh các trường bắt buộc
        if (!formData.fullName || !formData.email || !formData.password) {
            setError('Vui lòng nhập đầy đủ các thông tin bắt buộc!');
            return;
        }

        try {
            setLoading(true);
            // 🔥 Gọi API đăng ký (Em nhớ check lại route này ở Backend nhé)
            const response = await axios.post('https://localhost:7008/api/auth/register', formData);

            if (response.status === 200 || response.status === 201) {
                alert('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
                navigate('/login');
            }
        } catch (err) {
            console.error('Lỗi đăng ký:', err);
            setError(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 bg-[#fbf9f9]">
            {/* THẺ ĐĂNG KÝ (GIỐNG GIAO DIỆN LOGIN) */}
            <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] border border-slate-100">

                {/* Header: Logo Bolt & Tiêu đề */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-primary/5 text-primary w-16 h-16 rounded-full mb-4">
                        <span className="material-symbols-outlined text-[40px] filled" style={{ color: '#b7131a' }}>bolt</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tạo tài khoản</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Tham gia đại gia đình DigiHome ngay hôm nay</p>
                </div>

                {/* Thông báo lỗi */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-center gap-2 animate-shake">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 1. Họ và Tên */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-[20px]">person</span>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Họ và Tên"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-slate-50/30"
                        />
                    </div>

                    {/* 2. Địa chỉ Email */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-[20px]">mail</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Địa chỉ Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-slate-50/30"
                        />
                    </div>

                    {/* 3. Số điện thoại */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-[20px]">call</span>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Số điện thoại"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-slate-50/30"
                        />
                    </div>

                    {/* 4. Mật khẩu */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-[20px]">lock</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-slate-50/30"
                        />
                    </div>

                    {/* 5. Địa chỉ giao hàng */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-[20px]">location_on</span>
                        <input
                            type="text"
                            name="address"
                            placeholder="Địa chỉ giao hàng"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-slate-50/30"
                        />
                    </div>

                    {/* Nút Đăng ký màu Đỏ chuẩn DigiHome */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#b7131a] text-white h-12 rounded-xl font-bold text-sm hover:bg-red-800 transition-all shadow-lg shadow-red-900/10 mt-4 flex items-center justify-center uppercase tracking-wider"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            'ĐĂNG KÝ NGAY'
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-slate-50 text-center text-sm">
                    <span className="text-slate-500 font-medium">Bạn đã có tài khoản? </span>
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;