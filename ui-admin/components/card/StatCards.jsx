import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiClock } from 'react-icons/fi';
import axios from 'axios';
import Spinner from '../spinner/Spinner';

const API = "http://localhost:5000/orders";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.1, staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function StatCards() {
    const [orders, setOrders] = useState([]);
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

    // Tính toán dữ liệu
    const totalUsers = new Set(orders.map(o => o.userId)).size;
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
    const totalPending = orders.filter(o => o.status !== "completed").length;

    const statData = [
        { title: "Tổng số người dùng", value: totalUsers, icon: <FiUsers className="w-6 h-6" />, color: "bg-indigo-500", change: "+ người dùng", changeColor: "text-green-500", changeIcon: "▲" },
        { title: "Tổng số hóa đơn", value: totalOrders, icon: <FiShoppingBag className="w-6 h-6" />, color: "bg-yellow-500", change: "+ đơn hàng", changeColor: "text-green-500", changeIcon: "▲" },
        { title: "Tổng doanh thu", value: totalSales, prefix: "₫", icon: <FiTrendingUp className="w-6 h-6" />, color: "bg-green-500", change: "- tổng doanh thu", changeColor: "text-red-500", changeIcon: "▼" },
        { title: "Tổng số đang chờ xử lý", value: totalPending, icon: <FiClock className="w-6 h-6" />, color: "bg-red-500", change: "+ chờ xử lý", changeColor: "text-green-500", changeIcon: "▲" },
    ];

    if (loading) {
        return <Spinner size={12} />;
    }

    return (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {statData.map((card, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} transition={{ type: "spring", stiffness: 300 }} className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 cursor-pointer">
            <div className="flex items-center justify-between">
                <div>
                <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                <p className="text-3xl font-extrabold mt-1 text-gray-900">
                    {card.prefix}{<CountUp end={card.value} duration={1.8} separator="," />}
                </p>
                </div>
                <div className={`p-3 rounded-xl ${card.color} text-white text-xl shadow-lg bg-opacity-90`}>
                {card.icon}
                </div>
            </div>
            <p className={`text-sm mt-3 font-semibold flex items-center gap-1 ${card.changeColor}`}>
                <span className="font-bold">{card.changeIcon}</span>
                {card.change}
            </p>
            </motion.div>
        ))}
        </motion.div>
    );
}

export default StatCards;