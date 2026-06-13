import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-surface-container-low dark:bg-inverse-surface w-full border-t border-outline-variant mt-auto">
            <div className="max-w-[1200px] mx-auto px-grid-margin py-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-xl">
                    {/* Column 1 */}
                    <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface mb-md">DigiHome</h3>
                        <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed mb-sm">Hệ thống siêu thị điện máy uy tín hàng đầu Việt Nam. Cam kết hàng chính hãng, giá tốt nhất.</p>
                    </div>
                    {/* Column 2 */}
                    <div>
                        <h4 className="font-label-md text-label-md text-on-surface mb-sm">Về chúng tôi</h4>
                        <ul className="space-y-2">
                            <li><a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none" href="#">About Us</a></li>
                            <li><a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none" href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    {/* Column 3 */}
                    <div>
                        <h4 className="font-label-md text-label-md text-on-surface mb-sm">Chính sách</h4>
                        <ul className="space-y-2">
                            <li><a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none" href="#">Privacy Policy</a></li>
                            <li><a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none" href="#">Terms of Service</a></li>
                            <li><a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none" href="#">Shipping Info</a></li>
                            <li><a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none" href="#">Warranty Policy</a></li>
                        </ul>
                    </div>
                    {/* Column 4 */}
                    <div>
                        <h4 className="font-label-md text-label-md text-on-surface mb-sm">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-2">
                            <li className="font-label-sm text-label-sm text-on-surface-variant">Hotline: 1800 1234 (Miễn phí)</li>
                            <li className="font-label-sm text-label-sm text-on-surface-variant">Email: cskh@digihome.vn</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-xl pt-lg border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-sm">
                    <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed">© 2026 DigiHome Electronics. Sinh viên: Lê Quang Phúc.</p>
                    <div className="flex items-center gap-md text-on-surface-variant">
                        <span className="font-label-sm text-label-sm font-bold border px-2 py-1 rounded">VISA</span>
                        <span className="font-label-sm text-label-sm font-bold border px-2 py-1 rounded">MasterCard</span>
                        <span className="font-label-sm text-label-sm font-bold border px-2 py-1 rounded">MoMo</span>
                        <span className="font-label-sm text-label-sm font-bold border px-2 py-1 rounded">ZaloPay</span>
                        <span className="font-label-sm text-label-sm font-bold border px-2 py-1 rounded">COD</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;