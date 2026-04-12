import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../layout/Topbar";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <Topbar />
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
