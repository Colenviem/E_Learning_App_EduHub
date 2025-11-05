import { Routes, Route, Navigate } from "react-router-dom";

import DashboardSidebar from "../components/sidebar/DashboardSidebar";
import DashboardHeader from "../components/layout/DashboardHeader";

import Dashboard from "../components/dashboard/Dashboard";
import UsersTable from "../components/table/UsersTable";
import AccountsTable from "../components/table/AccountsTable";
import CoursesTable from "../components/table/CoursesTable";
import LessonsTable from "../components/table/LessonsTable";
import CategoriesTable from "../components/table/CategoriesTable";
import OrdersTable from "../components/table/OrdersTable";
import SettingsLayout from "../components/setting/SettingsLayout";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen font-[Manrope]">
      <DashboardSidebar />

      <main className="flex-1 relative overflow-y-auto">
        <DashboardHeader />

        <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/users" element={<UsersTable/>} />
            <Route path="/accounts" element={<AccountsTable/>} />
            <Route path="/courses" element={<CoursesTable/>} />
            <Route path="/lessons" element={<LessonsTable/>} />
            <Route path="/categories" element={<CategoriesTable/>} />
            <Route path="/orders" element={<OrdersTable/>} />
            <Route path="/setting" element={<SettingsLayout/>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;