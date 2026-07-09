import React from "react";
import { SettingsLayout } from "../../components/Admin/Settings/SettingsLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";

const SettingsPage: React.FC = () => {
  const { adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    window.location.href = "/admin/login";
  };

  return <SettingsLayout userRole="admin" onLogout={handleLogout} />;
};

export default SettingsPage;
