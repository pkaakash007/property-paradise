import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import MapView from "../../components/property/MapView";
import type { Property, PropertyType, ListingPurpose, ListingStatus, Agent } from "../../types/property";
import { getPropertyById, saveListing, getAgents, deleteListing } from "../../lib/api";
import { Save, CheckCircle2, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";

export default function ListingEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  const handleDeleteListing = () => {
    if (id && confirm("Are you sure you want to permanently delete this listing from database?")) {
      deleteListing(id);
      navigate("/admin/listings");
    }
  };

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
      id: `loc-editor`,
      state: "Tamil Nadu",
      city: "Coimbatore",
      locality: "Saravanampatti",
      address: "124 Luxury Villa Avenue",
      latitude: 11.0804,
      longitude: 76.9944,
      privacy: "exact"
    }
  });

  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    getAgents().then((data) => setAgents(data));
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
            className="flex items-center gap-1.5 text-xs font-bold text-[#53606C] hover:text-[#123B5D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Listings</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {id && (
              <button
                type="button"
                onClick={handleDeleteListing}
                className="px-3.5 py-2 rounded-xl bg-[#C65A52]/10 border border-[#C65A52]/30 text-[#C65A52] font-bold text-xs hover:bg-[#C65A52] hover:text-white transition-all flex items-center gap-1.5"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#E7E5DF] text-[#17212B] font-bold text-xs hover:bg-[#E7E5DF] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              className="px-5 py-2 rounded-xl bg-[#C7A76C] hover:bg-[#b09054] text-[#17212B] font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing</span>
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-white border border-[#E7E5DF] p-4 rounded-2xl flex items-center justify-between text-xs shadow-sm">
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all ${
                step === s.num
                  ? "bg-[#123B5D] text-white shadow"
                  : "text-[#53606C] hover:text-[#123B5D]"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[10px] text-[#17212B] font-extrabold">
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Validation Errors & Notifications */}
        {errors.length > 0 && (
          <div className="p-4 bg-[#C65A52]/10 border border-[#C65A52]/30 rounded-2xl text-[#C65A52] text-xs font-bold space-y-1">
            {errors.map((e, idx) => (
              <p key={idx}>⚠️ {e}</p>
            ))}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-[#4F7A69]/10 border border-[#4F7A69]/30 rounded-2xl text-[#4F7A69] text-xs font-extrabold text-center">
            ✅ {successMsg}
          </div>
        )}

        {/* Multi-Step Editor Form Body */}
        <div className="bg-white border border-[#E7E5DF] p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-[#17212B]">Step 1: Basic Information</h3>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Contemporary 4 BHK Luxury Villa"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17212B] mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                    className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                  >
                    <option value="villa">Luxury Villa</option>
                    <option value="plot">Residential Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17212B] mb-1">Listing Purpose</label>
                  <select
                    value={formData.listingPurpose}
                    onChange={(e) => setFormData({ ...formData, listingPurpose: e.target.value as ListingPurpose })}
                    className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-[#17212B]">Step 2: Property Facts & Specifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17212B] mb-1">Area (sq.ft)</label>
                  <input
                    type="number"
                    value={formData.areaSqft}
                    onChange={(e) => setFormData({ ...formData, areaSqft: Number(e.target.value) })}
                    className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17212B] mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17212B] mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">Facing Orientation</label>
                <select
                  value={formData.facing}
                  onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                >
                  <option value="East">East</option>
                  <option value="North">North</option>
                  <option value="East-North">East-North Corner</option>
                  <option value="South-East">South-East</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">Property Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Location Map Picker */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-[#17212B]">Step 3: Location & Interactive Map Pin</h3>
              <p className="text-xs font-semibold text-[#53606C]">
                Drag the map pin or click on the map canvas to store exact property latitude and longitude.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17212B] mb-1">City</label>
                  <input
                    type="text"
                    value={formData.location?.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, city: e.target.value },
                      })
                    }
                    className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17212B] mb-1">Locality</label>
                  <input
                    type="text"
                    value={formData.location?.locality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, locality: e.target.value },
                      })
                    }
                    className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#F7F5F0] p-3 rounded-xl border border-[#E7E5DF] text-xs font-bold text-[#123B5D]">
                <div>Lat: {formData.location?.latitude}</div>
                <div>Lng: {formData.location?.longitude}</div>
              </div>

              {/* Interactive Map Picker Canvas */}
              <div className="h-[320px] rounded-2xl overflow-hidden border border-[#E7E5DF]">
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
              <h3 className="text-xl font-bold font-serif text-[#17212B]">Step 4: Photography & Virtual Tour</h3>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">Primary Image URL</label>
                <input
                  type="text"
                  value={formData.primaryImageUrl}
                  onChange={(e) => setFormData({ ...formData, primaryImageUrl: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">YouTube Virtual Tour Video ID</label>
                <input
                  type="text"
                  placeholder="e.g. dQw4w9WgXcQ"
                  value={formData.youtubeVideoId}
                  onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Agent & Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-[#17212B]">Step 5: Agent Assignment & Final Review</h3>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">Assign Responsible Agent</label>
                <select
                  value={formData.agentId}
                  onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-3 text-xs font-bold text-[#17212B] focus:outline-none"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-2xl border border-[#E7E5DF] text-xs space-y-2 text-[#17212B]">
                <div className="font-extrabold text-[#123B5D] text-sm">{formData.title || "Untitled"}</div>
                <div className="font-bold">Price: ₹{(formData.price || 0).toLocaleString()}</div>
                <div className="font-bold">Location: {formData.location?.locality}, {formData.location?.city}</div>
                <div className="font-semibold text-[#53606C]">Coordinates: {formData.location?.latitude}, {formData.location?.longitude}</div>
              </div>
            </div>
          )}

          {/* Bottom Pagination Controls */}
          <div className="pt-6 border-t border-[#E7E5DF] flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-[#F7F5F0] border border-[#E7E5DF] text-[#17212B] font-bold text-xs hover:bg-[#E7E5DF] disabled:opacity-30 transition-all"
            >
              Previous Step
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2 rounded-xl bg-[#123B5D] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md hover:bg-[#17212B]"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-6 py-2.5 rounded-xl bg-[#C7A76C] hover:bg-[#b09054] text-[#17212B] font-extrabold text-xs uppercase tracking-wider shadow-md"
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
