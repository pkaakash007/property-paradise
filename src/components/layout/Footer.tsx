import React from "react";
import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#17212B] text-[#F7F5F0] border-t border-[#C7A76C]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Property Paradise"
                className="h-10 w-auto object-contain bg-white/95 p-1 rounded-xl shadow-md"
              />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              South India's premier luxury real estate marketplace specializing exclusively in bespoke villas, hilltop estates, and high-value residential plots.
            </p>
            <div className="flex items-center gap-2 text-[#C7A76C] text-xs font-semibold tracking-wider uppercase pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Titles & RERA Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4 font-serif">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/properties/villas" className="hover:text-[#C7A76C] transition-colors">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link to="/properties/plots" className="hover:text-[#C7A76C] transition-colors">
                  Residential Plots
                </Link>
              </li>
              <li>
                <Link to="/properties/sale" className="hover:text-[#C7A76C] transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties/rent" className="hover:text-[#C7A76C] transition-colors">
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#C7A76C] transition-colors">
                  Map Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Locations */}
          <div>
            <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4 font-serif">
              Locations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/properties?city=Coimbatore" className="hover:text-[#C7A76C] transition-colors">
                  Coimbatore
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Ooty" className="hover:text-[#C7A76C] transition-colors">
                  Ooty & Nilgiris
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Chennai" className="hover:text-[#C7A76C] transition-colors">
                  Chennai ECR
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bangalore" className="hover:text-[#C7A76C] transition-colors">
                  Bangalore
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4 font-serif">
              Advisory Office
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C7A76C] shrink-0 mt-0.5" />
                <span>Saravanampatti IT Hub, Coimbatore, Tamil Nadu 641035</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C7A76C] shrink-0" />
                <span>+91 98422 12345</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C7A76C] shrink-0" />
                <span>advisory@propertyparadise.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Property Paradise. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">RERA Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
