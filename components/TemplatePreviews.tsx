'use client';

import React, { useState } from 'react';
import { 
  Phone, Mail, MessageSquare, UserPlus, MapPin, Clock, 
  Wifi, Copy, Check, ChevronRight, Share2, Plus, Minus, ShoppingBag 
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  BusinessCardData, RestaurantMenuData, EventCardData, 
  LinkCardData, WiFiCardData, ProductCatalogData 
} from '@/lib/templates';
import { submitRsvpAction } from '@/app/actions/card-actions';

// vCard (vcf) download generator for business card
const downloadVCard = (data: BusinessCardData) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${data.name.split(' ').reverse().join(';')}
FN:${data.name}
ORG:${data.position}
TEL;TYPE=CELL:${data.phone}
EMAIL;TYPE=PREF,INTERNET:${data.email}
NOTE:${data.bio}
END:VCARD`;
  
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${data.name.replace(/\s+/g, '_')}.vcf`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

// -------------------------------------------------------------
// 1. BUSINESS PREVIEW
// -------------------------------------------------------------
export function BusinessPreview({ data }: { data: BusinessCardData }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Sleek top drag handler bar */}
      <div className="w-full flex justify-center py-3">
        <div className="w-10 h-1.5 bg-[#E4E4E7] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-6 pb-8 flex flex-col items-center overflow-y-auto no-scrollbar w-full"
      >
        {/* Avatar Image */}
        <motion.div 
          variants={itemVariants}
          className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-md mb-4 bg-muted-bg"
        >
          {data.photo ? (
            <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent text-white text-3xl font-bold">
              {data.name ? data.name.charAt(0) : '?'}
            </div>
          )}
        </motion.div>

        {/* Identity */}
        <motion.h1 
          variants={itemVariants}
          className="text-xl font-bold text-primary text-center tracking-tight"
        >
          {data.name || 'Your Name'}
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-xs text-muted-text font-medium text-center mt-1"
        >
          {data.position || 'Your Position'}
        </motion.p>
        
        {/* Bio */}
        {data.bio && (
          <motion.p 
            variants={itemVariants}
            className="text-xs text-primary/80 text-center leading-relaxed mt-4 bg-muted-bg/50 px-4 py-3 rounded-2xl premium-border w-full"
          >
            {data.bio}
          </motion.p>
        )}

        {/* Native Actions Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-4 gap-3 w-full mt-6"
        >
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            href={data.phone ? `tel:${data.phone}` : '#'}
            className="flex flex-col items-center gap-1.5 p-2 bg-muted-bg/80 hover:bg-muted-bg rounded-xl transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-semibold text-primary">Call</span>
          </motion.a>
          
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            href={data.email ? `mailto:${data.email}` : '#'}
            className="flex flex-col items-center gap-1.5 p-2 bg-muted-bg/80 hover:bg-muted-bg rounded-xl transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-semibold text-primary">Email</span>
          </motion.a>

          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            href={data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\+/g, '')}` : '#'}
            className="flex flex-col items-center gap-1.5 p-2 bg-muted-bg/80 hover:bg-muted-bg rounded-xl transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-semibold text-primary">WhatsApp</span>
          </motion.a>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadVCard(data)}
            className="flex flex-col items-center gap-1.5 p-2 bg-muted-bg/80 hover:bg-muted-bg rounded-xl transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white">
              <UserPlus className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-semibold text-primary">Save</span>
          </motion.button>
        </motion.div>

        {/* Social Links List */}
        {data.socials && data.socials.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="w-full flex flex-col gap-2.5 mt-8 border-t border-black/5 pt-6"
          >
            <h3 className="text-[10px] font-bold tracking-wider text-muted-text uppercase mb-1">Social Networks</h3>
            <div className="flex flex-col gap-2">
              {data.socials.map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 px-4 rounded-xl border border-black/5 bg-white hover:bg-muted-bg/30 flex items-center justify-between transition-all"
                >
                  <span className="text-xs font-semibold text-primary">{social.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-text" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Card share link at bottom */}
        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="mt-8 flex items-center gap-1.5 text-[11px] font-bold text-muted-text hover:text-primary transition-all cursor-pointer border-0 bg-transparent"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? 'Link Copied' : 'Share Card'}
        </motion.button>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. RESTAURANT MENU PREVIEW
// -------------------------------------------------------------
export function MenuPreview({ data }: { data: RestaurantMenuData }) {
  const [activeCategory, setActiveCategory] = useState(data.categories?.[0]?.id || '');
  const currency = data.currency || '$';

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#FAFAFA] relative overflow-hidden">
      {/* Cover Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-36 bg-[#E4E4E7] overflow-hidden shrink-0"
      >
        {data.coverImage && (
          <img src={data.coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Sleek drag bar on top of image */}
        <div className="absolute top-3 w-full flex justify-center z-30">
          <div className="w-10 h-1 bg-white/60 rounded-full" />
        </div>
      </motion.div>

      {/* Brand Logo & Info Overlap */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 22 }}
        className="relative px-5 -mt-8 mb-4 flex items-end gap-3 z-10 shrink-0"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white flex-shrink-0">
          {data.logo ? (
            <img src={data.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary text-white flex items-center justify-center font-bold">
              Menu
            </div>
          )}
        </div>
        <div className="flex-1 pb-1">
          <h1 className="text-base font-bold text-white tracking-tight drop-shadow-md truncate">{data.restaurantName || 'Restaurant Name'}</h1>
          <p className="text-[10px] text-muted-text font-medium truncate mt-0.5">{data.description || 'Description'}</p>
        </div>
      </motion.div>

      {/* Categories Horizontal Scroll */}
      <div className="w-full px-5 py-2 overflow-x-auto no-scrollbar flex gap-2 border-b border-black/5 bg-white shrink-0">
        {data.categories?.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            className={`h-7 px-3.5 text-[10px] font-bold rounded-full transition-all shrink-0 cursor-pointer ${
              activeCategory === cat.id 
                ? 'bg-primary text-white border-0' 
                : 'bg-[#F4F4F5] hover:bg-[#E4E4E7] text-primary/80 border-0'
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Menu List */}
      <div className="flex-1 px-5 py-4 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            className="flex flex-col gap-3.5"
          >
            {data.categories
              ?.find((cat) => cat.id === activeCategory)
              ?.items.map((item) => (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="p-3 bg-white rounded-xl border border-black/5 flex gap-3 transition-all"
                >
                  {item.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F4F4F5] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-primary tracking-tight leading-tight pr-2">{item.name}</h4>
                        <span className="text-xs font-bold text-primary shrink-0">{currency}{item.price}</span>
                      </div>
                      <p className="text-[10px] text-muted-text mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 mt-2.5 flex-wrap">
                        {item.tags.map(tag => (
                          <span 
                            key={tag} 
                            className={`text-[8px] font-extrabold tracking-wide px-1.5 py-0.5 rounded-sm uppercase ${
                              tag === 'recommended' 
                                ? 'bg-[#FEF3C7] text-[#D97706]' 
                                : tag === 'spicy'
                                ? 'bg-[#FEE2E2] text-[#DC2626]'
                                : 'bg-emerald-50 text-success'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. EVENT CARD PREVIEW
// -------------------------------------------------------------
export function EventPreview({ data, slug = '' }: { data: EventCardData; slug?: string }) {
  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', guests: 1 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name || !rsvpForm.email) return;

    setLoading(true);
    setErrorMsg('');
    try {
      if (!slug) {
        setTimeout(() => {
          setSubmitted(true);
          setLoading(false);
        }, 1000);
        return;
      }

      const res = await submitRsvpAction(slug, rsvpForm);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit RSVP');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCalendarDate = () => {
    try {
      const parts = data.date.split(' ');
      if (parts.length >= 2) {
        const month = parts[0].substring(0, 3).toUpperCase();
        const day = parts[1].replace(',', '');
        return { month, day };
      }
    } catch (e) {}
    return { month: 'JUL', day: '24' };
  };

  const { month, day } = getCalendarDate();

  return (
    <div className="w-full flex-1 flex flex-col bg-white overflow-y-auto no-scrollbar">
      {/* Cover Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-40 bg-[#E4E4E7] overflow-hidden shrink-0"
      >
        {data.banner && (
          <img src={data.banner} alt={data.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Sleek top drag handler bar */}
        <div className="absolute top-3 w-full flex justify-center z-30">
          <div className="w-10 h-1 bg-white/60 rounded-full" />
        </div>
      </motion.div>

      <div className="flex-1 px-5 pb-8 -mt-6 relative z-10 flex flex-col">
        {/* Header Block with Calendar Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-xs"
        >
          {/* Calendar Badge */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }}
            className="w-12 h-14 bg-muted-bg rounded-xl border border-black/5 overflow-hidden flex flex-col items-center justify-between shadow-xs shrink-0"
          >
            <div className="w-full bg-primary py-0.5 text-[8px] font-bold text-white text-center tracking-wider">{month}</div>
            <div className="flex-1 flex items-center justify-center text-lg font-black text-primary leading-none">{day}</div>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-primary leading-snug tracking-tight line-clamp-2">{data.title || 'Event Title'}</h1>
            <div className="flex items-center gap-1 text-[10px] text-muted-text mt-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span className="truncate">{data.time}</span>
            </div>
          </div>
        </motion.div>

        {/* Event Details */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-5 flex flex-col gap-3"
        >
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-lg bg-muted-bg flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold tracking-wide text-muted-text uppercase">Location</h4>
              <p className="text-xs text-primary/95 font-medium mt-0.5 leading-tight">{data.venue}</p>
            </div>
          </div>

          {data.description && (
            <div className="border-t border-black/5 pt-3.5 mt-1.5">
              <p className="text-xs text-primary/80 leading-relaxed font-normal">{data.description}</p>
            </div>
          )}
        </motion.div>

        {/* RSVP Card form */}
        <div className="mt-7 border-t border-black/5 pt-6 flex-1">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 bg-emerald-50 border border-success/20 rounded-2xl flex flex-col items-center text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
                  className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center mb-3"
                >
                  <Check className="w-5 h-5" />
                </motion.div>
                <h3 className="text-xs font-bold text-primary">RSVP Confirmed!</h3>
                <p className="text-[10px] text-muted-text mt-1.5 leading-relaxed">
                  You have been registered for this event. A confirmation details update is saved.
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                onSubmit={handleRsvpSubmit} 
                className="flex flex-col gap-3 bg-muted-bg/50 p-4.5 rounded-2xl border border-black/5"
              >
                <h3 className="text-[10px] font-bold tracking-wider text-muted-text uppercase mb-1">
                  {data.rsvpButtonText || 'RSVP for Event'}
                </h3>
                
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white border border-black/5 rounded-lg focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={rsvpForm.email}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white border border-black/5 rounded-lg focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary/80">Number of Guests</span>
                  <div className="flex items-center gap-2.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRsvpForm({ ...rsvpForm, guests: Math.max(1, rsvpForm.guests - 1) })}
                      className="w-7 h-7 rounded-md bg-white border border-black/10 flex items-center justify-center active:bg-muted-bg text-primary cursor-pointer border-0"
                    >
                      <Minus className="w-3 h-3" />
                    </motion.button>
                    <span className="text-xs font-bold w-4 text-center">{rsvpForm.guests}</span>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRsvpForm({ ...rsvpForm, guests: Math.min(10, rsvpForm.guests + 1) })}
                      className="w-7 h-7 rounded-md bg-white border border-black/10 flex items-center justify-center active:bg-muted-bg text-primary cursor-pointer border-0"
                    >
                      <Plus className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>

                {errorMsg && <p className="text-[10px] text-red-500 font-bold">{errorMsg}</p>}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-9 mt-1.5 text-xs font-bold text-white bg-primary hover:bg-accent rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer border-0"
                >
                  {loading ? 'Submitting...' : 'Confirm RSVP'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. LINK CARD PREVIEW
// -------------------------------------------------------------
export function LinkPreview({ data }: { data: LinkCardData }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Sleek top drag handler bar */}
      <div className="w-full flex justify-center py-3">
        <div className="w-10 h-1.5 bg-[#E4E4E7] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-5 pb-8 flex flex-col items-center overflow-y-auto no-scrollbar w-full"
      >
        {/* Profile Image */}
        <motion.div 
          variants={itemVariants}
          className="w-20 h-20 rounded-full overflow-hidden border border-black/5 bg-[#F4F4F5] mb-4"
        >
          {data.profileImage ? (
            <img src={data.profileImage} alt={data.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary text-white flex items-center justify-center text-xl font-bold">
              {data.displayName ? data.displayName.charAt(0) : 'L'}
            </div>
          )}
        </motion.div>

        {/* Name & Bio */}
        <motion.h1 
          variants={itemVariants}
          className="text-base font-bold text-primary tracking-tight"
        >
          {data.displayName || 'Display Name'}
        </motion.h1>
        {data.bio && (
          <motion.p 
            variants={itemVariants}
            className="text-[11px] text-muted-text text-center mt-1.5 max-w-[240px] leading-relaxed"
          >
            {data.bio}
          </motion.p>
        )}

        {/* Dynamic Buttons Stack */}
        <motion.div 
          variants={itemVariants}
          className="w-full flex flex-col gap-3 mt-7"
        >
          {data.links?.map((link) => {
            let styleClass = 'bg-[#F4F4F5] hover:bg-[#E4E4E7] border border-black/5 text-primary';
            if (link.theme === 'accent') {
              styleClass = 'bg-primary hover:bg-accent text-white';
            } else if (link.theme === 'outline') {
              styleClass = 'bg-white hover:bg-[#F4F4F5] border border-primary/20 text-primary';
            }

            return (
              <motion.a
                key={link.id}
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.985 }}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full min-h-[50px] px-4.5 py-3 rounded-xl flex flex-col justify-center transition-all ${styleClass}`}
              >
                <span className="text-xs font-bold leading-tight">{link.label || 'Link Label'}</span>
                {link.secondaryText && (
                  <span className={`text-[9px] mt-0.5 opacity-80 ${link.theme === 'accent' ? 'text-white/80' : 'text-muted-text'}`}>
                    {link.secondaryText}
                  </span>
                )}
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. WIFI CARD PREVIEW
// -------------------------------------------------------------
export function WifiPreview({ data }: { data: WiFiCardData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data.password) return;
    navigator.clipboard.writeText(data.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#FAFAFA]">
      {/* Sleek top drag handler bar */}
      <div className="w-full flex justify-center py-3">
        <div className="w-10 h-1.5 bg-[#E4E4E7] rounded-full" />
      </div>

      <div className="flex-1 px-6 pb-8 flex flex-col items-center overflow-y-auto no-scrollbar w-full justify-start gap-4">
        {/* Top Space / Icon */}
        <div className="w-full flex flex-col items-center mt-6">
          {/* Animated WiFi pulse container */}
          <div className="relative w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 border border-primary/20 rounded-full" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.25, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2.5,
                delay: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-2 border border-primary/25 rounded-full" 
            />
            <motion.div 
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-md z-10"
            >
              <Wifi className="w-7 h-7" />
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg font-bold text-primary text-center tracking-tight"
          >
            Wireless Network Connection
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] text-muted-text text-center mt-1"
          >
            Tap below to copy the security key and connect to WiFi.
          </motion.p>
        </div>

        {/* Network metadata box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.25 }}
          className="w-full flex flex-col gap-3 bg-white p-4.5 rounded-2xl border border-black/5 shadow-xs my-6"
        >
          <div>
            <span className="text-[9px] font-extrabold tracking-wide text-muted-text uppercase">Network Name (SSID)</span>
            <div className="text-xs font-bold text-primary mt-0.5">{data.networkName || 'Network Name'}</div>
          </div>
          
          <div className="border-t border-black/5 pt-3">
            <span className="text-[9px] font-extrabold tracking-wide text-muted-text uppercase">Security Protocol</span>
            <div className="text-xs font-bold text-primary mt-0.5">{data.security || 'WPA'}</div>
          </div>

          {data.password && (
            <div className="border-t border-black/5 pt-3">
              <span className="text-[9px] font-extrabold tracking-wide text-muted-text uppercase">Password</span>
              <div className="text-xs font-bold text-primary mt-0.5 font-mono select-all bg-muted-bg/50 px-2 py-1.5 rounded-md border border-black/5 overflow-x-auto no-scrollbar">
                {data.password}
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Button */}
        <div className="w-full">
          {data.password ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="w-full h-11 bg-primary hover:bg-accent text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer border-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success" /> Copied Password
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy WiFi Password
                </>
              )}
            </motion.button>
          ) : (
            <div className="w-full text-center py-3 text-xs font-bold text-[#10B981] bg-[#10B981]/10 rounded-xl">
              Open Network (No Password)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. PRODUCT CATALOG PREVIEW
// -------------------------------------------------------------
export function CatalogPreview({ data }: { data: ProductCatalogData }) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const getInquiryLink = (productName: string) => {
    if (!data.contactNumber) return '#';
    const message = encodeURIComponent(`Hi, I am interested in purchasing "${productName}" from your CardQR catalog. Can you provide more details?`);
    return `https://wa.me/${data.contactNumber.replace(/\+/g, '')}?text=${message}`;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#FAFAFA] relative overflow-hidden">
      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-32 bg-[#E4E4E7] overflow-hidden shrink-0"
      >
        {data.bannerImage && (
          <img src={data.bannerImage} alt="Catalog Banner" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Sleek top drag handler bar */}
        <div className="absolute top-3 w-full flex justify-center z-30">
          <div className="w-10 h-1 bg-white/60 rounded-full" />
        </div>
      </motion.div>

      {/* Catalog Title / Desc */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 22 }}
        className="px-5 py-4 bg-white border-b border-black/5 shrink-0"
      >
        <h1 className="text-sm font-bold text-primary tracking-tight">{data.catalogTitle || 'Product Catalog'}</h1>
        <p className="text-[10px] text-muted-text mt-1.5 leading-relaxed">{data.catalogDescription || 'Catalog Description'}</p>
      </motion.div>

      {/* Products Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-5 py-4 overflow-y-auto no-scrollbar grid grid-cols-2 gap-3.5"
      >
        {data.products?.map((prod) => (
          <motion.div
            key={prod.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedProduct(prod)}
            className="bg-white rounded-xl border border-black/5 overflow-hidden flex flex-col justify-between transition-all hover:shadow-xs cursor-pointer"
          >
            <div className="w-full aspect-square bg-muted-bg overflow-hidden relative shrink-0">
              {prod.image && <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />}
            </div>
            
            <div className="p-2.5 flex flex-col justify-between flex-1">
              <div>
                <h4 className="text-[11px] font-bold text-primary line-clamp-1 leading-tight">{prod.name}</h4>
                <p className="text-[9px] text-muted-text line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
              </div>
              <div className="flex items-center justify-between mt-3 border-t border-black/5 pt-2">
                <span className="text-[11px] font-extrabold text-primary">${prod.price}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-text" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Product Detail Modal Sheet (Slides from bottom) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
            {/* Backdrop blur & overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
              onClick={() => setSelectedProduct(null)} 
            />
            
            {/* Content Sheet */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative bg-white rounded-t-3xl p-5 flex flex-col gap-4 shadow-xl z-20 max-h-[85%] overflow-y-auto no-scrollbar"
            >
              {/* Modal drag bar */}
              <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto -mt-2 mb-2" />
              
              {/* Image */}
              <div className="w-full aspect-square bg-[#F4F4F5] rounded-2xl overflow-hidden shadow-xs">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-start justify-between">
                  <h2 className="text-sm font-bold text-primary tracking-tight leading-tight pr-4">{selectedProduct.name}</h2>
                  <span className="text-sm font-extrabold text-primary shrink-0">${selectedProduct.price}</span>
                </div>
                <p className="text-xs text-muted-text mt-2.5 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-black/5">
                {data.contactNumber ? (
                  <motion.a
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    href={getInquiryLink(selectedProduct.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer border-0"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-[#25D366]" /> Inquire via WhatsApp
                  </motion.a>
                ) : null}
                {selectedProduct.link ? (
                  <motion.a
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    href={selectedProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 bg-primary hover:bg-accent text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer border-0"
                  >
                    <ShoppingBag className="w-4 h-4" /> Purchase Details
                  </motion.a>
                ) : null}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProduct(null)}
                  className="w-full h-11 bg-muted-bg hover:bg-zinc-200 text-primary font-bold rounded-xl text-xs transition-all cursor-pointer border-0"
                >
                  Close View
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN MULTI-PREVIEW DISPATCHER
// -------------------------------------------------------------
export default function TemplatePreview({ 
  type, 
  data,
  slug = ''
}: { 
  type: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';
  data: any;
  slug?: string;
}) {
  switch (type) {
    case 'business':
      return <BusinessPreview data={data as BusinessCardData} />;
    case 'menu':
      return <MenuPreview data={data as RestaurantMenuData} />;
    case 'event':
      return <EventPreview data={data as EventCardData} slug={slug} />;
    case 'link':
      return <LinkPreview data={data as LinkCardData} />;
    case 'wifi':
      return <WifiPreview data={data as WiFiCardData} />;
    case 'catalog':
      return <CatalogPreview data={data as ProductCatalogData} />;
    default:
      return <div className="p-5 text-center text-xs">Invalid template selection</div>;
  }
}
