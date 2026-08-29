import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Award, ShieldCheck, Gem, Landmark, Globe, MapPin, Copy, Check, ArrowUpRight } from "lucide-react";

interface SocialCardProps {
  platform: string;
  handle: string;
  name: string;
  location: string;
  avatarBg: string;
  avatarLetter: string;
  bullets: string[];
  website: string;
  link: string;
  btnText: string;
  btnGradient: string;
  hoverBorder: string;
  badgeStyle: string;
  watermark: React.ReactNode;
}

function SocialCard({
  platform,
  handle,
  name,
  location,
  avatarBg,
  avatarLetter,
  bullets,
  website,
  link,
  btnText,
  btnGradient,
  hoverBorder,
  badgeStyle,
  watermark,
}: SocialCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-[32px] bg-white border border-[#E7E5DF] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[440px] transition-all duration-300 ${hoverBorder}`}
    >
      {/* Background Watermark Icon */}
      {watermark}

      {/* Top Row */}
      <div className="flex items-center justify-between gap-4 border-b border-[#F0EEE9] pb-4 mb-6 z-10">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase border ${badgeStyle}`}>
          {platform}
        </span>
      </div>

      {/* Profile Avatar & Details */}
      <div className="flex flex-row items-center gap-4 mb-6 z-10">
        <div className={`w-16 h-16 rounded-full ${avatarBg} p-[3px] shadow-lg flex items-center justify-center shrink-0`}>
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
            <span className="font-serif font-black text-lg text-[#123B5D] tracking-tight">{avatarLetter}</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <h3 className="text-base font-black text-[#17212B] leading-none">{handle}</h3>
          <p className="text-[11px] font-bold text-pink-600 leading-snug">{name}</p>
          <div className="flex items-center gap-1 text-[10px] text-[#53606C] font-semibold">
            <MapPin className="w-3 h-3 text-[#C7A76C]" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Bullet Descriptions */}
      <div className="space-y-2 mb-6 z-10 text-left flex-grow">
        {bullets.map((bullet, idx) => (
          <p key={idx} className="text-xs text-[#17212B] font-bold leading-relaxed flex items-start gap-1.5">
            <span>{bullet}</span>
          </p>
        ))}
      </div>

      {/* Link Pill */}
      <div className="mb-6 z-10 flex text-left">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F2ED] text-[10px] font-bold text-[#123B5D] border border-[#E7E5DF]">
          <Globe className="w-3.5 h-3.5 text-[#C7A76C]" />
          <span>{website}</span>
        </span>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-4 border-t border-[#F0EEE9] z-10">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r ${btnGradient} font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-300`}
        >
          <span>{btnText}</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#F4F2ED] hover:bg-[#E7E5DF] text-[#17212B] font-bold text-xs border border-[#E7E5DF] flex items-center justify-center gap-2 transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-extrabold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#53606C]" />
              <span>Copy Handle</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function About() {
  const stats = [
    { label: "DTCP & RERA Layouts Developed", value: "18+" },
    { label: "Elite Residential Plots", value: "320+" },
    { label: "Families Settled", value: "240+" },
    { label: "Title Verification Clean Record", value: "100%" },
  ];

  const values = [
    {
      icon: <Gem className="w-8 h-8 text-[#C7A76C]" />,
      title: "Handpicked Locations",
      description: "We identify and develop lands only in high-growth, serene zones across Coimbatore, Ooty, and Erode, ensuring high appreciation.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#C7A76C]" />,
      title: "100% Legal Transparency",
      description: "Every plot is backed by a clean title deed, DTCP approvals, and complete RERA compliance. Clear documentation is our promise.",
    },
    {
      icon: <Landmark className="w-8 h-8 text-[#C7A76C]" />,
      title: "Premium Infrastructure",
      description: "Our gated layouts feature wide concrete roads, underground utilities, streetlighting, water storage, and 24/7 manned security.",
    },
  ];

  const socialSlides = [
    {
      platform: "INSTAGRAM",
      handle: "@property.paradise",
      name: "Property Paradise • Luxury Real Estate",
      location: "Coimbatore & Ooty, Tamil Nadu",
      avatarBg: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
      avatarLetter: "PP",
      bullets: [
        "🚀 Daily layout walkthroughs, construction updates & drone sweeps.",
        "📸 Live stories showcasing premier villa properties and hillside landscapes.",
      ],
      website: "propertyparadise.in",
      link: "https://www.instagram.com/property.paradise/",
      btnText: "Follow @property.paradise",
      btnGradient: "from-purple-600 via-pink-500 to-orange-500 text-white",
      hoverBorder: "hover:border-pink-500/30",
      badgeStyle: "bg-pink-500/10 text-pink-600 border-pink-500/20",
      watermark: (
        <svg
          className="absolute right-[-40px] bottom-[-20px] w-56 h-56 text-pink-500/5 pointer-events-none select-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      platform: "LINKEDIN",
      handle: "Property Paradise",
      name: "Property Paradise • Gated Layout Developer",
      location: "Coimbatore, Tamil Nadu, India",
      avatarBg: "bg-blue-600",
      avatarLetter: "PP",
      bullets: [
        "🚀 Professional updates, corporate joint-ventures & advisory news.",
        "💼 Expert analysis of high-appreciation land parcels in South India.",
      ],
      website: "propertyparadise.in",
      link: "https://in.linkedin.com/company/propertyparadise",
      btnText: "Connect on LinkedIn",
      btnGradient: "from-blue-700 to-blue-500 text-white",
      hoverBorder: "hover:border-blue-500/30",
      badgeStyle: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      watermark: (
        <svg
          className="absolute right-[-40px] bottom-[-20px] w-56 h-56 text-blue-500/5 pointer-events-none select-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      platform: "FACEBOOK",
      handle: "Property Paradise Groups",
      name: "Property Paradise • Property Buyer Network",
      location: "Coimbatore & Erode, Tamil Nadu",
      avatarBg: "bg-indigo-600",
      avatarLetter: "PP",
      bullets: [
        "🚀 Join our user discussion boards and layout owner group updates.",
        "🏡 Download layout blueprints, site surveys, and DTCP approval documents.",
      ],
      website: "propertyparadise.in",
      link: "https://www.facebook.com/propertyparadisegroups",
      btnText: "Visit Facebook Group",
      btnGradient: "from-blue-600 to-indigo-600 text-white",
      hoverBorder: "hover:border-indigo-500/30",
      badgeStyle: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      watermark: (
        <svg
          className="absolute right-[-40px] bottom-[-20px] w-56 h-56 text-indigo-500/5 pointer-events-none select-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F4F2ED] flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Elegant Hero Section */}
        <section className="relative py-20 lg:py-24 bg-[#17212B] text-[#F7F5F0] overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C7A76C_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C7A76C] bg-[#123B5D]/60 border border-[#C7A76C]/30 px-3 py-1 rounded-full">
              Trust & Legacy in Land Development
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight max-w-4xl mx-auto leading-tight">
              Developing Spaces for <span className="text-[#C7A76C]">Generational Living</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              For over a decade, Property Paradise has been at the forefront of crafting elite gated plot layouts and boutique villas in South India's premium corridors.
            </p>
          </div>
        </section>

        {/* Stats Grid Section */}
        <section className="py-12 bg-white border-b border-[#E7E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#123B5D] font-serif">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-[#53606C] font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Ethos & Story */}
        <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#17212B] leading-tight">
              Delivering Premium Land & <br />
              <span className="text-[#C7A76C]">Villa Gated Communities</span>
            </h2>
            <div className="space-y-4 text-[#53606C] text-sm leading-relaxed">
              <p>
                Property Paradise was founded to solve a major challenge in real estate: finding clean, fully verified, and ready-to-build residential land. We believe that buying land is the start of building a family legacy, and the process should be completely secure and stress-free.
              </p>
              <p>
                Whether it is a scenic tea plantation plot in Ooty, a premium gated community layout in Coimbatore (Kalapatti, Periyanaickenpalayam), or agricultural lands in Erode, we perform rigorous multi-stage title audits. Our layouts are fully integrated with underground power lines, wide blacktop/concrete roads, park pathways, and security systems before handover.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-2.5 bg-[#C7A76C]/10 rounded-[28px]"></div>
            <div className="relative overflow-hidden rounded-[20px] border border-[#E7E5DF] shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800&h=600"
                alt="Luxury Estate Development"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 lg:py-20 bg-white border-y border-[#E7E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl font-bold font-serif text-[#17212B]">
                Our Development Philosophy
              </h2>
              <p className="text-xs text-[#53606C] uppercase font-bold tracking-wider">
                Principles that drive every layout we deliver
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8F6F2] p-8 rounded-2xl border border-[#E7E5DF] space-y-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#E7E5DF]">
                    {val.icon}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-[#17212B]">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#53606C] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
              Digital Presence
            </span>
            <h2 className="text-3xl font-bold font-serif text-[#17212B]">
              Connect With Us Online
            </h2>
            <p className="text-xs text-[#53606C] uppercase font-bold tracking-wider max-w-xl mx-auto">
              Follow our official profiles for daily layout tours, announcements, and pre-launch pricing.
            </p>
          </div>

          {/* Social Cards Grid Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {socialSlides.map((slide, idx) => (
              <SocialCard key={idx} {...slide} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
