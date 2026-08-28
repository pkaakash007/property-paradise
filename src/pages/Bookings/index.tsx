import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import type { Property } from "../../types/property";
import { getPropertyById, submitBooking } from "../../lib/api";
import { Calendar, Clock, CheckCircle2, MapPin, User, Phone, Mail } from "lucide-react";

export default function Bookings() {
  const { listingId } = useParams<{ listingId?: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [scheduledAt, setScheduledAt] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [preferredTime, setPreferredTime] = useState("10:00 AM");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"schedule" | "confirmed">("schedule");

  useEffect(() => {
    if (listingId) {
      getPropertyById(listingId).then((p) => setProperty(p));
    }
  }, [listingId]);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    submitBooking({
      propertyId: listingId || "listing-1",
      listingTitle: property?.title || "Luxury Villa Visit",
      name,
      phone,
      email,
      scheduledAt,
      preferredTime,
      notes,
    }).then(() => {
      setStep("confirmed");
    });
  };

  return (
    <div className="w-full min-h-screen bg-porcelain flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === "confirmed" ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-mist shadow-lg text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-sage/10 text-sage flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-bold font-serif text-ink">Site Visit Requested</h1>
            <p className="text-slate text-sm max-w-md mx-auto leading-relaxed">
              Your private viewing request has been confirmed. An assigned luxury estate advisor will contact you to finalize transportation and security access.
            </p>

            <div className="bg-porcelain p-6 rounded-2xl border border-mist text-left max-w-md mx-auto space-y-2 text-xs text-ink font-medium">
              <div className="flex justify-between">
                <span className="text-slate">Property:</span>
                <span className="font-semibold text-deep-ocean truncate">{property?.title || "Luxury Villa"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Scheduled Date:</span>
                <span>{scheduledAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Preferred Time:</span>
                <span>{preferredTime}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-deep-ocean text-white text-xs font-bold uppercase tracking-wider"
              >
                View Viewing Requests happy
              </button>
              <Link
                to="/properties"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-porcelain border border-mist text-ink text-xs font-bold uppercase tracking-wider"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-mist shadow-lg space-y-8">
            <div className="border-b border-mist pb-6">
              <span className="text-champagne font-semibold text-xs uppercase tracking-widest">
                Private Viewing
              </span>
              <h1 className="text-3xl font-bold font-serif text-ink tracking-tight mt-1">
                Schedule a Site Visit
              </h1>
              {property && (
                <p className="text-xs font-medium text-slate flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-champagne" />
                  <span>{property.title} — {property.location?.city}</span>
                </p>
              )}
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              {/* Date & Time Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1">
                    Select Date
                  </label>
                  <div className="flex items-center gap-2 bg-porcelain border border-mist rounded-xl p-3">
                    <Calendar className="w-4 h-4 text-champagne shrink-0" />
                    <input
                      type="date"
                      required
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-ink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="flex items-center gap-2 bg-porcelain border border-mist rounded-xl p-3">
                    <Clock className="w-4 h-4 text-champagne shrink-0" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-ink focus:outline-none"
                    >
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="12:00 PM">12:00 PM (Noon)</option>
                      <option value="03:00 PM">03:00 PM (Afternoon)</option>
                      <option value="05:00 PM">05:00 PM (Sunset Viewing)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-4 pt-4 border-t border-mist">
                <h4 className="font-bold text-sm text-ink font-serif">Visitor Information</h4>

                <div>
                  <label className="block text-xs font-semibold text-slate mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Krishnan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98422 99999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate mb-1">Special Requirements / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need driver assistance or security clearance"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-deep-ocean hover:bg-ink text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Confirm Site Visit Schedule
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
