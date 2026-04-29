"use client";

import { useState, useEffect } from "react";
import { Leaf, ShieldCheck, MapPin, Star, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    neighborhood: "",
    favorite_plant: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [signupCount, setSignupCount] = useState<number | null>(null);

  const DATABASE_ID = "bdd20dba-d6c6-4362-a9d2-e49e2921613c";

  useEffect(() => {
    fetch(`https://app.baget.ai/api/public/databases/${DATABASE_ID}/count`)
      .then(res => res.json())
      .then(data => setSignupCount(data.count))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
        // Refresh count
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

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center text-linen">
            <Leaf size={24} />
          </div>
          <span className="text-2xl font-heading tracking-tight">LeafLine</span>
        </div>
        <a 
          href="#waitlist" 
          className="bg-sage text-linen px-6 py-3 rounded-3xl font-semibold hover:bg-[#6c7a59] transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1 bg-sage/10 text-sage rounded-full text-sm font-bold mb-6">
            Hyper-Local Plant Exchanges
          </div>
          <h1 className="text-5xl md:text-7xl font-heading leading-tight mb-6">
            Trade cuttings with neighbors you <span className="text-terracotta italic text-6xl md:text-8xl">actually</span> trust.
          </h1>
          <p className="text-xl md:text-2xl text-brown/80 mb-10 leading-relaxed max-w-xl">
            LeafLine is the neighborhood ledger for better plants. No more ghosting, no more pests—just high-trust local gardening.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#waitlist" 
              className="bg-terracotta text-linen px-8 py-4 rounded-3xl text-lg font-bold flex items-center justify-center gap-2 warm-shadow hover:scale-[1.02] transition-transform"
            >
              Reserve Your Spot <ChevronRight size={20} />
            </a>
            {signupCount !== null && (
              <div className="flex items-center gap-2 px-6 py-4 text-brown/60 italic">
                <Star size={18} className="text-terracotta fill-terracotta" />
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
          <div className="absolute inset-0 bg-sage/20 organic-blob -z-10 blur-3xl translate-x-10 translate-y-10"></div>
          <img 
            src="images/a-bright-airy-sun-drenched-interior-ap.png" 
            alt="Neighbors swapping plants in a cozy sunlit room" 
            className="rounded-3xl warm-shadow w-full object-cover aspect-[4/3]"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-linen py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading mb-4">The Private Club Protocol</h2>
            <p className="text-lg text-brown/70 max-w-2xl mx-auto">
              We've replaced the chaos of Facebook groups with three pillars of botanical trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="text-terracotta" size={32} />}
              title="Health Passport"
              description="Every cutting is vetted by AI photo analysis to ensure it's free of thrips, mites, and stowaways."
            />
            <FeatureCard 
              icon={<MapPin className="text-terracotta" size={32} />}
              title="5-Mile Pods"
              description="We only open zip codes with enough density. Trade within a walk or short bike ride."
            />
            <FeatureCard 
              icon={<Star className="text-terracotta" size={32} />}
              title="Reliability Scores"
              description="Our QR Handshake protocol builds public reputation. Show up, get points, unlock rare swaps."
            />
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section id="waitlist" className="py-24 px-6 max-w-3xl mx-auto text-center">
        <div className="bg-[#fffdfb] p-8 md:p-12 rounded-3xl warm-shadow border border-sage/10">
          <h2 className="text-4xl font-heading mb-6">Join the Founding Circle</h2>
          <p className="text-lg text-brown/70 mb-10">
            We are launching in 5 target neighborhoods this summer. Sign up to claim your status as a Neighborhood Captain.
          </p>

          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12"
            >
              <div className="w-20 h-20 bg-sage text-linen rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf size={40} />
              </div>
              <h3 className="text-3xl font-heading mb-2">You're on the list!</h3>
              <p className="text-brown/70">Check your inbox. We'll reach out when your neighborhood pod is ready to sprout.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Your Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Jane Doe"
                    className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="jane@example.com"
                    className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 ml-1">Your Neighborhood / Zip Code</label>
                <input 
                  required
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  placeholder="Silver Lake / 90026"
                  className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 ml-1">What's your favorite plant?</label>
                <input 
                  required
                  type="text"
                  value={formData.favorite_plant}
                  onChange={(e) => setFormData({...formData, favorite_plant: e.target.value})}
                  placeholder="Monstera deliciosa"
                  className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage"
                />
              </div>
              
              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-terracotta text-linen py-5 rounded-2xl text-xl font-bold mt-6 hover:bg-[#b05a41] transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
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
      <footer className="py-12 px-6 border-t border-sage/10 text-center text-brown/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf size={18} />
            <span className="font-heading text-lg">LeafLine</span>
          </div>
          <p>© 2026 LeafLine. Growing community, one cutting at a time.</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-terracotta">Privacy</a>
            <a href="#" className="hover:text-terracotta">Terms</a>
            <a href="mailto:samuel@baget.ai" className="hover:text-terracotta">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-linen p-10 rounded-3xl border border-sage/5 hover:border-sage/20 transition-colors text-center md:text-left">
      <div className="mb-6 flex justify-center md:justify-start">{icon}</div>
      <h3 className="text-2xl font-heading mb-4">{title}</h3>
      <p className="text-brown/70 leading-relaxed">{description}</p>
    </div>
  );
}