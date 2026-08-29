import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PropertyGallery from "../../components/property/PropertyGallery";
import VirtualTour from "../../components/property/VirtualTour";
import MapView from "../../components/property/MapView";
import PropertyCard, { formatPrice } from "../../components/property/PropertyCard";
import { PropertyDetailsSkeleton } from "../../components/ui/Skeleton";
import type { Property } from "../../types/property";
import { getPropertyBySlug, submitLead, getProperties } from "../../lib/api";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Share2,
  ArrowLeft,
} from "lucide-react";

export default function PropertyDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Enquiry Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("I am interested in this property. Please contact me with details.");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPropertyBySlug(slug).then((prop) => {
      setProperty(prop);
      setLoading(false);

      if (prop) {
        getProperties({ type: prop.propertyType }).then((all) => {
          setSimilarProperties(all.filter((p) => p.id !== prop.id).slice(0, 3));
        });
      }
    });
  }, [slug]);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    submitLead({
      name,
      phone,
      email,
      message,
      listingId: property.id,
      listingTitle: property.title,
      source: "property_detail",
    }).then(() => {
      setSubmitted(true);
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F5F0] flex flex-col">
        <Header />
        <PropertyDetailsSkeleton />
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="w-full min-h-screen bg-porcelain flex flex-col">
        <Header />
        <div className="flex-1 max-w-xl mx-auto p-12 text-center my-12 bg-white rounded-3xl border border-mist shadow-sm">
          <h2 className="text-2xl font-bold font-serif text-ink mb-2">Property Not Found</h2>
          <p className="text-slate text-sm mb-6">The requested listing may have been sold or removed.</p>
          <Link to="/properties" className="px-6 py-2.5 rounded-full bg-deep-ocean text-white font-semibold text-xs">
            Explore All Listings
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Top Back Button + Breadcrumb + Share */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E7E5DF] text-[#17212B] text-xs font-bold shadow-sm hover:bg-[#123B5D] hover:text-white hover:border-[#123B5D] transition-all duration-200 group shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#53606C] flex-1 min-w-0">
            <Link to="/" className="hover:text-[#17212B] whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-[#17212B] whitespace-nowrap">Properties</Link>
            <span>/</span>
            <span className="text-[#17212B] font-semibold truncate">{property.title}</span>
          </div>

          {/* Share */}
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E7E5DF] text-[#17212B] text-xs font-semibold hover:bg-[#F7F5F0] transition-all shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* 1. Image Gallery */}
        <PropertyGallery images={property.images || []} title={property.title} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Main Editorial Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header Specs */}
            <div className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-mist shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-deep-ocean text-white uppercase tracking-wider">
                    {property.propertyType}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-ink text-white uppercase tracking-wider">
                    For Sale
                  </span>
                  {property.verified && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sage/10 text-sage border border-sage/20 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <span className="text-3xl sm:text-4xl font-bold font-serif text-deep-ocean">
                  {formatPrice(property.price, property.listingPurpose)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-ink tracking-tight">
                {property.title}
              </h1>

              {property.location && (
                <p className="text-sm text-slate flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-champagne shrink-0" />
                  <span>{property.location.address || `${property.location.locality}, ${property.location.city}`}</span>
                </p>
              )}

              {/* Key Fact Chips */}
              <div className="pt-6 border-t border-mist grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-medium text-ink">
                {property.propertyType === "villa" ? (
                  <>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Bedrooms</span>
                      <span className="font-bold font-serif text-lg text-deep-ocean">{property.bedrooms || 4} Beds</span>
                    </div>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Bathrooms</span>
                      <span className="font-bold font-serif text-lg text-deep-ocean">{property.bathrooms || 4} Baths</span>
                    </div>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Built-up Area</span>
                      <span className="font-bold font-serif text-lg text-deep-ocean">{property.areaSqft?.toLocaleString()} sq.ft</span>
                    </div>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Facing</span>
                      <span className="font-bold font-serif text-lg text-deep-ocean">{property.facing || "East"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Plot Area</span>
                      <span className="font-bold font-serif text-lg text-deep-ocean">{property.areaSqft?.toLocaleString()} sq.ft</span>
                    </div>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Orientation</span>
                      <span className="font-bold font-serif text-lg text-deep-ocean">{property.facing || "Corner"}</span>
                    </div>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Approval</span>
                      <span className="font-bold font-serif text-lg text-deep-ocean">DTCP / RERA</span>
                    </div>
                    <div className="bg-porcelain p-3 rounded-2xl border border-mist/60 text-center">
                      <span className="text-slate text-xs block mb-1">Status</span>
                      <span className="font-bold font-serif text-lg text-sage">Immediate Reg.</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mist shadow-sm space-y-4">
              <h3 className="text-xl font-bold font-serif text-ink">About this Property</h3>
              <p className="text-slate text-sm leading-relaxed whitespace-pre-line">
                {property.description ||
                  "Designed for discerning homeowners, this exceptional luxury property combines private sanctuary living with seamless access to city hubs. Features high ceilings, abundant natural light, premium architectural finishes, and comprehensive gated security."}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mist shadow-sm space-y-4">
              <h3 className="text-xl font-bold font-serif text-ink">Property Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  "Smart Home Automation",
                  "24/7 Gated Security",
                  "Private Swimming Pool",
                  "Italian Marble Flooring",
                  "Underground Utilities",
                  "Landscaped Garden",
                  "Covered Car Parking",
                  "100% Power Backup",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate bg-porcelain p-3 rounded-xl border border-mist/50">
                    <CheckCircle2 className="w-4 h-4 text-champagne shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Tour */}
            {property.youtubeVideoId && (
              <VirtualTour
                videoId={property.youtubeVideoId}
                title={property.title}
                onScheduleVisit={() => navigate(`/booking/${property.id}`)}
              />
            )}

            {/* Location Map */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mist shadow-sm space-y-4">
              <h3 className="text-xl font-bold font-serif text-ink">Location & Neighborhood</h3>
              <div className="h-[350px] rounded-2xl overflow-hidden">
                <MapView properties={[property]} selectedPropertyId={property.id} />
              </div>
            </div>

            {/* Assigned Agent Information */}
            {property.agent && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mist shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={property.agent.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"}
                  alt={property.agent.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-champagne shadow"
                />
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="text-xs font-semibold text-champagne uppercase tracking-wider">
                    {property.agent.designation || "Luxury Property Advisor"}
                  </span>
                  <h4 className="text-xl font-bold font-serif text-ink">{property.agent.name}</h4>
                  <p className="text-xs text-slate max-w-lg">{property.agent.bio}</p>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-deep-ocean">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {property.agent.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {property.agent.email}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Enquiry Form Panel (Desktop) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-mist shadow-lg space-y-6">
              <div className="border-b border-mist pb-4">
                <h3 className="text-xl font-bold font-serif text-ink">Inquire about Estate</h3>
                <p className="text-xs text-slate mt-1">
                  Private viewings arranged directly with assigned advisor.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-sage/10 rounded-2xl border border-sage/20 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-sage mx-auto" />
                  <h4 className="font-bold text-ink font-serif">Request Received</h4>
                  <p className="text-xs text-slate leading-relaxed">
                    An advisor will contact you shortly to confirm details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Ramakrishnan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="anand@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-porcelain border border-mist rounded-xl p-3 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-deep-ocean hover:bg-ink text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                  >
                    Contact Advisor
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/booking/${property.id}`)}
                    className="w-full py-3.5 rounded-xl bg-champagne hover:bg-champagne-soft text-ink font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Site Visit</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="pt-16 border-t border-mist space-y-8">
            <h3 className="text-2xl font-bold font-serif text-ink">Similar Luxury Listings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-mist p-4 flex items-center gap-3 shadow-2xl">
        <button
          onClick={() => navigate(`/booking/${property.id}`)}
          className="flex-1 py-3 rounded-xl bg-deep-ocean text-white text-xs font-bold uppercase tracking-wider shadow flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
        <a
          href={`tel:${property.agent?.phone || "+919842212345"}`}
          className="p-3 rounded-xl bg-champagne text-ink shadow flex items-center justify-center"
          title="Call Advisor"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      <Footer />
    </div>
  );
}
