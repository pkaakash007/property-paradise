import React from "react";
import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-10 px-3 sm:px-6 bg-[#F7F5F0]">
      {/* iOS Dynamic Island Floating Footer Container */}
      <div className="max-w-7xl mx-auto rounded-3xl sm:rounded-[36px] bg-[#17212B] text-[#F7F5F0] border border-[#C7A76C]/30 p-6 sm:p-12 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#C7A76C]/50 flex items-center justify-center p-1.5 shadow-md overflow-hidden">
                <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-white font-serif block">
                  PROPERTY PARADISE
                </span>
                <span className="text-[9px] tracking-widest text-[#C7A76C] uppercase font-extrabold block">
                  Luxury Real Estate
                </span>
              </div>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              South India's premier luxury real estate marketplace specializing exclusively in bespoke villas, hilltop estates, and high-value residential plots.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#123B5D]/80 border border-[#C7A76C]/40 text-[#C7A76C] text-[11px] font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Titles & RERA Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#C7A76C] font-extrabold text-xs tracking-widest uppercase mb-4 font-serif">
              Discover
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li>
                <Link to="/properties/villas" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>Luxury Villas</span>
                  <ArrowUpRight className="w-3 h-3 text-[#C7A76C]" />
                </Link>
              </li>
              <li>
                <Link to="/properties/plots" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>Residential Plots</span>
                  <ArrowUpRight className="w-3 h-3 text-[#C7A76C]" />
                </Link>
              </li>
              <li>
                <Link to="/properties/sale" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>Properties for Sale</span>
                </Link>
              </li>
              <li>
                <Link to="/properties/rent" className="hover:text-white flex items-center gap-1 transition-colors">
                  <span>Properties for Rent</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#C7A76C] flex items-center gap-1 transition-colors">
                  <span>Interactive Map Search</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Locations */}
          <div>
            <h4 className="text-[#C7A76C] font-extrabold text-xs tracking-widest uppercase mb-4 font-serif">
              Prime Locations
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li>
                <Link to="/properties?city=Coimbatore" className="hover:text-white transition-colors">
                  Coimbatore IT Hub
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Coimbatore" className="hover:text-white transition-colors">
                  Race Course Road
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Ooty" className="hover:text-white transition-colors">
                  Ooty & Nilgiris
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Erode" className="hover:text-white transition-colors">
                  Gobichettipalayam Erode
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#C7A76C] font-extrabold text-xs tracking-widest uppercase mb-4 font-serif">
              Talk to us
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C7A76C] shrink-0 mt-0.5" />
                <span>Kailash Nagar, Periyanaickenpalayam, Coimbatore, India, Tamil Nadu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C7A76C] shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-white font-bold">+91 97879 33444</span>
                  <span className="font-mono text-white font-bold">+91 97879 22333</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C7A76C] shrink-0" />
                <span>advisory@propertyparadise.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-medium">
          <p>© {new Date().getFullYear()} Property Paradise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
