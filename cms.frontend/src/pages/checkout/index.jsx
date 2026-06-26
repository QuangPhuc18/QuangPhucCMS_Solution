import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isLoggedIn, getCart, clearCart } from '../../utils/cartUtils';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState('');
    
    // Thêm các state bắt buộc cho Checkout Validation
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isLoggedIn()) {
            alert("Vui lòng đăng nhập để thanh toán!");
            navigate('/login');
            return;
        }

        // Lấy giỏ hàng bằng cartUtils
        const savedCart = getCart();
        setCartItems(savedCart);

        // Lấy thông tin user đăng nhập
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // Tự động điền nếu user đã có thông tin
            if (parsedUser.fullName) setFullName(parsedUser.fullName);
            if (parsedUser.phone) setPhone(parsedUser.phone);
            if (parsedUser.address) setAddress(parsedUser.address);
        }
    }, []);

    const calculateTotal = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setErrorMsg("Vui lòng Đăng nhập để tiếp tục thanh toán!");
            return;
        }

        if (cartItems.length === 0) {
            setErrorMsg("Giỏ hàng của bạn đang trống!");
            return;
        }

        // BẮT LỖI FORM ĐỂ ĐÁP ỨNG TIÊU CHÍ 29
        if (!fullName.trim()) {
            setErrorMsg("Vui lòng nhập Họ và tên người nhận hàng.");
            return;
        }
        if (!phone.trim()) {
            setErrorMsg("Vui lòng nhập Số điện thoại liên hệ.");
            return;
        }
        if (!address.trim()) {
            setErrorMsg("Vui lòng nhập Địa chỉ nhận hàng.");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            // DTO Payload (Cần map chính xác với Backend)
            const payload = {
                customerId: user.id, // Lấy ID của User đã đăng nhập làm CustomerId
                fullName: fullName,
                phone: phone,
                address: address,
                notes: notes,
                orderDetails: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, payload);

            // Xóa giỏ hàng sau khi thành công
            clearCart();
            setCartItems([]);
            setSuccess(true);

        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMsg(error.response.data.message); // Hiển thị lỗi thiếu tồn kho từ Backend
            } else {
                setErrorMsg("Đã xảy ra lỗi khi kết nối với máy chủ. Vui lòng thử lại!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[48px]">check_circle</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Đặt hàng thành công!</h1>
                <p className="text-slate-500 mb-8 max-w-md">Cảm ơn bạn đã mua sắm tại DigiHome. Hóa đơn đã được ghi nhận và kho hàng đã được tự động cập nhật trừ số lượng.</p>
                <Link to="/shop" className="bg-[#ea580c] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#b7131a] transition-colors shadow-lg">
                    Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full py-6 relative">
            <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex items-center space-x-2 text-sm text-slate-500">
                    <li><Link className="hover:text-[#ea580c] transition-colors font-semibold" to="/">Trang chủ</Link></li>
                    <li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li><Link className="hover:text-[#ea580c] transition-colors font-semibold" to="/cart">Giỏ hàng</Link></li>
                    <li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li aria-current="page" className="text-slate-900 font-bold">Thanh toán</li>
                </ol>
            </nav>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">
                Hoàn tất đơn hàng
            </h1>

            {errorMsg && (
                <div className="mb-8 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined shrink-0">error</span>
                    <div className="flex flex-col">
                        <span className="font-bold">Không thể đặt hàng</span>
                        <span className="text-sm">{errorMsg}</span>
                        {!user && (
                            <Link to="/login" className="mt-2 text-sm font-bold bg-white w-max px-4 py-1.5 rounded-lg border border-red-200 hover:bg-red-600 hover:text-white transition-colors">
                                Đi đến Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* FORM ĐIỀN THÔNG TIN */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#ea580c]">local_shipping</span>
                            Thông tin giao hàng
                        </h2>

                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
                            {/* Hiển thị tóm tắt User nếu đã đăng nhập */}
                            {user ? (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                                    <div className="text-sm text-slate-500 mb-1 font-semibold uppercase">Tài khoản đang mua hàng</div>
                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-[18px]">verified_user</span>
                                        {user.fullName || user.username}
                                    </div>
                                    <div className="text-sm text-slate-600 mt-1">{user.email}</div>
                                </div>
                            ) : (
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mb-4 text-orange-800 text-sm">
                                    Bạn đang ở chế độ khách. Hệ thống yêu cầu đăng nhập để liên kết đơn hàng.
                                </div>
                            )}

                            {/* FORM NHẬP THÔNG TIN BẮT BUỘC (FullName, Phone, Address) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all"
                                        placeholder="Nhập họ tên người nhận"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all"
                                        placeholder="Nhập số điện thoại liên hệ"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all"
                                    placeholder="Ví dụ: Số nhà, Đường, Quận/Huyện, Tỉnh/Thành phố..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea 
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all min-h-[120px]"
                                    placeholder="Ví dụ: Giao hàng giờ hành chính, gọi điện trước khi giao..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </form>
                    </div>
                </div>

                {/* TÓM TẮT GIỎ HÀNG BÊN PHẢI */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] sticky top-28">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Chi tiết đơn hàng</h3>
                        
                        <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-16 h-16 rounded-lg bg-slate-50 shrink-0 border border-slate-100 overflow-hidden">
                                        <img 
                                            src={item.imageUrl ? `${process.env.REACT_APP_IMAGE_BASE_URL}${item.imageUrl}` : "https://via.placeholder.com/150"} 
                                            alt={item.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">{item.name}</span>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-xs text-slate-500 font-medium">SL: {item.quantity}</span>
                                            <span className="text-sm font-bold text-[#b7131a]">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-4 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-800 font-bold uppercase tracking-wide">Tổng thanh toán</span>
                                <span className="text-2xl font-black text-[#ea580c]">
                                    {new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ
                                </span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isSubmitting || cartItems.length === 0}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg uppercase tracking-wide transition-all ${isSubmitting ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#ea580c] text-white hover:bg-[#b7131a] shadow-orange-900/20'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    Xác nhận Đặt hàng
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
