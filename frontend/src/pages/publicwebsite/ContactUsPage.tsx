import React, { useState } from "react";
import PublicLayout from "../../components/publicwebsite/Homepage/Sections/PublicLayout";
import PageHero from "../../components/publicwebsite/Homepage/layout/PageHero";
import Button from "../../components/ui/Button";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Globe } from "lucide-react";

const CONTACT_INFO = [
  { icon: MapPin, label: "Visit Us", value: "Itahari-6, Sunsari, Koshi Province, Nepal", color: "#1F7A3A" },
  { icon: Phone, label: "Call Us", value: "+977 025 123456", color: "#F59E0B" },
  { icon: Mail, label: "Email Us", value: "info@itaharinamuna.edu.np", color: "#1F7A3A" },
  { icon: Clock, label: "Reception", value: "Open 24/7, 365 Days", color: "#F59E0B" },
];

const ContactUsPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <PublicLayout>
      <PageHero
        title="Get In"
        highlight="Touch"
        subtitle="Have a question or want to make a reservation? We'd love to hear from you. Our team is ready to assist."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact Us" }]}
        bgImage="/hero3.png"
      />

      {/* Contact Cards */}
      <section className="bg-white relative -mt-12 z-20">
        <div className="site-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_INFO.map((c, i) => (
              <div key={i} className="bg-white rounded-[28px] p-7 border border-gray-100/80 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ backgroundColor: `${c.color}08`, color: c.color }}>
                  <c.icon size={22} strokeWidth={1.8} />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">{c.label}</p>
                <p className="text-[#111827] text-sm font-bold leading-relaxed">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section-py-lg bg-white">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">Send a Message</span>
              <h2 className="text-3xl font-extrabold text-[#111827] mb-4 leading-tight tracking-tight">
                We'd Love to <span className="text-[#1F7A3A]">Hear From You</span>
              </h2>
              <div className="h-1.5 w-16 bg-[#F59E0B] rounded-full mb-8" />
              <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2 block">Full Name</label>
                    <input
                      name="name" value={form.name} onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium text-[#111827] placeholder-gray-300 outline-none focus:border-[#1F7A3A] focus:ring-1 focus:ring-[#1F7A3A]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2 block">Email</label>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium text-[#111827] placeholder-gray-300 outline-none focus:border-[#1F7A3A] focus:ring-1 focus:ring-[#1F7A3A]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2 block">Phone</label>
                    <input
                      name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium text-[#111827] placeholder-gray-300 outline-none focus:border-[#1F7A3A] focus:ring-1 focus:ring-[#1F7A3A]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2 block">Subject</label>
                    <select
                      name="subject" value={form.subject} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium text-[#111827] outline-none focus:border-[#1F7A3A] focus:ring-1 focus:ring-[#1F7A3A]/20 transition-all cursor-pointer"
                    >
                      <option value="">Select a topic</option>
                      <option value="reservation">Room Reservation</option>
                      <option value="inquiry">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2 block">Message</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium text-[#111827] placeholder-gray-300 outline-none focus:border-[#1F7A3A] focus:ring-1 focus:ring-[#1F7A3A]/20 transition-all resize-none"
                  />
                </div>

                <Button size="lg" className="w-full rounded-2xl text-[12px] font-black uppercase tracking-widest gap-3">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map & Quick Links */}
            <div>
              <div className="rounded-[32px] overflow-hidden aspect-[4/3] mb-8 bg-gray-100 border border-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.3!2d87.27!3d26.66!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDM5JzM2LjAiTiA4N8KwMTYnMTIuMCJF!5e0!3m2!1sen!2snp!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Hotel Location"
                />
              </div>

              <div className="bg-gradient-to-r from-[#0C2012] to-[#14532D] rounded-[32px] p-10">
                <h3 className="text-xl font-bold text-white mb-6">Quick Connect</h3>
                <div className="space-y-5">
                  <a href="tel:+977025123456" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#F59E0B] group-hover:text-[#14532D] transition-all">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Phone</p>
                      <p className="text-sm font-bold">+977 025 123456</p>
                    </div>
                  </a>
                  <a href="mailto:info@itaharinamuna.edu.np" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#F59E0B] group-hover:text-[#14532D] transition-all">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email</p>
                      <p className="text-sm font-bold">info@itaharinamuna.edu.np</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#F59E0B] group-hover:text-[#14532D] transition-all">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Live Chat</p>
                      <p className="text-sm font-bold">Available 24/7</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#F59E0B] group-hover:text-[#14532D] transition-all">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Website</p>
                      <p className="text-sm font-bold">www.itaharinamuna.edu.np</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactUsPage;
