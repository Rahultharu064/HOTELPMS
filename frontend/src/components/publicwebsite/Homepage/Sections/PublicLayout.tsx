import React from "react";
import { MotionConfig } from "framer-motion";
import { Outlet } from "react-router-dom";
import Topbar from "../layout/Topbar";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import BackToTopButton from "../layout/BackToTopButton";

const PublicLayout: React.FC = () => (
  <div
    className="public-site flex min-h-screen flex-col"
    style={{ background: 'var(--color-surface)', color: 'var(--color-ink)' }}
  >
    <MotionConfig reducedMotion="user">
      <Topbar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTopButton />
    </MotionConfig>
  </div>
);

export default PublicLayout;
