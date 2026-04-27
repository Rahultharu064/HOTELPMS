import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const sizeClasses = {
  sm:   'max-w-md',
  md:   'max-w-2xl',
  lg:   'max-w-4xl',
  xl:   'max-w-6xl',
  '2xl':'max-w-7xl',
  full: 'max-w-full',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'sm',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── 
              Offsets: Sidebar (280px), Header (96px)
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 lg:left-[280px] lg:top-[96px] bg-black/40 backdrop-blur-[2px] z-[200]"
          />

          {/* ── Dialog wrapper ── 
              p-8 ensures a consistent margin on all sides (including bottom) 
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 lg:left-[280px] lg:top-[96px] z-[201] flex items-center justify-center p-8 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className={`pointer-events-auto bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] w-full ${sizeClasses[size]} flex flex-col overflow-hidden border border-gray-100`}
              style={{ maxHeight: 'calc(100vh - 96px - 64px)' }} // 96px (header) + 64px (p-8 * 2 for top/bottom margins)
            >
              {/* Header */}
              <div className="bg-white border-b border-gray-100/80 px-6 py-3.5 flex justify-between items-center shrink-0">
                {title && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-[3px] h-4 bg-[#14532D] rounded-full" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#111827]">
                      {title}
                    </h3>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 hover:bg-[#111827] hover:text-white flex items-center justify-center transition-all duration-300 ml-auto"
                >
                  <FaTimes size={10} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};