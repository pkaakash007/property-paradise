import React from "react";
import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-porcelain border-t border-slate/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-deep-ocean flex items-center justify-center text-champagne">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-semibold text-2xl tracking-tight text-white font-serif">
                PROPERTY PARADISE
              </span>
            </div>
            <p className="text-slate text-sm leading-relaxed max-w-sm">
              South India's premier luxury real estate marketplace specializing exclusively in bespoke villas, hilltop estates, and high-value residential plots.
            </p>
            <div className="flex items-center gap-2 text-champagne text-xs font-semibold tracking-wider uppercase pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Titles & RERA Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4 font-serif">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-slate">
              <li>
                <Link to="/properties/villas" className="hover:text-champagne transition-colors">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link to="/properties/plots" className="hover:text-champagne transition-colors">
                  Residential Plots
                </Link>
              </li>
              <li>
                <Link to="/properties/sale" className="hover:text-champagne transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties/rent" className="hover:text-champagne transition-colors">
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-champagne transition-colors">
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
            <ul className="space-y-2.5 text-sm text-slate">
              <li>
                <Link to="/properties?city=Coimbatore" className="hover:text-champagne transition-colors">
                  Coimbatore
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Ooty" className="hover:text-champagne transition-colors">
                  Ooty & Nilgiris
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Chennai" className="hover:text-champagne transition-colors">
                  Chennai ECR
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bangalore" className="hover:text-champagne transition-colors">
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
            <ul className="space-y-3 text-sm text-slate">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-champagne shrink-0 mt-0.5" />
                <span>Saravanampatti IT Hub, Coimbatore, Tamil Nadu 641035</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-champagne shrink-0" />
                <span>+91 98422 12345</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-champagne shrink-0" />
                <span>advisory@propertyparadise.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate gap-4">
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
