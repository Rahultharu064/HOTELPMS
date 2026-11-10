import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PaymentFailurePage: React.FC = () => {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-neutral-light p-4 py-8 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-neutral-border bg-white p-5 text-center shadow-lg sm:rounded-3xl sm:p-8"
      >
        <div className="h-24 w-24 rounded-[32px] bg-red-500 text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/30">
          <XCircle className="h-12 w-12" strokeWidth={4} />
        </div>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-primary-dark sm:text-4xl">Payment not completed</h1>
        <p className="mb-8 leading-relaxed text-neutral-text-secondary sm:mb-10">
          We couldn't process your payment. Your reservation is currently on hold. Please try again or choose a different payment method.
        </p>
        <div className="space-y-4">
          <Button asChild className="h-12 w-full rounded-lg font-semibold">
            <Link to="/rooms"><RefreshCw className="mr-2 h-4 w-4" /> Try Booking Again</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 w-full rounded-lg font-semibold border-neutral-border">
            <Link to="/"><Home className="mr-2 h-4 w-4" /> Return Home</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
};
