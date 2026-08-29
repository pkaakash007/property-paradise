import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PropertyCard from "../../components/property/PropertyCard";
import { PropertyCardSkeleton } from "../../components/ui/Skeleton";
import type { Property } from "../../types/property";
import { getFavorites, getProperties } from "../../lib/api";
import { Heart } from "lucide-react";

export default function Favorites() {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favIds = getFavorites();
    getProperties().then((all) => {
      setFavoriteProperties(all.filter((p) => favIds.includes(p.id)));
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-porcelain flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-ink tracking-tight">
            Saved Properties
          </h1>
          <p className="text-xs text-slate mt-1">
            {favoriteProperties.length} luxury properties saved in your collection
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <PropertyCardSkeleton key={n} />
            ))}
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-mist text-center max-w-md mx-auto my-12 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-ink">Your saved list is empty</h2>
            <p className="text-slate text-sm leading-relaxed">
              Save properties you love and return to them anytime.
            </p>
            <Link
              to="/properties"
              className="inline-block px-6 py-3 rounded-full bg-deep-ocean text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-ink transition-all"
            >
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
