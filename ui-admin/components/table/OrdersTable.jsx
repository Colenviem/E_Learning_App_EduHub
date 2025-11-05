import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiSearch } from 'react-icons/fi';

const ordersInitial = [
  {
    _id: "order801",
    userId: "user123",
    courseId: "course1",
    amount: 500000,
    paymentMethod: "momo",
    status: "completed",
    createdAt: "2024-12-31T23:59:59Z"
  },
  {
    _id: "order802",
    userId: "user124",
    courseId: "course2",
    amount: 300000,
    paymentMethod: "credit_card",
    status: "pending",
    createdAt: "2024-12-25T10:00:00Z"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.05 } }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const statusClasses = (status) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700";
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "cancelled": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });

const OrdersTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState(ordersInitial);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    setOrders(orders.map(o => o._id === editingOrder._id ? editingOrder : o));
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 pt-24 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-lg">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách đơn hàng</h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Tìm theo Order ID hoặc User ID..."
              className="flex-1 text-sm border w-80 border-gray-300 rounded-lg py-2 px-3 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-indigo-600 w-24 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <FiSearch size={16} /> Tìm
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Course ID</th>
                <th className="py-3 px-4">Số tiền</th>
                <th className="py-3 px-4">Phương thức</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {filteredOrders.map(order => (
                <motion.tr key={order._id} variants={rowVariants} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.userId}</td>
                  <td className="py-3 px-4">{order.courseId}</td>
                  <td className="py-3 px-4">{order.amount.toLocaleString()}₫</td>
                  <td className="py-3 px-4">{order.paymentMethod}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                      onClick={() => { setEditingOrder(order); setIsModalOpen(true); }}
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit */}
      {isModalOpen && editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4 text-center">Chỉnh sửa đơn hàng</h3>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                className="border border-gray-300 rounded-lg p-2 text-sm"
                value={editingOrder.status}
                onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default OrdersTable;