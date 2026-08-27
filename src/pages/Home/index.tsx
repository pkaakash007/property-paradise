import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PropertyCard from "../../components/property/PropertyCard";
import type { Property, PropertyType, ListingPurpose } from "../../types/property";
import { getProperties } from "../../lib/api";
import { Search, MapPin, Building2, ShieldCheck, Compass, Award, ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [villas, setVillas] = useState<Property[]>([]);
  const [plots, setPlots] = useState<Property[]>([]);

  // Hero Filter State
  const [purpose, setPurpose] = useState<ListingPurpose>("sale");
  const [type, setType] = useState<PropertyType | "all">("all");
  const [city, setCity] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");

  useEffect(() => {
    getProperties().then((all) => {
      setFeaturedProperties(all.filter((p) => p.featured).slice(0, 3));
      setVillas(all.filter((p) => p.propertyType === "villa").slice(0, 3));
      setPlots(all.filter((p) => p.propertyType === "plot").slice(0, 3));
    });
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set("purpose", purpose);
    if (type !== "all") params.set("type", type);
    if (city !== "all") params.set("city", city);
    if (maxPrice !== "all") params.set("maxPrice", maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[650px] lg:min-h-[720px] flex items-center justify-center bg-[#17212B] text-white overflow-hidden">
        {/* Background Luxury Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Villa Estate"
            className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17212B] via-[#17212B]/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C7A76C] text-xs font-semibold uppercase tracking-widest mb-6">
            <Award className="w-3.5 h-3.5" />
            <span>South India's Luxury Real Estate Authority</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight leading-none mb-6 text-white">
            Find a place worth <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#F2E9D8]">coming home to.</span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Curated portfolio of prime architectural villas, hilltop mansions, and verified residential plots across Coimbatore, Ooty, Chennai, and Bangalore.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 text-[#17212B] max-w-4xl mx-auto text-left"
          >
            {/* Top Purpose & Type Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E5DF] pb-3 mb-4">
              <div className="flex items-center bg-[#F7F5F0] p-1 rounded-xl border border-[#E7E5DF]">
                <button
                  type="button"
                  onClick={() => setPurpose("sale")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    purpose === "sale" ? "bg-[#123B5D] text-white shadow" : "text-[#53606C] hover:text-[#17212B]"
                  }`}
                >
                  Buy Properties
                </button>
                <button
                  type="button"
                  onClick={() => setPurpose("rent")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    purpose === "rent" ? "bg-[#123B5D] text-white shadow" : "text-[#53606C] hover:text-[#17212B]"
                  }`}
                >
                  Rent / Lease
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#53606C]">Property Type:</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="bg-[#F7F5F0] border border-[#E7E5DF] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#17212B] focus:outline-none"
                >
                  <option value="all">Villas & Plots</option>
                  <option value="villa">Luxury Villa</option>
                  <option value="plot">Residential Plot</option>
                </select>
              </div>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#53606C] mb-1">
                  Location
                </label>
                <div className="flex items-center gap-2 bg-[#F7F5F0] border border-[#E7E5DF] rounded-xl px-3 py-2">
                  <MapPin className="w-4 h-4 text-[#C7A76C] shrink-0" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#17212B] focus:outline-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Ooty">Ooty & Nilgiris</option>
                    <option value="Chennai">Chennai ECR</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#53606C] mb-1">
                  Max Budget
                </label>
                <div className="flex items-center gap-2 bg-[#F7F5F0] border border-[#E7E5DF] rounded-xl px-3 py-2">
                  <Building2 className="w-4 h-4 text-[#C7A76C] shrink-0" />
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#17212B] focus:outline-none"
                  >
                    <option value="all">Any Price</option>
                    <option value="10000000">Under ₹1 Cr</option>
                    <option value="20000000">Under ₹2 Cr</option>
                    <option value="50000000">Under ₹5 Cr</option>
                  </select>
                </div>
              </div>

              <div className="sm:self-end">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#123B5D] hover:bg-[#17212B] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
              Handpicked Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#17212B] tracking-tight mt-1">
              Featured Luxury Listings
            </h2>
          </div>
          <Link
            to="/properties"
            className="text-[#123B5D] font-semibold text-sm hover:text-[#17212B] flex items-center gap-1 group"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* Explore Locations */}
      <section className="py-16 bg-[#F7F5F0] border-y border-[#E7E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
              Prime Geographies
            </span>
            <h2 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight mt-1">
              Explore Destinations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                city: "Coimbatore",
                title: "Coimbatore IT Corridor",
                desc: "Saravanampatti & Pollachi Road villas",
                img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "Ooty",
                title: "Ooty Hill Estates",
                desc: "Tea plantation colonial mansions",
                img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "Chennai",
                title: "Chennai ECR Beachfront",
                desc: "Oceanfront luxury retreats",
                img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "Bangalore",
                title: "Bangalore Sadashivanagar",
                desc: "Exclusive gated land parcels",
                img: "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=600&q=80",
              },
            ].map((loc, idx) => (
              <Link
                key={idx}
                to={`/properties?city=${loc.city}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#E7E5DF] block"
              >
                <img
                  src={loc.img}
                  alt={loc.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17212B]/90 via-[#17212B]/30 to-transparent p-6 flex flex-col justify-end text-white">
                  <h3 className="font-serif text-xl font-bold mb-1 group-hover:text-[#C7A76C] transition-colors">
                    {loc.title}
                  </h3>
                  <p className="text-xs text-slate-300">{loc.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Villas & Plots Double Spotlight */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Villas */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
                Private Estates
              </span>
              <h3 className="text-2xl font-bold font-serif text-[#17212B]">Luxury Villas</h3>
            </div>
            <Link to="/properties/villas" className="text-xs font-semibold text-[#123B5D] hover:underline">
              Explore Villas →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {villas.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>

        {/* Plots */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
                Land Parcel Acquisitions
              </span>
              <h3 className="text-2xl font-bold font-serif text-[#17212B]">Premium Plots</h3>
            </div>
            <Link to="/properties/plots" className="text-xs font-semibold text-[#123B5D] hover:underline">
              Explore Plots →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plots.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Verified Section */}
      <section className="py-20 bg-[#17212B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
            The Paradise Assurance
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight mt-2 mb-14 text-white">
            Uncompromising Trust & Professional Advisory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-[#123B5D]/70 p-8 rounded-3xl border border-[#C7A76C]/30 text-left shadow-xl">
              <ShieldCheck className="w-10 h-10 text-[#C7A76C] mb-4" />
              <h4 className="text-xl font-bold font-serif mb-2 text-white">100% Verified Titles</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                Every listed property undergoes rigorous legal title verification, RERA compliance check, and land boundary audit.
              </p>
            </div>

            <div className="bg-[#123B5D]/70 p-8 rounded-3xl border border-[#C7A76C]/30 text-left shadow-xl">
              <Compass className="w-10 h-10 text-[#C7A76C] mb-4" />
              <h4 className="text-xl font-bold font-serif mb-2 text-white">Private Site Viewings</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                Dedicated luxury estate advisors facilitate confidential, hassle-free private viewings tailored to your schedule.
              </p>
            </div>

            <div className="bg-[#123B5D]/70 p-8 rounded-3xl border border-[#C7A76C]/30 text-left shadow-xl">
              <Award className="w-10 h-10 text-[#C7A76C] mb-4" />
              <h4 className="text-xl font-bold font-serif mb-2 text-white">End-to-End Registration</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                Complete legal documentation, valuation advisory, and seamless government registry assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
