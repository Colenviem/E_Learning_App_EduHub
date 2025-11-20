import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Spinner from '../spinner/Spinner';

const API = "http://localhost:5000/orders";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

function SalesOverviewChart() {
    const [orders, setOrders] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(API);
            setOrders(res.data);
        } catch (err) { 
            console.error("Lỗi khi lấy dữ liệu đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const aggregateByDay = useCallback((orders, monthFilter) => {
        const map = {};
        orders.forEach(order => {
            if (order.status !== "completed") return;
            const dateObj = new Date(order.createdAt);
            const month = dateObj.getMonth() + 1; // 1-12
            if (monthFilter && month !== Number(monthFilter)) return;

            const date = dateObj.toLocaleDateString('vi-VN'); // "dd/mm/yyyy"
            if (!map[date]) map[date] = 0;
            map[date] += order.amount;
        });
        return Object.entries(map)
            .sort((a,b) => new Date(a[0]) - new Date(b[0]))
            .map(([date, sales]) => ({ name: date, sales }));
    }, []);

    const data = useMemo(() => aggregateByDay(orders, selectedMonth), [orders, selectedMonth, aggregateByDay]);

    if (loading) {
        return <Spinner size={12} />;
    }

    return (
        <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Doanh thu theo {selectedMonth ? `tháng ${selectedMonth}` : "tất cả tháng"}
                </h2>
                <select 
                    className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    value={selectedMonth || ""}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">Tất cả tháng</option>
                    {Array.from({length:12}, (_,i) => (
                        <option key={i+1} value={i+1}>Tháng {i+1}</option>
                    ))}
                </select>
            </div>

            <div className="h-72 flex items-center justify-center">
                {data.length === 0 ? (
                    <p className="text-gray-400 text-lg">Không có dữ liệu tháng này</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v)=>v/1000 + "K"} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}/>
                            <Line type="monotone" dataKey="sales" stroke="#4A55FF" strokeWidth={3} dot={false} activeDot={{ r:6, fill:'#fff', stroke:'#4A55FF', strokeWidth:2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}

export default SalesOverviewChart;