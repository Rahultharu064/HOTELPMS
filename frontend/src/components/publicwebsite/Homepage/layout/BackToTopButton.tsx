import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-dark text-primary-gold shadow-[0_8px_24px_rgba(20,83,45,0.28)] border border-primary-green/20 transition-all duration-300 outline-none hover:bg-primary-green hover:text-white hover:shadow-[0_12px_32px_rgba(31,122,58,0.35)] hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-gold/50 focus-visible:ring-offset-2 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
};

export default BackToTopButton;
