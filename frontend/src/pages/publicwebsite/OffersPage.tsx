import { Button } from "../../components/ui/Button";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";

const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay / 1000 }}
    className={className}
  >
    {children}
  </motion.div>
);
const offers = [
  { title: "Early Bird Special", discount: "20% OFF", desc: "Book 30 days in advance and save on any room category.", badge: "Popular" },
  { title: "Weekend Getaway", discount: "15% OFF", desc: "Enjoy Friday to Sunday stays with complimentary breakfast.", badge: "Limited" },
  { title: "Honeymoon Package", discount: "25% OFF", desc: "Suite upgrade, spa treatment, and romantic dinner included.", badge: "Exclusive" },
];

const OffersSection = () => (
  <section className="py-20">
    <div className="container">
      <ScrollReveal className="text-center mb-12">
        <h2 className="text-h2 text-foreground mb-2">Special Offers</h2>
        <p className="text-muted-foreground">Exclusive deals for an unforgettable experience</p>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-8">
        {offers.map((o, i) => (
          <ScrollReveal key={o.title} delay={i * 100}>
            <div className="relative rounded-xl border bg-background p-6 card-hover overflow-hidden">
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {o.badge}
              </span>
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Tag className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-primary mb-1">{o.discount}</p>
              <h3 className="font-semibold mb-2">{o.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{o.desc}</p>
              <Button size="sm" variant="outline">Learn More</Button>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default OffersSection;
