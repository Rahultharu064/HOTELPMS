import React, { useRef, useEffect, useState, useCallback } from "react";
import { Star, Quote, MessageSquare, Plus } from "lucide-react";
import { reviewService, type Review } from "../../../../services/reviewService";
import { motion } from "framer-motion";
import { Button } from "../../../ui/Button";
import { SubmitReviewModal } from "./SubmitReviewModal";
import { ApiStatus } from "../../../ui/ApiStatus";
import { SectionHeading } from "../layout/SectionHeading";

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reviewService.getAllReviews({ status: 'approved', limit: 12 });
      if (res.success) {
        setReviews(res.data.reviews);
      }
    } catch (err: any) {
      console.error("Failed to fetch reviews:", err);
      setError(err?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      <SubmitReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Dynamic Background decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-gold/5 rounded-full blur-[130px] -mr-80 -mt-80 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-green/5 rounded-full blur-[130px] -ml-80 -mb-80 opacity-60" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Guest Experiences"
          badgeIcon={MessageSquare}
          title={
            <>
              Voices of <span className="italic text-primary-green">Excellence</span>
            </>
          }
          subtitle="Authentic stories from travelers who chose us — every review reflects the warmth, care, and luxury that define our hospitality."
          accent="green"
        />

        {loading ? (
          <ApiStatus status="loading" skeletonCount={4} skeletonVariant="card" />
        ) : error ? (
          <ApiStatus
            status="error"
            errorMessage={error}
            onRetry={fetchReviews}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.length > 0 ? reviews.map((rev, i) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-[40px] p-8 border border-neutral-border/50 shadow-soft hover:shadow-2xl hover:border-primary-green/10 transition-all duration-700 flex flex-col h-full"
              >
                <div className="mb-6 flex items-center justify-between">
                  <Quote size={28} className="text-primary-green/20" fill="currentColor" />
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        className={idx < rev.rating ? "text-primary-gold fill-primary-gold" : "text-neutral-border"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-neutral-text-secondary text-[14px] leading-relaxed mb-6 font-medium italic opacity-90 flex-1">
                  "{rev.comment || 'A wonderful experience!'}"
                </p>

                {rev.proofImage && (
                  <div className="mb-6 group/img relative overflow-hidden rounded-2xl border border-neutral-border/30">
                    <img 
                      src={rev.proofImage} 
                      alt="Review Proof" 
                      className="w-full h-32 object-cover transition-transform duration-500 group-hover/img:scale-110 cursor-pointer"
                      onClick={() => window.open(rev.proofImage, '_blank')}
                    />
                    <div className="absolute top-2 right-2 bg-primary-dark/80 backdrop-blur-md text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">
                      Click to expand
                    </div>
                    {rev.rating <= 3 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
                        Evidence Provided
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-6 border-t border-neutral-border/30">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-primary-green/10 flex items-center justify-center text-primary-green font-bold text-lg">
                      {rev.guest?.firstName.charAt(0)}{rev.guest?.lastName.charAt(0)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-primary-dark text-sm tracking-tight truncate">
                      {rev.guest?.firstName} {rev.guest?.lastName}
                    </h4>
                    <p className="text-neutral-text-secondary text-[10px] uppercase tracking-widest font-extrabold mt-0.5">
                      {rev.roomType?.name || 'Valued Guest'}
                    </p>
                  </div>
                </div>
              </motion.div>

            )) : (
              <div className="col-span-full">
                <ApiStatus
                  status="empty"
                  emptyTitle="No Reviews Yet"
                  emptyDescription="Be the first to share your experience with us!"
                  emptyEmoji="💬"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-16 text-center">
            <Button 
                onClick={() => setIsModalOpen(true)}
                variant="secondary" 
                className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary-dark/10"
            >
               <Plus className="h-4 w-4 mr-2" /> Share Your Experience
            </Button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
