import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import AdminLayout from "../components/layout/AdminLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import Promotions from "../pages/promotions/Promotions";
import Packs from "../pages/packs/Packs";
import Orders from "../pages/orders/Orders";
import Admins from "../pages/admins/Admins";
import CreateAdmin from "../pages/admins/CreateAdmin";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import NotFound from "../pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/packs" element={<Packs />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        <Route element={<RoleRoute role="super_admin" />}>
          <Route path="/admins" element={<Admins />} />
          <Route path="/admins/create" element={<CreateAdmin />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
