import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PropertyCard from "../../components/property/PropertyCard";
import { PropertyCardSkeleton } from "../../components/ui/Skeleton";
import type { Property, PropertyType } from "../../types/property";
import { getProperties } from "../../lib/api";
import { Search, MapPin, Building2, ShieldCheck, Compass, Award, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [villas, setVillas] = useState<Property[]>([]);
  const [plots, setPlots] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Carousel State & Ref
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Hero Filter State
  const [type, setType] = useState<PropertyType | "all">("all");
  const [city, setCity] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");

  useEffect(() => {
    setLoading(true);
    getProperties().then((all) => {
      // Fetch all active properties (featured or published, excluding sold)
      const active = all.filter((p) => p.featured || p.status === "published");
      // Sort featured ones to the front
      active.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      setFeaturedProperties(active);

      setVillas(all.filter((p) => p.propertyType === "villa").slice(0, 3));
      setPlots(all.filter((p) => p.propertyType === "plot").slice(0, 3));
      setLoading(false);
    });
  }, []);

  // Auto scroll effect
  useEffect(() => {
    if (featuredProperties.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const children = container.children;
        if (children.length === 0) return;
        const cardWidth = children[0].clientWidth + 24; // Card width + gap
        const maxScroll = container.scrollWidth - container.clientWidth;
        let newScrollLeft = container.scrollLeft + cardWidth;
        if (newScrollLeft >= maxScroll + 10) {
          newScrollLeft = 0;
        }
        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [featuredProperties, isPaused]);

  const handleCarouselScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const children = container.children;
      if (children.length === 0) return;
      const cardWidth = children[0].clientWidth + 24;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (city !== "all") params.set("city", city);
    if (maxPrice !== "all") params.set("maxPrice", maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F5F0] flex flex-col font-sans">
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
            Curated portfolio of premium hilltop villas, private estates, and verified residential plots across Coimbatore, Ooty, and Erode.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 text-[#17212B] max-w-4xl mx-auto text-left"
          >


            {/* Top Type Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E5DF] pb-3 mb-4">
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
                    <option value="Erode">Erode</option>
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
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
              Handpicked Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#17212B] tracking-tight mt-1">
              Featured Luxury Listings
            </h2>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCarouselScroll("left")}
                className="p-3 rounded-full border border-[#E7E5DF] bg-white text-[#53606C] hover:text-[#123B5D] hover:bg-[#F4F2ED] transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleCarouselScroll("right")}
                className="p-3 rounded-full border border-[#E7E5DF] bg-white text-[#53606C] hover:text-[#123B5D] hover:bg-[#F4F2ED] transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/properties"
              className="text-[#123B5D] font-bold text-sm hover:text-[#17212B] flex items-center gap-1 group whitespace-nowrap"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Sliding Auto-scrolling Track */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto no-scrollbar py-4 px-2 scroll-smooth"
        >
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="min-w-[300px] sm:min-w-[360px] md:min-w-[380px] shrink-0">
                <PropertyCardSkeleton />
              </div>
            ))
          ) : (
            featuredProperties.map((p) => (
              <div key={p.id} className="min-w-[300px] sm:min-w-[360px] md:min-w-[380px] shrink-0 hover:scale-[1.01] transition-transform duration-300">
                <PropertyCard property={p} />
              </div>
            ))
          )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-8">
            {[
              {
                city: "Coimbatore",
                title: "Coimbatore Premium Layouts",
                desc: "Kalapatti, Periyanaickenpalayam & Vellalore plots",
                img: "https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_3scism3scism3sci.png",
              },
              {
                city: "Ooty",
                title: "Ooty Hill Estates",
                desc: "Hilltop bungalows & Baraliyar estates",
                img: "https://propertyparadise.in/wp-content/uploads/2026/06/Blue-Diamond-Bungalowkjjj-Sale.jpg",
              },
              {
                city: "Erode",
                title: "Gobichettipalayam, Erode",
                desc: "Lush residential layouts near Alamelu Avenue",
                img: "https://propertyparadise.in/wp-content/uploads/2026/07/Alamelu_Avenue_site_plot_2K_202607081639-2.jpeg",
              },
            ].map((loc, idx) => (
              <Link
                key={idx}
                to={`/properties?city=${loc.city}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md border border-[#E7E5DF] block"
              >
                <img
                  src={loc.img}
                  alt={loc.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17212B]/90 via-[#17212B]/20 to-transparent p-6 flex flex-col justify-end text-white text-center sm:text-left">
                  <h3 className="font-serif text-xl font-bold mb-1.5 group-hover:text-[#C7A76C] transition-colors">
                    {loc.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{loc.desc}</p>
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
            {loading ? (
              Array(3).fill(0).map((_, i) => <PropertyCardSkeleton key={i} />)
            ) : (
              villas.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))
            )}
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
            {loading ? (
              Array(3).fill(0).map((_, i) => <PropertyCardSkeleton key={i} />)
            ) : (
              plots.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Immersive Video Walkthroughs */}
      <section className="py-20 bg-white border-b border-[#E7E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
              Interactive Media
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#17212B] tracking-tight mt-1">
              Virtual Video Tours
            </h2>
            <p className="text-[#53606C] text-sm mt-2 font-medium">
              Take a virtual walkthrough of our flagship estates and gated communities across Coimbatore and Ooty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Video 1 */}
            <div className="space-y-4 group">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-[#E7E5DF] bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/neX7cMmW_CQ"
                  title="Blue Diamond Ooty Villa Tour"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="px-1">
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#17212B] group-hover:text-[#123B5D] transition-colors">Blue Diamond Bungalow Tour (Ooty)</h4>
                <p className="text-xs text-[#53606C] mt-1">A cinematic walkthrough of our heritage colonial estate nestled in Fern Hill Ooty's tea gardens.</p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="space-y-4 group">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-[#E7E5DF] bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/6qhflH18xSc"
                  title="56 Acres Baraliyar Estate Tour"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="px-1">
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#17212B] group-hover:text-[#123B5D] transition-colors">56 Acres Baraliyar Estate (Ooty)</h4>
                <p className="text-xs text-[#53606C] mt-1">Stunning drone views of our massive private tea, coffee, and fruit orchard plantation in Burliyar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gated layout amenities */}
      <section className="py-20 bg-[#F7F5F0] border-b border-[#E7E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C7A76C] font-semibold text-xs uppercase tracking-widest">
              Premium Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#17212B] tracking-tight mt-1">
              Gated Community Amenities
            </h2>
            <p className="text-[#53606C] text-sm mt-2 font-medium">
              We design every residential layout with absolute attention to legal titles, utility engineering, and security.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Wide Concrete Roads", desc: "40ft & 30ft concrete roads with curbings" },
              { title: "Underground Cabling", desc: "Sleek layouts without hanging electricity lines" },
              { title: "Secure Gated Entry", desc: "24/7 manned security checkpost & CCTV" },
              { title: "Avenue Plantations", desc: "Lush tree borders and green park zones" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7E5DF] text-center space-y-2 shadow-sm">
                <h4 className="font-serif text-sm font-bold text-[#17212B]">{item.title}</h4>
                <p className="text-[10px] text-[#53606C] leading-normal font-medium">{item.desc}</p>
              </div>
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
