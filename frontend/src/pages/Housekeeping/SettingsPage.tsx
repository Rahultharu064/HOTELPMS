import React from "react";
import { SettingsLayout } from "../../components/Admin/Settings/SettingsLayout";
import { useAuth } from "../../context/AuthContext";

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/housekeeping/login";
  };

  return <SettingsLayout userRole="housekeeping" onLogout={handleLogout} />;
};

export default SettingsPage;
