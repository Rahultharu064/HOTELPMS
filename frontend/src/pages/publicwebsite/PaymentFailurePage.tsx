import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PaymentFailurePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-neutral-light flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-neutral-border"
      >
        <div className="h-24 w-24 rounded-[32px] bg-red-500 text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/30">
          <XCircle className="h-12 w-12" strokeWidth={4} />
        </div>
        <h1 className="text-4xl font-black text-primary-dark tracking-tighter mb-4">Payment Failed</h1>
        <p className="text-neutral-text-secondary font-medium mb-10 leading-relaxed">
          We couldn't process your payment. Your reservation is currently on hold. Please try again or choose a different payment method.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">
            <Link to="/rooms"><RefreshCw className="mr-2 h-4 w-4" /> Try Booking Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-neutral-border">
            <Link to="/"><Home className="mr-2 h-4 w-4" /> Return Home</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
};
