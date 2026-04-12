import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, Home, Calendar } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    const pidx = searchParams.get('pidx');
    const transactionId = searchParams.get('transaction_id');
    const purchaseOrderId = searchParams.get('purchase_order_id');

    if (data) {
      verifyEsewa(data);
    } else if (pidx) {
      verifyKhaltiUser(pidx, transactionId || undefined, purchaseOrderId || undefined);
    } else {
      setVerifying(false);
      setSuccess(true); // Fallback for simulation or other methods
    }
  }, [searchParams]);

  const verifyKhaltiUser = async (pidx: string, transaction_id?: string, purchase_order_id?: string) => {
    try {
      const res = await paymentService.verifyKhalti({ pidx, transaction_id, purchase_order_id });
      if (res.success) {
        setSuccess(true);
        toast.success("Khalti Payment verified successfully!");
      } else {
        setSuccess(false);
        toast.error("Khalti payment verification failed.");
      }
    } catch (error) {
      console.error(error);
      setSuccess(false);
      toast.error("Error verifying Khalti payment.");
    } finally {
      setVerifying(false);
    }
  };

  const verifyEsewa = async (encodedData: string) => {
    try {
      const res = await paymentService.verifyEsewa(encodedData);
      if (res.success) {
        setSuccess(true);
        toast.success("Payment verified successfully!");
      } else {
        setSuccess(false);
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      console.error(error);
      setSuccess(false);
      toast.error("Error verifying payment.");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-neutral-light">
        <Loader2 className="h-12 w-12 text-primary-green animate-spin" />
        <div className="text-center">
          <h2 className="text-2xl font-black text-primary-dark">Verifying Your Payment</h2>
          <p className="text-neutral-text-secondary font-medium mt-2">Connecting with financial gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-light flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-neutral-border"
      >
        {success ? (
          <>
            <div className="h-24 w-24 rounded-[32px] bg-primary-green text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-green/30">
              <Check className="h-12 w-12" strokeWidth={4} />
            </div>
            <h1 className="text-4xl font-black text-primary-dark tracking-tighter mb-4">Payment Success!</h1>
            <p className="text-neutral-text-secondary font-medium mb-10 leading-relaxed">
              Your reservation is now fully confirmed. We've sent a detailed confirmation email and receipt to your inbox.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">
                <Link to="/"><Home className="mr-2 h-4 w-4" /> Return Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-neutral-border">
                <Link to="/rooms"><Calendar className="mr-2 h-4 w-4" /> Book Another Room</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="h-24 w-24 rounded-[32px] bg-red-500 text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/30">
              <span className="text-4xl font-bold">!</span>
            </div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tighter mb-4">Verification Error</h1>
            <p className="text-neutral-text-secondary font-medium mb-10 leading-relaxed">
              We encountered an issue confirming your payment securely. Please contact our support if money was unexpectedly deducted from your account.
            </p>
            <Button asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </>
        )}
      </motion.div>
    </main>
  );
};
