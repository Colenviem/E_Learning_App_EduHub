import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { FiEdit, FiSearch } from 'react-icons/fi';
import { apiClient, endpoints } from '../../src/api';
import Spinner from '../spinner/Spinner';

// accounts endpoint centralised in src/api

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.05 } }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const getStatusClasses = (status) => {
  return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
};

const AccountsTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [accountsData, setAccountsData] = useState([]);
    const [editingAccount, setEditingAccount] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Add form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("ADMIN");
    const [errorEmail, setErrorEmail] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // OTP States
    const [otpModal, setOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [emailForOtp, setEmailForOtp] = useState("");

    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [loading, setLoading] = useState(true);
    const roles = ["STUDENT", "TEACHER", "ADMIN"];
    const actions = ["active", "inactive"];

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(endpoints.accounts);
            setAccountsData(res.data);
        } catch (err) {
            console.error("Lỗi khi fetch users:", err);
            window.alert("Lỗi khi load danh sách tài khoản");
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const filteredAccounts = searchQuery.trim() === ""
        ? accountsData
        : accountsData.filter(acc =>
            (acc._id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (acc.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Edit account save
    const handleSave = async () => {
        if (!editingAccount || !editingAccount._id) return;
        try {
            setLoading(true);
            await apiClient.put(`${endpoints.accounts}/${editingAccount._id}`, editingAccount);
            await fetchAccounts();
            setIsModalOpen(false);
            setEditingAccount(null);
            window.alert("Cập nhật thành công");
        } catch (err) {
            console.error("Lỗi khi update account:", err);
            window.alert("Lỗi khi cập nhật tài khoản");
        } finally {
            setLoading(false);
        }
    };

    // Start add flow: validate -> send OTP -> open OTP modal
    const handleAdd = async () => {
        setErrorEmail("");
        setPasswordError("");

        if (!email.trim()) {
            setErrorEmail("Email không được để trống");
            return;
        }

        if (!password.trim()) {
            setPasswordError("Password không được để trống");
            return;
        }

        try {
            setLoading(true);
            // store email to verify later
            setEmailForOtp(email.trim());

            // call backend to send OTP to that email
            await apiClient.post(`${endpoints.accounts}/send-otp`, { email: email.trim() });

            // open OTP modal and close add modal
            setIsModalOpenAdd(false);
            setOtpModal(true);
            setOtp("");
            setOtpError("");
        } catch (err) {
            console.error("Lỗi khi gửi OTP:", err);
            window.alert(err.response?.data?.message || "Lỗi khi gửi OTP");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and create account
    const handleVerifyOtp = async () => {
        setOtpError("");
        if (!otp || otp.trim().length !== 6) {
        setOtpError("Mã OTP phải đủ 6 chữ số");
        return;
        }

        try {
        setLoading(true);

        // 1. verify OTP
        const verifyRes = await apiClient.post(`${endpoints.accounts}/verify-otp`, {
            email: emailForOtp,
            otp: otp.trim()
        });

        if (!verifyRes.data || !verifyRes.data.verified) {
            setOtpError(verifyRes.data?.message || "OTP không hợp lệ");
            return;
        }

        // 2. create account
        const createRes = await apiClient.post(`${endpoints.accounts}/register-admin`, {
            email: emailForOtp,
            password,
            role
        });

        if (createRes.data && createRes.data.success) {
            window.alert("Tạo tài khoản thành công!");
            // refresh list
            await fetchAccounts();

            // reset add form
            setEmail("");
            setPassword("");
            setRole("ADMIN");
            setEmailForOtp("");
            setOtp("");
            setOtpModal(false);
        } else {
            window.alert(createRes.data?.message || "Không thể tạo tài khoản");
        }
        } catch (err) {
            console.error("Lỗi verify OTP / tạo account:", err);
            setOtpError(err.response?.data?.message || "Lỗi trong quá trình xác thực/tạo tài khoản");
        } finally {
            setLoading(false);
        }
    };

    // Optional: resend OTP (cooldown not implemented here)
    const handleResendOtp = async () => {
        if (!emailForOtp) return;
        try {
            setLoading(true);
            await apiClient.post(`${endpoints.accounts}/send-otp`, { email: emailForOtp });
            window.alert("OTP đã được gửi lại");
        } catch (err) {
            console.error("Lỗi resend OTP:", err);
            window.alert("Không thể gửi lại OTP");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner size={12} />;
    }

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
                    <h2 className="text-2xl font-bold text-gray-800">Danh sách tài khoản</h2>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Tìm theo email hoặc ID..."
                            className="flex-1 text-sm border w-80 border-gray-300 rounded-lg py-2 px-3 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="bg-indigo-600 w-24 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            onClick={() => {
                                setSearchQuery("");
                                fetchAccounts();
                        }}
                        >
                            <FiSearch size={16} />
                            {searchQuery ? "Xóa" : "Tìm"}
                        </button>

                        <button
                            className="bg-indigo-600 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            onClick={() => {
                                // open add modal and reset fields
                                setEmail("");
                                setPassword("");
                                setRole("ADMIN");
                                setErrorEmail("");
                                setPasswordError("");
                                setIsModalOpenAdd(true);
                            }}
                        >
                            Thêm tài khoản
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-4">Mã tài khoản</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4 text-center">Role</th>
                            <th className="py-3 px-4 text-center">Trạng thái</th>
                            <th className="py-3 px-4">Ngày tạo</th>
                            <th className="py-3 px-4 text-center">Hành động</th>
                        </tr>
                        </thead>
                        <Motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                        {filteredAccounts.map(acc => (
                                <Motion.tr
                            key={acc._id}
                            variants={rowVariants}
                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                            <td className="py-3 px-4 text-gray-800">{acc._id}</td>
                            <td className="py-3 px-4 text-gray-800">{acc.email}</td>
                            <td className="py-3 px-4 text-center">{acc.role}</td>
                            <td className="py-3 px-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(acc.status)}`}>
                                {acc.status ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(acc.createdAt)}</td>
                            <td className="py-3 px-4 text-center">
                                <button
                                className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                                onClick={() => { setEditingAccount(acc); setIsModalOpen(true); }}
                                >
                                <FiEdit className="w-4 h-4" />
                                </button>
                            </td>
                            </Motion.tr>
                        ))}
                        </Motion.tbody>
                    </table>
                </div>
            </div>

            {/* Modal Edit */}
            {isModalOpen && editingAccount && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Chỉnh sửa tài khoản</h3>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingAccount.email || ""}
                                onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                            />

                            <label className="text-sm font-medium">Role</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingAccount.role || "STUDENT"}
                                onChange={(e) => setEditingAccount({ ...editingAccount, role: e.target.value })}
                            >
                                {roles.map(roleItem => (
                                <option key={roleItem} value={roleItem}>{roleItem}</option>
                                ))}
                            </select>

                            <label className="text-sm font-medium">Trạng thái</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingAccount.status ? "Active" : "Inactive"}
                                onChange={(e) => setEditingAccount({ ...editingAccount, status: e.target.value === "Active" })}
                            >
                                {actions.map(action => (
                                <option key={action} value={action.charAt(0).toUpperCase() + action.slice(1)}>
                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                                onClick={() => { setIsModalOpen(false); setEditingAccount(null); }}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                                onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal add */}
            {isModalOpenAdd && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Thêm tài khoản</h3>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="text-red-500 text-xs">{errorEmail}</span>

                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="text-red-500 text-xs">{passwordError}</span>

                            <label className="text-sm font-medium">Role</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                {roles.map(roleItem => (
                                    <option key={roleItem} value={roleItem}>{roleItem}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                                onClick={() => setIsModalOpenAdd(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                                onClick={handleAdd}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP Modal */}
            {otpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Nhập mã OTP</h3>

                        <p className="text-sm text-gray-600 mb-2">
                            Mã OTP đã gửi đến email: <b>{emailForOtp}</b>
                        </p>

                        <input
                            type="text"
                            maxLength={6}
                            className="border border-gray-300 rounded-lg p-2 w-full text-center tracking-widest text-lg"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <span className="text-red-500 text-xs">{otpError}</span>

                        <div className="mt-6 flex justify-between items-center gap-3">
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer text-sm"
                                    onClick={() => { setOtpModal(false); setOtp(""); }}
                                >
                                    Hủy
                                </button>

                                <button
                                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer text-sm"
                                    onClick={handleResendOtp}
                                >
                                    Gửi lại OTP
                                </button>
                            </div>

                            <button
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                                onClick={handleVerifyOtp}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsTable;