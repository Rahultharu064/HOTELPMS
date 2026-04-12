import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactUsPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Contact form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
    reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    { icon: FaMapMarkerAlt, title: 'Visit Us', details: 'Itahari, Sunsari, Nepal', color: 'text-primary-green' },
    { icon: FaPhone, title: 'Call Us', details: '+977 98567 12345', link: 'tel:+9779856712345', color: 'text-primary-gold' },
    { icon: FaEnvelope, title: 'Email Us', details: 'info@itaharinamuna.edu.np', link: 'mailto:info@itaharinamuna.edu.np', color: 'text-primary-orange' },
    { icon: FaClock, title: 'Office Hours', details: '24/7 Customer Support', color: 'text-blue-500' },
  ];

  return (
    <main>
      {/* Header Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary-dark to-primary-green">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg">We'd love to hear from you. Get in touch with us today!</p>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Your Name"
                    placeholder="John Doe"
                    {...register('name', { required: 'Name is required' })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={errors.email?.message}
                  />
                </div>
                
                <Input
                  label="Subject"
                  placeholder="How can we help you?"
                  {...register('subject', { required: 'Subject is required' })}
                  error={errors.subject?.message}
                />
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-error">{errors.message.message}</p>
                  )}
                </div>
                
                <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Contact Information */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`${info.color} text-2xl`}>
                      <info.icon />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-neutral-text-secondary hover:text-primary-green transition">
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-neutral-text-secondary">{info.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-light flex items-center justify-center text-primary-green hover:bg-primary-green hover:text-white transition-all">
                  <FaFacebook />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-light flex items-center justify-center text-primary-green hover:bg-primary-green hover:text-white transition-all">
                  <FaInstagram />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-light flex items-center justify-center text-primary-green hover:bg-primary-green hover:text-white transition-all">
                  <FaTwitter />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113267.63921128722!2d87.21298475!3d26.6661668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6e2a9f3a4b9b%3A0x8b3a5c9f2e1d7a4c!2sItahari%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </main>
  );
};