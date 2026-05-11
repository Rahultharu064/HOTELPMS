import React, { useState } from "react";
import { X, Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../ui/Button";
import { reviewService } from "../../../../services/reviewService";
import { Input } from "../../../ui/Input";

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('guestId', '1'); // Placeholder
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      if (proofImage) {
        formData.append('proofImage', proofImage);
      }

      const res = await reviewService.createReview(formData);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setComment("");
          setRating(5);
          setProofImage(null);
          setProofPreview(null);
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
            className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-6 right-6">
              <Button onClick={onClose} variant="outline" size="icon" className="rounded-full">
                <X className="h-6 w-6 text-neutral-text-secondary" />
              </Button>
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
                          <Button
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
                          </Button>
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

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-primary-dark mb-3">
                        {rating <= 3 ? "Upload Proof (Highly Recommended)" : "Upload Proof (Optional)"}
                      </label>
                      <div className="relative group">
                        <Input
                          type="file"
                          variant="outline"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all ${proofPreview ? 'border-primary-green bg-primary-green/5' : 'border-neutral-border group-hover:border-primary-green/50'}`}>
                          {proofPreview ? (
                            <div className="relative inline-block">
                              <img src={proofPreview} alt="Preview" className="h-32 w-auto rounded-xl shadow-md" />
                              <div className="absolute -top-2 -right-2 bg-primary-green text-white rounded-full p-1 shadow-lg">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-12 h-12 bg-neutral-light rounded-full flex items-center justify-center mx-auto">
                                <Star className="h-6 w-6 text-neutral-text-secondary" />
                              </div>
                              <p className="text-sm font-bold text-primary-dark">Click or drag image to upload proof</p>
                              <p className="text-xs text-neutral-text-secondary">Supports JPG, PNG, WEBP</p>
                            </div>
                          )}
                        </div>
                      </div>
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
