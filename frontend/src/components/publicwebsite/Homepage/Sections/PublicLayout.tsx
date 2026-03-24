import React from "react";
import Topbar from "../layout/Topbar";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

interface Props {
  children: React.ReactNode;
}

const PublicLayout: React.FC<Props> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-white">
    <Topbar />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default PublicLayout;
