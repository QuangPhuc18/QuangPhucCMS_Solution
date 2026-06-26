import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!email) {
            setError("Vui lòng nhập Email!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:7008/api'}/auth/forgot-password`, { email });
            setSuccess(response.data.message || "Đã gửi mật khẩu mới vào Email!");
            setEmail(""); // Xóa trắng ô nhập sau khi gửi
        } catch (err) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] border border-slate-100">

                {/* Đầu Form: Logo & Tiêu đề */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-primary/10 text-primary w-16 h-16 rounded-full mb-4">
                        <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Quên Mật Khẩu
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Vui lòng nhập Email bạn đã đăng ký. Chúng tôi sẽ gửi một mật khẩu mới vào hộp thư của bạn.
                    </p>
                </div>

                {/* Thông báo lỗi */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-pulse">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Thông báo thành công */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-pulse">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span className="font-medium">{success}</span>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                                    placeholder="name@example.com"
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[20px]">mail</span>
                            </div>
                        </div>
                    </div>

                    {/* Nút bấm Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white h-11 rounded-xl text-sm font-bold hover:bg-red-800 transition-all flex items-center justify-center shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                            ) : (
                                'GỬI MẬT KHẨU MỚI'
                            )}
                        </button>
                    </div>
                </form>

                {/* Điều hướng về Đăng nhập */}
                <div className="text-center text-sm border-t border-slate-100 pt-4 mt-6">
                    <span className="text-slate-500">Nhớ ra mật khẩu rồi? </span>
                    <Link to="/login" className="font-bold text-primary hover:underline">
                        Đăng nhập lại
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;
