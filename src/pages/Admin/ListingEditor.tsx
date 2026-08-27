import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import MapView from "../../components/property/MapView";
import type { Property, PropertyType, ListingPurpose, ListingStatus } from "../../types/property";
import { getPropertyById, saveListing, MOCK_AGENTS } from "../../lib/api";
import { Save, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

export default function ListingEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState<Partial<Property>>({
    title: "",
    slug: "",
    propertyType: "villa",
    listingPurpose: "sale",
    status: "published",
    price: 12500000,
    areaSqft: 3500,
    bedrooms: 4,
    bathrooms: 4,
    facing: "East",
    description: "",
    primaryImageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    youtubeVideoId: "dQw4w9WgXcQ",
    agentId: "agent-1",
    featured: true,
    verified: true,
    location: {
      id: `loc-${Date.now()}`,
      state: "Tamil Nadu",
      city: "Coimbatore",
      locality: "Saravanampatti",
      address: "124 Luxury Villa Avenue",
      latitude: 11.0804,
      longitude: 76.9944,
      privacy: "exact"
    }
  });

  useEffect(() => {
    if (id) {
      getPropertyById(id).then((p) => {
        if (p) setFormData(p);
      });
    }
  }, [id]);

  const handleLocationPick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location!,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
      },
    }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!formData.title?.trim()) errs.push("Title is required");
    if (!formData.price || formData.price <= 0) errs.push("Valid price is required");
    if (!formData.location?.latitude || !formData.location?.longitude) errs.push("Location coordinates are required");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = (publish: boolean = false) => {
    if (!validate()) return;
    const toSave = { ...formData, status: publish ? ("published" as ListingStatus) : ("draft" as ListingStatus) };
    saveListing(toSave);
    setSuccessMsg(publish ? "Listing Published Successfully!" : "Draft Saved Successfully!");
    setTimeout(() => {
      navigate("/admin/listings");
    }, 1200);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/listings")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Listings</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl bg-slate/20 border border-slate/40 text-white font-semibold text-xs hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-soft text-ink font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing</span>
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate/10 border border-slate/30 p-4 rounded-2xl flex items-center justify-between text-xs">
          {[
            { num: 1, label: "Basic" },
            { num: 2, label: "Details" },
            { num: 3, label: "Location Map" },
            { num: 4, label: "Media" },
            { num: 5, label: "Agent & Review" },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                step === s.num
                  ? "bg-deep-ocean text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Validation Errors & Notifications */}
        {errors.length > 0 && (
          <div className="p-4 bg-coral/20 border border-coral/40 rounded-2xl text-coral text-xs space-y-1">
            {errors.map((e, idx) => (
              <p key={idx}>⚠️ {e}</p>
            ))}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-sage/20 border border-sage/40 rounded-2xl text-sage text-xs font-bold text-center">
            ✅ {successMsg}
          </div>
        )}

        {/* Multi-Step Editor Form Body */}
        <div className="bg-slate/10 border border-slate/30 p-6 sm:p-8 rounded-3xl space-y-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-white">Step 1: Basic Information</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Contemporary 4 BHK Luxury Villa"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                    className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="villa">Luxury Villa</option>
                    <option value="plot">Residential Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Listing Purpose</label>
                  <select
                    value={formData.listingPurpose}
                    onChange={(e) => setFormData({ ...formData, listingPurpose: e.target.value as ListingPurpose })}
                    className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-white">Step 2: Property Facts & Specifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Built-up / Plot Area (sq.ft)</label>
                  <input
                    type="number"
                    value={formData.areaSqft}
                    onChange={(e) => setFormData({ ...formData, areaSqft: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Facing Orientation</label>
                <select
                  value={formData.facing}
                  onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                  className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="East">East</option>
                  <option value="North">North</option>
                  <option value="East-North">East-North Corner</option>
                  <option value="South-East">South-East</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Property Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Location Map Picker */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-white">Step 3: Location & Interactive Map Pin</h3>
              <p className="text-xs text-slate-400">
                Drag the map pin or click on the map canvas to store exact property latitude and longitude.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.location?.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, city: e.target.value },
                      })
                    }
                    className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Locality</label>
                  <input
                    type="text"
                    value={formData.location?.locality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, locality: e.target.value },
                      })
                    }
                    className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-black/40 p-3 rounded-xl border border-slate/40 text-xs font-mono">
                <div>Lat: {formData.location?.latitude}</div>
                <div>Lng: {formData.location?.longitude}</div>
              </div>

              {/* Interactive Map Picker Canvas */}
              <div className="h-[320px] rounded-2xl overflow-hidden border border-slate/40">
                <MapView
                  properties={[]}
                  interactiveLocationPicker
                  initialLat={formData.location?.latitude || 11.0804}
                  initialLng={formData.location?.longitude || 76.9944}
                  onLocationPick={handleLocationPick}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Media */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-white">Step 4: Photography & Virtual Tour</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Image URL (Cloudflare R2 / CDN)</label>
                <input
                  type="text"
                  value={formData.primaryImageUrl}
                  onChange={(e) => setFormData({ ...formData, primaryImageUrl: e.target.value })}
                  className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube Virtual Tour Video ID</label>
                <input
                  type="text"
                  placeholder="e.g. dQw4w9WgXcQ"
                  value={formData.youtubeVideoId}
                  onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                  className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Agent & Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-white">Step 5: Agent Assignment & Final Review</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Responsible Agent</label>
                <select
                  value={formData.agentId}
                  onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                  className="w-full bg-black/40 border border-slate/40 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none"
                >
                  {MOCK_AGENTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-black/40 rounded-2xl border border-slate/40 text-xs space-y-2">
                <div className="font-bold text-champagne text-sm">{formData.title || "Untitled"}</div>
                <div>Price: ₹{(formData.price || 0).toLocaleString()}</div>
                <div>Location: {formData.location?.locality}, {formData.location?.city}</div>
                <div>Coordinates: {formData.location?.latitude}, {formData.location?.longitude}</div>
              </div>
            </div>
          )}

          {/* Bottom Pagination Controls */}
          <div className="pt-6 border-t border-slate/30 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-black/40 text-slate-300 font-semibold text-xs hover:text-white disabled:opacity-30"
            >
              Previous Step
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2 rounded-xl bg-deep-ocean text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-6 py-2.5 rounded-xl bg-champagne hover:bg-champagne-soft text-ink font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Publish Listing Now
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
