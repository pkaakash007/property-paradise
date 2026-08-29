import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { submitLead } from "../../lib/api";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError("Name and Phone Number are required.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      const response = await submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        message: formData.message || undefined,
        preferredDate: formData.preferredDate || undefined,
        preferredTime: formData.preferredTime || undefined,
        source: "contact_page",
        status: "new",
      });

      if (response.success) {
        setSuccess(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          preferredDate: "",
          preferredTime: "",
        });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit inquiry. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F5F0] flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title & Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#123B5D]/10 border border-[#123B5D]/20 text-[#123B5D] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#C7A76C]" />
            <span>Private Advisory & Site Visits</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[#17212B] tracking-tight">
            Connect with Our Advisory Team
          </h1>
          <p className="text-xs sm:text-sm text-[#53606C] leading-relaxed max-w-xl mx-auto">
            Schedule a private consultation, request verified documentation, or coordinate an exclusive site visit with our senior relationship managers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
          {/* Left Column - Contact Details */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-[#17212B] text-white p-8 sm:p-10 rounded-[32px] border border-[#C7A76C]/30 shadow-xl space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C7A76C_1px,transparent_1px)] [background-size:20px_20px]"></div>
              
              <div className="space-y-2 relative z-10">
                <h2 className="text-2xl font-bold font-serif text-[#C7A76C]">Corporate Headquarters</h2>
                <p className="text-xs text-slate-300">Property Paradise Advisory Services Pvt. Ltd.</p>
              </div>

              <div className="space-y-6 relative z-10">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                    <MapPin className="w-5 h-5 text-[#C7A76C]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#C7A76C] uppercase tracking-wider">Address</h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                      Kailash Nagar, Periyanaickenpalayam,<br />Coimbatore, Tamil Nadu 641020
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                    <Phone className="w-5 h-5 text-[#C7A76C]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#C7A76C] uppercase tracking-wider">Direct Hotline</h3>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white mt-1">
                      +91 97879 33444
                    </p>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white">
                      +91 97879 22333
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                    <Mail className="w-5 h-5 text-[#C7A76C]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#C7A76C] uppercase tracking-wider">Email</h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1">
                      advisory@propertyparadise.in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E5DF] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#123B5D]/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-[#123B5D]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17212B] font-serif">Office Hours</h3>
                <p className="text-xs text-[#53606C] mt-0.5">Monday to Saturday: 9:00 AM - 7:00 PM</p>
                <p className="text-xs text-[#53606C]">Sunday: Site Visits by Prior Appointment Only</p>
              </div>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-7">
            {success ? (
              <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#E7E5DF] text-center shadow-md space-y-6 animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-[#4F7A69]/10 text-[#4F7A69] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#17212B]">Inquiry Received</h2>
                  <p className="text-xs sm:text-sm text-[#53606C] leading-relaxed max-w-md mx-auto">
                    Thank you for reaching out. One of our luxury advisory executives will contact you within the next 2 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#123B5D] hover:bg-[#17212B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#E7E5DF] shadow-md space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-serif text-[#17212B]">Send a Message</h2>
                  <p className="text-xs text-[#53606C]">Fields marked with * are mandatory.</p>
                </div>

                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-[#17212B]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Sundar Raman"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E5DF] focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-sm text-[#17212B] placeholder:text-[#53606C]/40 bg-[#F7F5F0]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-[#17212B]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., +91 98765 43210"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E5DF] focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-sm text-[#17212B] placeholder:text-[#53606C]/40 bg-[#F7F5F0]/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-[#17212B]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., client@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#E7E5DF] focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-sm text-[#17212B] placeholder:text-[#53606C]/40 bg-[#F7F5F0]/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="preferredDate" className="text-xs font-bold text-[#17212B]">
                      Preferred Date for Callback
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E5DF] focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-sm text-[#17212B] bg-[#F7F5F0]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="preferredTime" className="text-xs font-bold text-[#17212B]">
                      Preferred Time Slot
                    </label>
                    <input
                      type="text"
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      placeholder="e.g., Morning (10 AM - 12 PM)"
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E5DF] focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-sm text-[#17212B] placeholder:text-[#53606C]/40 bg-[#F7F5F0]/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-[#17212B]">
                    Your Message / Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe the type of property you are seeking (budget, location, features, etc.)..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E7E5DF] focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-sm text-[#17212B] placeholder:text-[#53606C]/40 bg-[#F7F5F0]/50 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#123B5D] hover:bg-[#17212B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
