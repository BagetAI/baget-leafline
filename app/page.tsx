"use client";

import { useState, useEffect } from "react";
import { Leaf, ShieldCheck, MapPin, Star, ChevronRight, Loader2, Sparkles, AlertCircle, Award, Check, Search, Filter, PlusCircle, Upload, Eye, Mail, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlantListing {
  id: string;
  plant_name: string;
  variety: string;
  neighborhood: string;
  status: string;
  owner_email: string;
  image_url: string | null;
  cutting_size: string;
  credit_value: number;
  health_status: string;
  created_at: string;
}

// Preset plants with high-fidelity images for smooth UX cataloging
const PRESET_PLANTS = [
  {
    name: "Monstera Esqueleto",
    variety: "Deep Fenestrations",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Rooted Cutting"
  },
  {
    name: "Alocasia Silver Dragon (Variegated)",
    variety: "Mint Variegated",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Rooted Cutting"
  },
  {
    name: "Philodendron Spiritus Sancti",
    variety: "Long Narrow Foliage",
    imageUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Mature Plant"
  },
  {
    name: "Variegated Monstera Albo",
    variety: "Half-Moon Sectoral",
    imageUrl: "https://images.unsplash.com/photo-1612360424412-dc20392fec2f?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Rooted Cutting"
  },
  {
    name: "Alocasia Frydek Variegata",
    variety: "Velvet White Variegation",
    imageUrl: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Rooted Cutting"
  },
  {
    name: "Philodendron Gloriosum",
    variety: "Pink Margin Velvet",
    imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Rooted Cutting"
  },
  {
    name: "Anthurium Clarinervium",
    variety: "Glittering Silver Veins",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Mature Plant"
  },
  {
    name: "Epipremnum Pinnatum Albo",
    variety: "Sectoral Climber",
    imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&q=80&w=600",
    defaultSize: "Rooted Cutting"
  }
];

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    neighborhood: "",
    favorite_plant: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [signupCount, setSignupCount] = useState<number | null>(null);
  
  // Real-time Inventory State
  const [listings, setListings] = useState<PlantListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");

  // Plant Submission State
  const [submitForm, setSubmitForm] = useState({
    plant_name: "Monstera Esqueleto",
    variety: "Deep Fenestrations",
    neighborhood: "Silver Lake",
    owner_email: "",
    cutting_size: "Rooted Cutting",
    image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600",
    custom_plant_name: "",
    custom_variety: "",
    custom_image_url: "",
  });
  const [isCustomPlant, setIsCustomPlant] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [calculatedCredits, setCalculatedCredits] = useState(2);
  const [submittedPlantDetails, setSubmittedPlantDetails] = useState<any>(null);

  const DATABASE_ID = "bdd20dba-d6c6-4362-a9d2-e49e2921613c";
  const SUBSCRIPTION_URL = "https://app.baget.ai/api/platform/v1/pay/22059e1a-48ed-4d7e-a60f-857b02836594";
  const FOUNDING_MEMBER_URL = "https://app.baget.ai/api/platform/v1/pay/7f7920ae-05dc-4661-b010-4564a6dc878c";

  // Dynamic credit calculation on client side to mirror the backend logic
  useEffect(() => {
    const name = isCustomPlant ? submitForm.custom_plant_name : submitForm.plant_name;
    const variety = isCustomPlant ? submitForm.custom_variety : submitForm.variety;
    const fullName = `${name} ${variety}`.toLowerCase();

    if (
      fullName.includes("spiritus sancti") ||
      fullName.includes("variegated monstera albo") ||
      fullName.includes("albo") && fullName.includes("monstera") ||
      fullName.includes("silver dragon") && fullName.includes("variegated")
    ) {
      setCalculatedCredits(4);
    } else if (
      fullName.includes("esqueleto") ||
      fullName.includes("clarinervium") ||
      fullName.includes("obliqua") ||
      fullName.includes("frydek") ||
      fullName.includes("anthurium") ||
      fullName.includes("alocasia")
    ) {
      setCalculatedCredits(2);
    } else {
      setCalculatedCredits(1);
    }
  }, [submitForm.plant_name, submitForm.variety, submitForm.custom_plant_name, submitForm.custom_variety, isCustomPlant]);

  // Load waitlist signup count
  useEffect(() => {
    fetch(`https://app.baget.ai/api/public/databases/${DATABASE_ID}/count`)
      .then(res => res.json())
      .then(data => setSignupCount(data.count))
      .catch(() => {});
  }, []);

  // Fetch plant listings with parameters
  const fetchListings = () => {
    setLoadingListings(true);
    let url = "/api/plants/search";
    const params = new URLSearchParams();
    if (searchQuery) params.append("query", searchQuery);
    if (selectedNeighborhood !== "all") params.append("neighborhood", selectedNeighborhood);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setListings(data.listings);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingListings(false));
  };

  // Trigger search on query/neighborhood update
  useEffect(() => {
    fetchListings();
  }, [searchQuery, selectedNeighborhood]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(`https://app.baget.ai/api/public/databases/${DATABASE_ID}/rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", neighborhood: "", favorite_plant: "" });
        fetch(`https://app.baget.ai/api/public/databases/${DATABASE_ID}/count`)
          .then(res => res.json())
          .then(data => setSignupCount(data.count));
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  // Preset plant selector updates the preset fields instantly
  const handlePresetChange = (plantName: string) => {
    const selected = PRESET_PLANTS.find(p => p.name === plantName);
    if (selected) {
      setSubmitForm({
        ...submitForm,
        plant_name: selected.name,
        variety: selected.variety,
        image_url: selected.imageUrl,
        cutting_size: selected.defaultSize
      });
    }
  };

  const handlePlantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    setSubmitError("");

    const finalPlantName = isCustomPlant ? submitForm.custom_plant_name : submitForm.plant_name;
    const finalVariety = isCustomPlant ? submitForm.custom_variety : submitForm.variety;
    const finalImageUrl = isCustomPlant 
      ? (submitForm.custom_image_url || "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&q=80&w=600")
      : submitForm.image_url;

    if (!finalPlantName) {
      setSubmitError("Please provide a plant name.");
      setSubmitStatus("error");
      return;
    }

    if (!submitForm.owner_email) {
      setSubmitError("Your email address is required to track swap ledger ownership.");
      setSubmitStatus("error");
      return;
    }

    const payload = {
      plant_name: finalPlantName,
      variety: finalVariety || "Standard",
      neighborhood: `${submitForm.neighborhood} / 2026`, // structured neighborhood label
      owner_email: submitForm.owner_email,
      image_url: finalImageUrl,
      cutting_size: submitForm.cutting_size,
    };

    try {
      const response = await fetch("/api/plants/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setSubmittedPlantDetails(result.data);
        
        // Refresh catalog to instantly show the new cutting live!
        fetchListings();

        // Clear custom fields but keep owner email for convenient subsequent entries
        setSubmitForm({
          ...submitForm,
          custom_plant_name: "",
          custom_variety: "",
          custom_image_url: "",
        });
      } else {
        setSubmitError(result.error || "Submission failed. Please check the database integration.");
        setSubmitStatus("error");
      }
    } catch (error: any) {
      setSubmitError(error.message || "A network connection error occurred.");
      setSubmitStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF6F1]">
      {/* Navigation */}
      <nav className="p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#C4654A] rounded-full flex items-center justify-center text-[#FAF6F1]">
            <Leaf size={24} className="text-[#FAF6F1]" />
          </div>
          <span className="text-2xl font-heading tracking-tight text-[#3D2B1F] font-bold">LeafLine</span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="#membership" 
            className="hidden sm:inline-block text-sm font-semibold hover:text-[#C4654A] transition-colors text-[#3D2B1F]"
          >
            Club Membership
          </a>
          <a 
            href="#submit-plant" 
            className="hidden sm:inline-block text-sm font-semibold hover:text-[#C4654A] transition-colors text-[#3D2B1F]"
          >
            Submit Cutting
          </a>
          <a 
            href="#inventory" 
            className="hidden sm:inline-block text-sm font-semibold hover:text-[#C4654A] transition-colors text-[#3D2B1F]"
          >
            Live Inventory
          </a>
          <a 
            href={SUBSCRIPTION_URL} 
            className="bg-[#7D8B69] text-[#FAF6F1] px-6 py-3 rounded-3xl text-sm font-semibold hover:bg-[#6c7a59] transition-colors shadow-sm"
          >
            Subscribe ($1/mo)
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1 bg-[#7D8B69]/10 text-[#7D8B69] rounded-full text-sm font-bold mb-6">
            Hyper-Local Plant Swaps
          </div>
          <h1 className="text-5xl md:text-7xl font-heading leading-tight mb-6 text-[#3D2B1F]">
            Trade cuttings with neighbors you <span className="text-[#C4654A] italic text-6xl md:text-8xl">actually</span> trust.
          </h1>
          <p className="text-xl md:text-2xl text-[#3D2B1F]/80 mb-10 leading-relaxed max-w-xl">
            LeafLine is the neighborhood ledger for better plants. Swap safely with an active monthly membership or secure lifetime Founding Member status.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a 
              href={SUBSCRIPTION_URL} 
              className="bg-[#C4654A] text-[#FAF6F1] px-8 py-4 rounded-3xl text-lg font-bold flex items-center justify-center gap-2 warm-shadow hover:scale-[1.02] transition-transform"
            >
              Get Club Access ($1/mo) <ChevronRight size={20} />
            </a>
            {signupCount !== null && (
              <div className="flex items-center gap-2 px-6 py-4 text-[#3D2B1F]/60 italic">
                <Star size={18} className="text-[#C4654A] fill-[#C4654A]" />
                {signupCount + 42} gardeners already in line
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#7D8B69]/20 organic-blob -z-10 blur-3xl translate-x-10 translate-y-10"></div>
          <img 
            src="images/a-bright-airy-sun-drenched-interior-ap.png" 
            alt="Neighbors swapping plants in a cozy sunlit room" 
            className="rounded-3xl warm-shadow w-full object-cover aspect-[4/3]"
          />
        </motion.div>
      </section>

      {/* Plant Submission - Add to Digital Shelf Section */}
      <section id="submit-plant" className="py-20 px-6 bg-[#FAF6F1]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 warm-shadow border border-[#7D8B69]/10">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#7D8B69]/10 text-[#7D8B69] rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                <PlusCircle size={14} /> Add to Digital Shelf
              </span>
              <h2 className="text-3xl md:text-5xl font-heading text-[#3D2B1F]">Register Your Mother Plant</h2>
              <p className="text-sm md:text-base text-[#3D2B1F]/70 mt-3 max-w-xl mx-auto">
                List a specimen you want to propagate. Every cutting gets an automatic LeafPack credit value based on retail rarity and undergoes the AI Health Passport checks.
              </p>
            </div>

            {submitStatus === "success" && submittedPlantDetails ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#FAF6F1] p-6 md:p-8 rounded-2xl border border-[#7D8B69]/30 text-center"
              >
                <div className="w-16 h-16 bg-[#7D8B69] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-heading text-[#3D2B1F] mb-2">Listing Successfully Registered!</h3>
                <p className="text-sm text-[#3D2B1F]/70 mb-6 max-w-md mx-auto">
                  Your <strong className="text-[#3D2B1F]">{submittedPlantDetails.plant_name}</strong> is now live on the hyper-local ledger for <strong className="text-[#3D2B1F]">{submitForm.neighborhood}</strong>.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-[#7D8B69]/10 max-w-2xl mx-auto text-left mb-8">
                  <div>
                    <span className="block text-[10px] text-[#3D2B1F]/50 font-bold uppercase">Estimated Value</span>
                    <span className="font-heading text-lg text-[#C4654A] font-bold">
                      {submittedPlantDetails.credit_value} {submittedPlantDetails.credit_value === 1 ? "Credit" : "Credits"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#3D2B1F]/50 font-bold uppercase">Health Passport</span>
                    <span className="text-xs font-bold text-[#7D8B69] uppercase tracking-wider flex items-center gap-1 mt-1">
                      <ShieldCheck size={12} /> {submittedPlantDetails.health_status}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#3D2B1F]/50 font-bold uppercase">Cutting Size</span>
                    <span className="text-xs font-semibold text-[#3D2B1F]">{submittedPlantDetails.cutting_size}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#3D2B1F]/50 font-bold uppercase">Pod Pod ID</span>
                    <span className="text-xs font-mono text-[#3D2B1F]/70">{submittedPlantDetails.neighborhood.split(" / ")[0]}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setSubmitStatus("idle")}
                    className="bg-[#7D8B69] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-[#6c7a59] transition-colors"
                  >
                    Register Another Plant
                  </button>
                  <a 
                    href="#inventory"
                    className="bg-white text-[#3D2B1F] border border-[#3D2B1F]/20 px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-[#3D2B1F]/5 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size={16} /> View Active Pod Catalog
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handlePlantSubmit} className="space-y-6">
                {/* Taxonomy & Core Identification */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#3D2B1F] mb-2">Select Botanical Species</label>
                    <div className="relative">
                      {!isCustomPlant ? (
                        <select 
                          value={submitForm.plant_name}
                          onChange={(e) => handlePresetChange(e.target.value)}
                          className="w-full p-4 rounded-xl bg-[#FAF6F1] border border-[#7D8B69]/10 text-[#3D2B1F] font-semibold focus:ring-2 focus:ring-[#7D8B69] appearance-none"
                        >
                          {PRESET_PLANTS.map((plant) => (
                            <option key={plant.name} value={plant.name}>
                              {plant.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Philodendron Billietiae"
                          value={submitForm.custom_plant_name}
                          onChange={(e) => setSubmitForm({...submitForm, custom_plant_name: e.target.value})}
                          className="w-full p-4 rounded-xl bg-[#FAF6F1] border border-[#7D8B69]/10 text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:ring-2 focus:ring-[#7D8B69]"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-right">
                      <button 
                        type="button"
                        onClick={() => setIsCustomPlant(!isCustomPlant)}
                        className="text-xs font-bold text-[#C4654A] hover:underline"
                      >
                        {isCustomPlant ? "Choose from catalog presets" : "Input a custom rare plant"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#3D2B1F] mb-2">Plant Variety or Mutation</label>
                    <input 
                      type="text"
                      placeholder={isCustomPlant ? "e.g. Variegated, Mint, Aurea, Sport" : "Preset variety"}
                      disabled={!isCustomPlant}
                      value={isCustomPlant ? submitForm.custom_variety : submitForm.variety}
                      onChange={(e) => setSubmitForm({...submitForm, custom_variety: e.target.value})}
                      className="w-full p-4 rounded-xl bg-[#FAF6F1] border border-[#7D8B69]/10 text-[#3D2B1F] disabled:opacity-60 placeholder-[#3D2B1F]/40 focus:ring-2 focus:ring-[#7D8B69]"
                    />
                  </div>
                </div>

                {/* Local coordinates & Owner ID */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#3D2B1F] mb-2">Active Target Pod</label>
                    <select 
                      value={submitForm.neighborhood}
                      onChange={(e) => setSubmitForm({...submitForm, neighborhood: e.target.value})}
                      className="w-full p-4 rounded-xl bg-[#FAF6F1] border border-[#7D8B69]/10 text-[#3D2B1F] font-semibold focus:ring-2 focus:ring-[#7D8B69]"
                    >
                      <option value="Silver Lake">Silver Lake (90026)</option>
                      <option value="Park Slope">Park Slope (11215)</option>
                      <option value="East Austin">East Austin (78702)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#3D2B1F] mb-2">Cutting / Specimen Size</label>
                    <select 
                      value={submitForm.cutting_size}
                      onChange={(e) => setSubmitForm({...submitForm, cutting_size: e.target.value})}
                      className="w-full p-4 rounded-xl bg-[#FAF6F1] border border-[#7D8B69]/10 text-[#3D2B1F] font-semibold focus:ring-2 focus:ring-[#7D8B69]"
                    >
                      <option value="Small Node">Small Node (unrooted)</option>
                      <option value="Rooted Cutting">Rooted Cutting</option>
                      <option value="Mature Plant">Mature Plant (established)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#3D2B1F] mb-2 flex items-center gap-1">
                      <Mail size={14} className="text-[#3D2B1F]/50" /> Owner Email
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="gardener@example.com"
                      value={submitForm.owner_email}
                      onChange={(e) => setSubmitForm({...submitForm, owner_email: e.target.value})}
                      className="w-full p-4 rounded-xl bg-[#FAF6F1] border border-[#7D8B69]/10 text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:ring-2 focus:ring-[#7D8B69]"
                    />
                  </div>
                </div>

                {/* Digital Health Passport Photo Upload simulation */}
                <div className="bg-[#FAF6F1] p-6 rounded-2xl border border-[#7D8B69]/10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7D8B69] uppercase tracking-wider mb-2">
                    <ShieldCheck size={14} /> AI Health Passport Inspection standard
                  </span>
                  <p className="text-xs text-[#3D2B1F]/70 mb-4 leading-relaxed">
                    Upload a high-resolution closeup of the leaf undersides, stem junctions, and node area. This photo is parsed by our automated system to verify pest-free status before Swap Saturday meetups.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 items-center">
                    <div className="border-2 border-dashed border-[#7D8B69]/20 rounded-xl p-6 bg-white text-center hover:border-[#7D8B69]/40 transition-colors">
                      <Upload className="mx-auto text-[#7D8B69] mb-2" size={24} />
                      <span className="block text-xs font-bold text-[#3D2B1F]">Photo Upload Target</span>
                      <span className="block text-[10px] text-[#3D2B1F]/50 mt-1">Accepts JPG, PNG up to 10MB</span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#3D2B1F]">Image URL (Simulated/Unsplash)</label>
                      <input 
                        type="text"
                        placeholder="Automatic image assigned based on selection"
                        value={isCustomPlant ? submitForm.custom_image_url : submitForm.image_url}
                        onChange={(e) => {
                          if (isCustomPlant) {
                            setSubmitForm({...submitForm, custom_image_url: e.target.value});
                          } else {
                            setSubmitForm({...submitForm, image_url: e.target.value});
                          }
                        }}
                        className="w-full p-3 rounded-xl bg-white border border-[#7D8B69]/10 text-xs text-[#3D2B1F] focus:ring-2 focus:ring-[#7D8B69]"
                      />
                      <span className="block text-[10px] text-[#3D2B1F]/40">For custom plants, you can supply an image URL or let the platform allocate a high-quality preset specimen photo.</span>
                    </div>
                  </div>
                </div>

                {/* Sunk-Cost Credit Valuation & Submit Banner */}
                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#C4654A]/5 rounded-2xl border border-[#C4654A]/10 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#C4654A]/10 flex items-center justify-center text-[#C4654A] shrink-0">
                      <Award size={24} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-[#3D2B1F]/50 font-bold">Safe Swap Valuation</span>
                      <span className="text-sm font-bold text-[#3D2B1F] flex items-center gap-1">
                        Est. <strong className="text-lg text-[#C4654A] font-heading font-bold">{calculatedCredits} {calculatedCredits === 1 ? "Credit" : "Credits"}</strong> inside the ledger
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitStatus === "submitting"}
                    className="w-full md:w-auto bg-[#C4654A] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#b05a41] transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {submitStatus === "submitting" ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Vetting and listing...
                      </>
                    ) : (
                      <>
                        Confirm and Post cutting
                      </>
                    )}
                  </button>
                </div>

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={16} /> {submitError}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Real-time Inventory Section */}
      <section id="inventory" className="py-20 px-6 bg-[#F5EFE6] border-y border-[#7D8B69]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C4654A]/10 text-[#C4654A] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Live catalog
            </div>
            <h2 className="text-3xl md:text-5xl font-heading text-[#3D2B1F] mb-4">Active Pod Inventory</h2>
            <p className="text-lg text-[#3D2B1F]/70 max-w-2xl mx-auto">
              Real cuttings and mother plants currently registered in our active target pods. Inspect the ledger below.
            </p>
          </div>

          {/* Catalog Controls */}
          <div className="bg-white p-4 rounded-2xl warm-shadow border border-[#7D8B69]/10 mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2B1F]/40" size={18} />
              <input 
                type="text" 
                placeholder="Search plants (e.g. Alocasia, Esqueleto, Pothos)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FAF6F1] border-none rounded-xl focus:ring-2 focus:ring-[#7D8B69] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
              />
            </div>
            <div className="w-full md:w-1/3 flex items-center gap-2">
              <Filter className="text-[#3D2B1F]/50 shrink-0" size={18} />
              <select 
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full p-3 bg-[#FAF6F1] border-none rounded-xl text-[#3D2B1F] font-semibold"
              >
                <option value="all">All Neighborhoods</option>
                <option value="Silver Lake">Silver Lake (90026)</option>
                <option value="Park Slope">Park Slope (11215)</option>
                <option value="East Austin">East Austin (78702)</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          {loadingListings ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#3D2B1F]/50">
              <Loader2 className="animate-spin text-[#C4654A]" size={40} />
              <p className="font-semibold">Loading hyper-local catalog...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#7D8B69]/20 max-w-lg mx-auto">
              <AlertCircle className="mx-auto text-[#C4654A] mb-4" size={40} />
              <h3 className="text-xl font-heading mb-2">No listings found</h3>
              <p className="text-sm text-[#3D2B1F]/70">No plants matched your criteria. Use the cutting submission form above to register yours!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#7D8B69]/10 warm-shadow hover:scale-[1.01] transition-all flex flex-col justify-between"
                >
                  <div className="relative">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.plant_name}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="w-full h-56 bg-[#FAF6F1] flex items-center justify-center text-[#7D8B69]">
                        <Leaf size={48} className="opacity-30" />
                      </div>
                    )}
                    <span className="absolute top-4 right-4 bg-[#7D8B69] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} /> {item.health_status}
                    </span>
                    <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#3D2B1F] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                      <MapPin size={12} className="text-[#C4654A]" /> {item.neighborhood.split(" / ")[0]}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-xl font-heading text-[#3D2B1F] font-bold truncate">{item.plant_name}</h3>
                      <div className="bg-[#C4654A]/10 text-[#C4654A] text-xs font-bold px-2.5 py-1 rounded-lg shrink-0">
                        {item.credit_value} {item.credit_value === 1 ? "Credit" : "Credits"}
                      </div>
                    </div>
                    <p className="text-xs text-[#3D2B1F]/50 uppercase font-bold mb-4 tracking-wider">{item.variety}</p>
                    
                    <div className="border-t border-[#7D8B69]/10 pt-4 flex items-center justify-between text-xs text-[#3D2B1F]/70">
                      <div>
                        <span className="block text-[#3D2B1F]/40 font-bold uppercase text-[9px] tracking-wider">Cutting Size</span>
                        <span className="font-semibold">{item.cutting_size}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[#3D2B1F]/40 font-bold uppercase text-[9px] tracking-wider">Owner status</span>
                        <span className="font-semibold text-[#7D8B69]">Verified Member</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing / Membership Section */}
      <section id="membership" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7D8B69]/10 text-[#7D8B69] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Flexible On-Ramps
          </div>
          <h2 className="text-3xl md:text-5xl font-heading text-[#3D2B1F] mb-4">Choose Your Swap Experience</h2>
          <p className="text-lg text-[#3D2B1F]/70 max-w-2xl mx-auto">
            Support your local neighborhood pod. Get standard queue placement, subscribe to monthly swaps, or secure permanent Founding status.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
          {/* Card 1: Free Waitlist */}
          <div className="bg-white p-8 rounded-3xl border border-[#7D8B69]/10 flex flex-col justify-between hover:border-[#7D8B69]/30 transition-all warm-shadow">
            <div>
              <h3 className="text-2xl font-heading text-[#7D8B69] mb-2">Standard Waitlist</h3>
              <p className="text-sm text-[#3D2B1F]/70 mb-6">
                Join the general interest queue for your local 5-mile zip code pod.
              </p>
              <div className="text-3xl font-heading text-[#3D2B1F] mb-6">$0</div>
              <ul className="text-sm space-y-3 mb-8 text-[#3D2B1F]/80">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#7D8B69]" /> Standard queue placement
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#7D8B69]" /> Email pod launch updates
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#7D8B69]" /> Browse general catalog listings
                </li>
              </ul>
            </div>
            <a 
              href="#waitlist" 
              className="block text-center border-2 border-[#7D8B69] text-[#7D8B69] py-3.5 rounded-2xl font-bold text-sm hover:bg-[#7D8B69]/5 transition-colors"
            >
              Sign Up For Free
            </a>
          </div>

          {/* Card 2: Subscription Tier - HIGHLIGHTED AS THE MAIN CLUB SUBSCRIPTION */}
          <div className="bg-white p-8 rounded-3xl border-2 border-[#7D8B69] relative flex flex-col justify-between hover:scale-[1.01] transition-all warm-shadow">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7D8B69] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
              Most Popular
            </span>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-heading text-[#3D2B1F] font-bold">Monthly Swapper</h3>
                <span className="bg-[#7D8B69]/10 text-[#7D8B69] text-xs font-bold px-2.5 py-1 rounded-lg">
                  Recurring
                </span>
              </div>
              <p className="text-sm text-[#3D2B1F]/70 mb-6">
                Our core membership. Unlock full trading powers, reliability scores, and the AI Health Check.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-heading text-[#3D2B1F] font-bold">$1.00</span>
                <span className="text-[#3D2B1F]/60 text-sm">/ month</span>
              </div>
              <ul className="text-sm space-y-3 mb-8 text-[#3D2B1F]/80">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#7D8B69]" /> Unlimited localized swap trades
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#7D8B69]" /> Full AI Health Passport screenings
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#7D8B69]" /> Guaranteed swap-credit escrow protection
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#7D8B69]" /> Access premium & collector level exchanges
                </li>
              </ul>
            </div>
            <a 
              href={SUBSCRIPTION_URL} 
              className="block text-center bg-[#7D8B69] text-[#FAF6F1] py-3.5 rounded-2xl font-bold text-sm hover:bg-[#6c7a59] transition-colors warm-shadow"
            >
              Subscribe for $1.00/mo
            </a>
          </div>

          {/* Card 3: One-Time Founding Member Pass */}
          <div className="bg-white p-8 rounded-3xl border border-[#C4654A]/30 flex flex-col justify-between hover:border-[#C4654A]/60 transition-all warm-shadow">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-heading text-[#3D2B1F]">Founding Member</h3>
                <span className="bg-[#C4654A]/10 text-[#C4654A] text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Award size={12} /> Lifetime
                </span>
              </div>
              <p className="text-sm text-[#3D2B1F]/70 mb-6">
                Support local neighborhood launches. Lock in lifetime premium benefits and complete status.
              </p>
              <div className="text-3xl font-heading text-[#3D2B1F] mb-6">$5.00 <span className="text-xs font-sans text-[#3D2B1F]/50">one-time</span></div>
              <ul className="text-sm space-y-3 mb-8 text-[#3D2B1F]/80">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#C4654A]" /> Lifetime "Founding Gardener" badge
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#C4654A]" /> 3 free LeafPack swap credits upon launch
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#C4654A]" /> Guarantee priority launch weight
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#C4654A]" /> Complete printable label & signage kit
                </li>
              </ul>
            </div>
            <a 
              href={FOUNDING_MEMBER_URL} 
              className="block text-center bg-[#C4654A] text-[#FAF6F1] py-3.5 rounded-2xl font-bold text-sm hover:bg-[#b05a41] transition-colors warm-shadow"
            >
              Get Founding Pass ($5)
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2 justify-center max-w-xl mx-auto text-left text-xs text-[#3D2B1F]/60">
          <AlertCircle size={16} className="text-[#C4654A] shrink-0 mt-0.5" />
          <p>
            Memberships and Founding Pass purchases directly fund local pod propagation tools, labels, and Captain safety packages. Your local pod requires active community nodes to schedule group meetups. Secured via Baget.
          </p>
        </div>
      </section>

      {/* Features / Safeguards */}
      <section className="bg-white py-24 px-6 border-y border-[#7D8B69]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading mb-4 text-[#3D2B1F]">The Private Club Protocol</h2>
            <p className="text-lg text-[#3D2B1F]/70 max-w-2xl mx-auto">
              We've replaced the chaos of Facebook groups with three pillars of botanical trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="text-[#C4654A]" size={32} />}
              title="AI Health Passport"
              description="Every cutting is vetted by AI photo analysis to ensure it's free of thrips, mites, and stowaways before the swap."
            />
            <FeatureCard 
              icon={<MapPin className="text-[#C4654A]" size={32} />}
              title="5-Mile Pods"
              description="We only open zip codes with verified local interest. Trade with neighbors down the street, not across the city."
            />
            <FeatureCard 
              icon={<Star className="text-[#C4654A]" size={32} />}
              title="Reliability Ledger"
              description="Our QR Handshake protocol builds real public reputation. Show up, complete swaps, and unlock rare collector exchanges."
            />
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist" className="py-24 px-6 max-w-3xl mx-auto text-center">
        <div className="bg-[#fffdfb] p-8 md:p-12 rounded-3xl warm-shadow border border-[#7D8B69]/10">
          <h2 className="text-4xl font-heading mb-6 text-[#3D2B1F]">Join the Founding Circle</h2>
          <p className="text-lg text-[#3D2B1F]/70 mb-10">
            We are launching in 5 target neighborhoods this summer. Sign up to reserve your spot and claim neighborhood status.
          </p>

          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12"
            >
              <div className="w-20 h-20 bg-[#7D8B69] text-[#FAF6F1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf size={40} className="text-[#FAF6F1]" />
              </div>
              <h3 className="text-3xl font-heading mb-2 text-[#3D2B1F]">You're on the list!</h3>
              <p className="text-[#3D2B1F]/70 mb-8">Your local spot is recorded. To support our rollout and immediately unlock unlimited swaps, activate your membership or claim a founding pass.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-md mx-auto">
                <a 
                  href={SUBSCRIPTION_URL}
                  className="bg-[#7D8B69] text-white px-6 py-4 rounded-3xl font-bold hover:bg-[#6c7a59] transition-colors warm-shadow text-base flex-1 text-center flex items-center justify-center"
                >
                  Subscribe ($1/mo)
                </a>
                <a 
                  href={FOUNDING_MEMBER_URL}
                  className="bg-[#C4654A] text-white px-6 py-4 rounded-3xl font-bold hover:bg-[#b05a41] transition-colors warm-shadow text-base flex-1 text-center flex items-center justify-center"
                >
                  Founding Pass ($5)
                </a>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-4 text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1 text-[#3D2B1F]">Your Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Jane Doe"
                    className="w-full p-4 rounded-2xl bg-[#FAF6F1] border-none focus:ring-2 focus:ring-[#7D8B69] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1 text-[#3D2B1F]">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="jane@example.com"
                    className="w-full p-4 rounded-2xl bg-[#FAF6F1] border-none focus:ring-2 focus:ring-[#7D8B69] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 ml-1 text-[#3D2B1F]">Your Neighborhood / Zip Code</label>
                <input 
                  required
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  placeholder="Silver Lake / 90026"
                  className="w-full p-4 rounded-2xl bg-[#FAF6F1] border-none focus:ring-2 focus:ring-[#7D8B69] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 ml-1 text-[#3D2B1F]">What's your favorite plant?</label>
                <input 
                  required
                  type="text"
                  value={formData.favorite_plant}
                  onChange={(e) => setFormData({...formData, favorite_plant: e.target.value})}
                  placeholder="Monstera deliciosa"
                  className="w-full p-4 rounded-2xl bg-[#FAF6F1] border-none focus:ring-2 focus:ring-[#7D8B69] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
                />
              </div>
              
              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#C4654A] text-[#FAF6F1] py-5 rounded-2xl text-xl font-bold mt-6 hover:bg-[#b05a41] transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" /> Cataloging...
                  </>
                ) : "Request Invitation"}
              </button>
              
              {status === "error" && (
                <p className="text-red-500 text-sm mt-2 text-center">Something went wrong. Please try again.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#7D8B69]/10 text-center text-[#3D2B1F]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf size={18} />
            <span className="font-heading text-lg text-[#3D2B1F]">LeafLine</span>
          </div>
          <p>© 2026 LeafLine. Growing community, one cutting at a time.</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-[#C4654A] text-[#3D2B1F]/50">Privacy</a>
            <a href="#" className="hover:text-[#C4654A] text-[#3D2B1F]/50">Terms</a>
            <a href="mailto:samuel@baget.ai" className="hover:text-[#C4654A] text-[#3D2B1F]/50">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#FAF6F1] p-10 rounded-3xl border border-[#7D8B69]/5 hover:border-[#7D8B69]/20 transition-colors text-center md:text-left">
      <div className="mb-6 flex justify-center md:justify-start">{icon}</div>
      <h3 className="text-2xl font-heading mb-4 text-[#3D2B1F]">{title}</h3>
      <p className="text-[#3D2B1F]/70 leading-relaxed">{description}</p>
    </div>
  );
}
