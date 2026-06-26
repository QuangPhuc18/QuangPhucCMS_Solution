import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Trạng thái cho Cập nhật thông tin
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ fullName: '', phone: '', address: '' });
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // Trạng thái cho Đổi mật khẩu
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setProfileForm({
            fullName: parsedUser.fullName || '',
            phone: parsedUser.phone || '',
            address: parsedUser.address || ''
        });

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/customer/${parsedUser.id}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (!user) return null;

    // --- CẬP NHẬT THÔNG TIN ---
    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const submitProfile = async () => {
        setProfileMessage({ type: '', text: '' });
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/auth/profile/${user.id}`, profileForm);
            
            // Cập nhật state và localStorage
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Cập nhật Header (tên hiển thị) nếu cần
            window.dispatchEvent(new Event('authChange'));

            setProfileMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
            setIsEditingProfile(false);
            
            setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra!' });
        }
    };

    // --- ĐỔI MẬT KHẨU ---
    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const submitPassword = async () => {
        setPasswordMessage({ type: '', text: '' });

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setPasswordMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Mật khẩu mới phải từ 6 ký tự trở lên!' });
            return;
        }

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/auth/change-password/${user.id}`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            
            setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            setIsChangingPassword(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

            setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra!' });
        }
    };

    // Helper trạng thái
    const getStatusText = (status) => {
        switch (status) {
            case 0: return { text: 'Đang xử lý', color: 'bg-amber-100 text-amber-700' };
            case 1: return { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' };
            case 2: return { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700' };
            case 3: return { text: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
            case 4: return { text: 'Đã hủy', color: 'bg-red-100 text-red-700' };
            default: return { text: 'Đang xử lý', color: 'bg-slate-100 text-slate-700' };
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* CỘT TRÁI: THÔNG TIN HỒ SƠ (30%) */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] sticky top-24">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-50">
                            <div className="w-24 h-24 bg-orange-50 text-[#ea580c] rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-[48px]">account_circle</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{user.fullName}</h2>
                            <p className="text-sm text-slate-500 font-medium">Khách hàng thành viên</p>
                        </div>
                        
                        {/* THÔNG BÁO CẬP NHẬT PROFILE */}
                        {profileMessage.text && (
                            <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {profileMessage.text}
                            </div>
                        )}

                        <div className="py-6 space-y-4">
                            {!isEditingProfile ? (
                                <>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400">mail</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email</p>
                                            <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400">badge</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Họ và tên</p>
                                            <p className="text-sm font-semibold text-slate-700">{user.fullName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400">call</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Số điện thoại</p>
                                            <p className="text-sm font-semibold text-slate-700">{user.phone || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400">location_on</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Địa chỉ</p>
                                            <p className="text-sm font-semibold text-slate-700">{user.address || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Họ và tên</label>
                                        <input type="text" name="fullName" value={profileForm.fullName} onChange={handleProfileChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Số điện thoại</label>
                                        <input type="text" name="phone" value={profileForm.phone} onChange={handleProfileChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Địa chỉ</label>
                                        <input type="text" name="address" value={profileForm.address} onChange={handleProfileChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isEditingProfile ? (
                            <button onClick={() => setIsEditingProfile(true)} className="w-full bg-slate-50 text-slate-600 hover:bg-[#ea580c] hover:text-white border border-slate-200 transition-all font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                Chỉnh sửa hồ sơ
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => { setIsEditingProfile(false); setProfileForm({fullName: user.fullName||'', phone: user.phone||'', address: user.address||''}); }} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 rounded-xl">Hủy</button>
                                <button onClick={submitProfile} className="flex-1 bg-[#ea580c] text-white hover:bg-orange-700 font-bold py-3 rounded-xl shadow-md">Lưu</button>
                            </div>
                        )}

                        <hr className="my-6 border-slate-100" />

                        {/* PHẦN ĐỔI MẬT KHẨU */}
                        {passwordMessage.text && (
                            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {passwordMessage.text}
                            </div>
                        )}

                        {!isChangingPassword ? (
                            <button onClick={() => setIsChangingPassword(true)} className="w-full text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">key</span>
                                Đổi mật khẩu
                            </button>
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-[#ea580c] text-[18px]">lock_reset</span>
                                    Đổi mật khẩu
                                </h3>
                                <div>
                                    <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="Mật khẩu hiện tại" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none" />
                                </div>
                                <div>
                                    <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Mật khẩu mới (từ 6 ký tự)" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none" />
                                </div>
                                <div>
                                    <input type="password" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} placeholder="Xác nhận mật khẩu mới" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => {setIsChangingPassword(false); setPasswordMessage({type:'', text:''});}} className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-2 rounded-lg text-sm">Hủy</button>
                                    <button onClick={submitPassword} className="flex-1 bg-red-600 text-white hover:bg-red-700 font-bold py-2 rounded-lg text-sm shadow-md">Cập nhật MK</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: LỊCH SỬ MUA HÀNG (70%) */}
                <div className="w-full md:w-2/3">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ea580c] text-[28px]">receipt_long</span>
                        Lịch sử đơn hàng
                    </h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
                            <span className="material-symbols-outlined animate-spin text-[40px] text-[#ea580c] mb-4">refresh</span>
                            <span className="text-slate-500 font-medium">Đang tải lịch sử...</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-[48px] text-slate-300">shopping_bag</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Bạn chưa có đơn hàng nào!</h3>
                            <p className="text-slate-500 text-sm mb-6">Hãy dạo quanh cửa hàng và chọn cho mình những sản phẩm ưng ý nhé.</p>
                            <button onClick={() => navigate('/shop')} className="bg-[#ea580c] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-all">
                                Mua sắm ngay
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const statusInfo = getStatusText(order.status);
                                
                                const orderTotal = order.orderDetails.reduce((total, detail) => total + (detail.unitPrice * detail.quantity), 0);

                                return (
                                    <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.08)] transition-all">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-50 mb-4 gap-3">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-slate-800">Đơn hàng #{order.id}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                                        {statusInfo.text}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    {new Date(order.orderDate).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                            
                                            <div className="text-right flex flex-col sm:items-end">
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Tổng tiền</span>
                                                <span className="text-lg font-black text-[#ea580c]">
                                                    {new Intl.NumberFormat('vi-VN').format(orderTotal)}₫
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.orderDetails.map((detail, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                        <img 
                                                            src={detail.product?.imageUrl ? `${process.env.REACT_APP_IMAGE_BASE_URL}${detail.product.imageUrl}` : "https://via.placeholder.com/150"} 
                                                            alt={detail.product?.name || "Sản phẩm"} 
                                                            className="w-full h-full object-cover mix-blend-multiply"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 mb-1">{detail.product?.name || "Sản phẩm không xác định"}</h4>
                                                        <p className="text-xs font-medium text-slate-500">
                                                            {new Intl.NumberFormat('vi-VN').format(detail.unitPrice)}₫ x {detail.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {order.notes && (
                                            <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">edit_note</span>
                                                    Ghi chú của bạn:
                                                </p>
                                                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl italic">"{order.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
