import React, { useEffect, useState, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { apiClient, endpoints } from '../../src/api';
import Spinner from '../spinner/Spinner';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.08 } },
};

const rowVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

const getStatusClasses = (status) => {
    switch (status) {
        case "completed": return "bg-green-100 text-green-700";
        case "pending": return "bg-yellow-100 text-yellow-700";
        case "canceled": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
    }
};

function RecentDealsTable() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(endpoints.orders);
            setOrders(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    console.log("Recent Orders:", orders);

    if (loading) {
        return <Spinner size={12} />;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Đơn hàng gần đây
                </h2>
            </div>

            <table className="min-w-full text-sm text-left border-collapse">
                <thead className="text-gray-500 uppercase text-xs border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-4">Mã đơn hàng</th>
                        <th className="py-3 px-4">Khóa học</th>
                        <th className="py-3 px-4">User ID</th>
                        <th className="py-3 px-4">Ngày</th>
                        <th className="py-3 px-4">Số tiền</th>
                        <th className="py-3 px-4 text-center">Trạng thái</th>
                    </tr>
                </thead>

                <Motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                    {orders.slice(0, 4).map((order) => (
                        <Motion.tr
                            key={order._id}
                            variants={rowVariants}
                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-3 px-4 text-gray-800">{order._id}</td>
                            <td className="py-3 px-4 font-medium text-gray-800">{order.courseId}</td>
                            <td className="py-3 px-4 text-gray-600">{order.userId}</td>
                            <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                                {new Date(order.createdAt).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-bold text-gray-800">
                                {order.amount.toLocaleString()} VND
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusClasses(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                        </Motion.tr>
                    ))}
                </Motion.tbody>
            </table>
        </div>
    );
}

export default RecentDealsTable;