import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { User, Heart, Search, Calendar, Bell, Shield, LogOut, CheckCircle2 } from "lucide-react";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "saved" | "searches" | "viewings" | "notifications" | "privacy"
  >("profile");

  return (
    <div className="min-h-screen bg-porcelain flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-4 border border-mist shadow-sm space-y-1">
              <div className="p-4 border-b border-mist mb-2 text-center sm:text-left">
                <div className="w-14 h-14 rounded-full bg-deep-ocean text-white font-bold text-xl flex items-center justify-center font-serif mb-2 mx-auto sm:mx-0">
                  AR
                </div>
                <h3 className="font-bold font-serif text-ink text-base">Anand Ramakrishnan</h3>
                <p className="text-xs text-slate">anand.ram@example.com</p>
              </div>

              {[
                { id: "profile", label: "Profile Settings", icon: User },
                { id: "searches", label: "Saved Searches", icon: Search },
                { id: "viewings", label: "Viewing Requests", icon: Calendar },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "privacy", label: "Privacy Settings", icon: Shield },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      active ? "bg-deep-ocean text-white shadow" : "text-slate hover:text-ink hover:bg-porcelain"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-mist">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-coral hover:bg-coral/10 transition-all">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Tab Content Panel */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-mist shadow-sm">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-serif text-ink">Personal Profile</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Anand Ramakrishnan"
                        className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-semibold text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate mb-1">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue="+91 98422 12345"
                        className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-semibold text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate mb-1">Primary Email</label>
                      <input
                        type="email"
                        defaultValue="anand.ram@example.com"
                        className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-semibold text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate mb-1">Preferred City</label>
                      <input
                        type="text"
                        defaultValue="Coimbatore, Tamil Nadu"
                        className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-semibold text-ink"
                      />
                    </div>
                  </div>
                  <button className="px-6 py-3 rounded-full bg-deep-ocean text-white font-bold text-xs uppercase tracking-wider">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === "searches" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-serif text-ink mb-4">Saved Search Alerts</h2>
                  <div className="p-4 rounded-2xl bg-porcelain border border-mist flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-ink block text-sm">Coimbatore Villas under ₹2 Cr</span>
                      <span className="text-slate">Saravanampatti & IT Hub corridor</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-sage/10 text-sage font-bold">Active Alert</span>
                  </div>
                </div>
              )}

              {activeTab === "viewings" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-serif text-ink mb-4">Scheduled Site Visits</h2>
                  <div className="p-4 rounded-2xl bg-porcelain border border-mist flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-ink block text-sm">Contemporary 4 BHK Luxury Villa</span>
                      <span className="text-slate">Scheduled for 10:00 AM tomorrow</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-deep-ocean text-white font-bold">Confirmed</span>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-serif text-ink mb-4">Notification Preferences</h2>
                  <div className="space-y-3 text-xs">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-porcelain">
                      <span className="font-semibold text-ink">New Luxury Villa Listings in Coimbatore</span>
                      <input type="checkbox" defaultChecked className="text-deep-ocean" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl bg-porcelain">
                      <span className="font-semibold text-ink">Price Reduction Alerts on Shortlist</span>
                      <input type="checkbox" defaultChecked className="text-deep-ocean" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-serif text-ink mb-4">Privacy & Data Governance</h2>
                  <p className="text-xs text-slate leading-relaxed">
                    Your contact information is strictly protected under Property Paradise Privacy Shield and shared only with your designated luxury estate advisor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
