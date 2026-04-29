import React, { useState } from "react";
import { X, Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../ui/Button";
import { reviewService } from "../../../../services/reviewService";

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For now, using a placeholder guestId. In a real app, this would come from auth context.
      const res = await reviewService.createReview({
        guestId: 1, // Placeholder
        rating,
        comment,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setComment("");
          setRating(5);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="absolute top-6 right-6">
              <button onClick={onClose} className="p-2 hover:bg-neutral-light rounded-full transition-colors">
                <X className="h-6 w-6 text-neutral-text-secondary" />
              </button>
            </div>

            <div className="p-10">
              {success ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="h-10 w-10 text-primary-green" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-primary-dark mb-2">Thank You!</h3>
                  <p className="text-neutral-text-secondary">Your review has been submitted and is pending approval.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-3xl font-black text-primary-dark tracking-tight mb-2">Share Your <span className="text-primary-green">Experience</span></h3>
                    <p className="text-neutral-text-secondary font-medium">Your feedback helps us provide even better service to our guests.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-primary-dark mb-4">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(s)}
                            className="transition-transform active:scale-90"
                          >
                            <Star
                              className={`h-10 w-10 transition-colors ${
                                s <= (hoverRating || rating)
                                  ? "text-primary-gold fill-primary-gold"
                                  : "text-neutral-border"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-primary-dark mb-3">Your Feedback</label>
                      <textarea
                        required
                        placeholder="Tell us about your stay..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-32 bg-neutral-light/50 border border-neutral-border/50 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green outline-none transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-green/20"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5 mr-2" /> Submit Review</>}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
