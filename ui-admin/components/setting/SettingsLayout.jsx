import React, { useState } from 'react';
import { FiUser, FiLock, FiBell, FiGlobe, FiUploadCloud } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const ProfileSettings = ({ user, setUser, handleImageChange, handleSaveProfile }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-6 border-b border-gray-400 pb-3 text-gray-800">Thông tin tài khoản</h3>
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center md:w-1/3">
        <img
          src={user.avatarUrl}
          alt="Avatar"
          className="w-28 h-28 rounded-full border object-cover shadow-sm"
        />
        <label
          htmlFor="avatarUpload"
          className="mt-4 cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition"
        >
          <FiUploadCloud size={18} />
          <span>Đổi ảnh</span>
        </label>
        <input id="avatarUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Họ và tên"
        />
        <input
          type="email"
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium w-36"
          onClick={handleSaveProfile}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  </div>
);

const SecuritySettings = ({ passwords, setPasswords, handleChangePassword }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-6 border-b border-gray-400 pb-3 text-gray-800">Đổi mật khẩu</h3>
    <div className="flex flex-col gap-4 md:w-1/2">
      <input
        type="password"
        placeholder="Mật khẩu hiện tại"
        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={passwords.current}
        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
      />
      <input
        type="password"
        placeholder="Mật khẩu mới"
        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={passwords.new}
        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={passwords.confirm}
        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
      />
      <button
        className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium w-44"
        onClick={handleChangePassword}
      >
        Cập nhật mật khẩu
      </button>
    </div>
  </div>
);

const ToggleSwitch = ({ label, enabled, onChange }) => (
  <label className="flex justify-between items-center cursor-pointer">
    <span className="text-gray-700 font-medium">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={enabled} onChange={onChange} />
      <div className={`w-12 h-6 rounded-full ${enabled ? 'bg-indigo-600' : 'bg-gray-300'} transition-colors`}></div>
      <div className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const NotificationSettings = ({ notifications, handleNotificationChange }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-6 border-b border-gray-400 pb-3 text-gray-800">Cài đặt Thông báo</h3>
    <div className="flex flex-col gap-4 md:w-1/2">
      <ToggleSwitch label="Email" enabled={notifications.email} onChange={() => handleNotificationChange("email")} />
      <ToggleSwitch label="SMS" enabled={notifications.sms} onChange={() => handleNotificationChange("sms")} />
    </div>
  </div>
);

const AppearanceSettings = ({ darkMode, setDarkMode }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-6 border-b border-gray-400 pb-3 text-gray-800">Giao diện & Ngôn ngữ</h3>
    <div className="flex flex-col gap-4 md:w-1/2">
      <ToggleSwitch label="Chế độ tối (Dark Mode)" enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
      <ToggleSwitch label="Ngôn ngữ tiếng Việt" enabled={true} onChange={() => {}} />
    </div>
  </div>
);

const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

const SidebarItem = ({ item, activeTab, setActiveTab }) => {
  const Icon = item.icon;
  const isActive = activeTab === item.id;
  return (
    <motion.div variants={itemVariants}>
      <button
        onClick={() => setActiveTab(item.id)}
        className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-200 w-full
          ${isActive
            ? "bg-indigo-600 text-white font-semibold shadow-md"
            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
          }`}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </button>
    </motion.div>
  );
};

const settingsMenu = [
  { id: 'profile', label: 'Hồ sơ', icon: FiUser, component: ProfileSettings },
  { id: 'security', label: 'Bảo mật', icon: FiLock, component: SecuritySettings },
  { id: 'notifications', label: 'Thông báo', icon: FiBell, component: NotificationSettings },
  { id: 'appearance', label: 'Giao diện', icon: FiGlobe, component: AppearanceSettings },
];

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({ name: "Nguyen Van A", email: "a@gmail.com", avatarUrl: "https://i.ibb.co/L5B7n2t/apple-watch.png" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [darkMode, setDarkMode] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (ev) => setUser({ ...user, avatarUrl: ev.target.result });
      reader.readAsDataURL(file);
    }
  };
  const handleSaveProfile = () => console.log("Saved profile", user);
  const handleChangePassword = () => console.log("Change password", passwords);
  const handleNotificationChange = (type) => setNotifications({ ...notifications, [type]: !notifications[type] });

  const ActiveComponent = settingsMenu.find(item => item.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24 flex justify-center">
      <div className="w-full bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Cài đặt Tài khoản</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <nav className="w-full md:w-64 ">
            <ul className="space-y-2">
              {settingsMenu.map((item) => (
                <SidebarItem key={item.id} item={item} activeTab={activeTab} setActiveTab={setActiveTab} />
              ))}
            </ul>
          </nav>

          <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden shadow-inner">
            {ActiveComponent && <ActiveComponent 
              user={user} setUser={setUser} handleImageChange={handleImageChange} handleSaveProfile={handleSaveProfile}
              passwords={passwords} setPasswords={setPasswords} handleChangePassword={handleChangePassword}
              notifications={notifications} handleNotificationChange={handleNotificationChange}
              darkMode={darkMode} setDarkMode={setDarkMode}
            />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;