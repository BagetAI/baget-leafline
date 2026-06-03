"use client";

import { useState, useEffect } from "react";
import { Leaf, ShieldCheck, MapPin, Star, ChevronRight, Loader2, Sparkles, AlertCircle, Heart } from "lucide-react";
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
  const SUBSCRIPTION_URL = "https://app.baget.ai/api/platform/v1/pay/8414d6ed-a0d9-4380-bd51-8d9c676bb5fa";
  const PRIORITY_PASS_URL = "https://app.baget.ai/api/platform/v1/pay/bcab44c7-4603-4e51-b0cc-99eb9939a922";

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
    <main className="min-h-screen bg-[#FAF6F1]">
      {/* Navigation */}
      <nav className="p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center text-linen">
            <Leaf size={24} className="text-[#FAF6F1]" />
          </div>
          <span className="text-2xl font-heading tracking-tight text-brown">LeafLine</span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="#membership" 
            className="hidden sm:inline-block text-sm font-semibold hover:text-terracotta transition-colors text-brown"
          >
            Club Membership
          </a>
          <a 
            href="#membership" 
            className="bg-sage text-[#FAF6F1] px-6 py-3 rounded-3xl text-sm font-semibold hover:bg-[#6c7a59] transition-colors"
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
          <div className="inline-block px-4 py-1 bg-sage/10 text-sage rounded-full text-sm font-bold mb-6">
            Hyper-Local Plant Exchanges
          </div>
          <h1 className="text-5xl md:text-7xl font-heading leading-tight mb-6 text-brown">
            Trade cuttings with neighbors you <span className="text-terracotta italic text-6xl md:text-8xl">actually</span> trust.
          </h1>
          <p className="text-xl md:text-2xl text-brown/80 mb-10 leading-relaxed max-w-xl">
            LeafLine is the neighborhood ledger for better plants. Swap safely with a local $1/month club membership or join our standard queue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a 
              href="#membership" 
              className="bg-terracotta text-[#FAF6F1] px-8 py-4 rounded-3xl text-lg font-bold flex items-center justify-center gap-2 warm-shadow hover:scale-[1.02] transition-transform"
            >
              Get Club Access ($1/mo) <ChevronRight size={20} />
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

      {/* Pricing / Membership Section */}
      <section id="membership" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Flexible On-Ramps
          </div>
          <h2 className="text-3xl md:text-5xl font-heading text-brown mb-4">Choose Your Swap Experience</h2>
          <p className="text-lg text-brown/70 max-w-2xl mx-auto">
            Support your local neighborhood pod. Get standard queue placement or subscribe to unlock active, pest-free club exchanges.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
          {/* Card 1: Free Waitlist */}
          <div className="bg-white p-8 rounded-3xl border border-sage/10 flex flex-col justify-between hover:border-sage/30 transition-all warm-shadow">
            <div>
              <h3 className="text-2xl font-heading text-sage mb-2">Standard Waitlist</h3>
              <p className="text-sm text-brown/70 mb-6">
                Join the general interest queue for your local 5-mile zip code pod.
              </p>
              <div className="text-3xl font-heading text-brown mb-6">$0</div>
              <ul className="text-sm space-y-3 mb-8 text-brown/80">
                <li className="flex items-center gap-2">
                  <span className="text-sage font-bold">•</span> Standard queue placement
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage font-bold">•</span> Email pod launch updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage font-bold">•</span> Browse general catalog listings
                </li>
              </ul>
            </div>
            <a 
              href="#waitlist" 
              className="block text-center border-2 border-sage text-sage py-3.5 rounded-2xl font-bold text-sm hover:bg-sage/5 transition-colors"
            >
              Sign Up For Free
            </a>
          </div>

          {/* Card 2: Subscription Tier (Primary) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-terracotta relative flex flex-col justify-between hover:scale-[1.01] transition-all warm-shadow">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
              Most Popular
            </span>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-heading text-brown">Monthly Swapper</h3>
                <span className="bg-sage/10 text-sage text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Heart size={12} className="fill-sage" /> Unlimited
                </span>
              </div>
              <p className="text-sm text-brown/70 mb-6">
                Our core membership. Unlock full trading powers, reliability score, and AI Health Check.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-heading text-brown">$1.00</span>
                <span className="text-brown/60 text-sm">/ month</span>
              </div>
              <ul className="text-sm space-y-3 mb-8 text-brown/80">
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">•</span> Unlimited localized swap trades
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">•</span> Full AI Health Passport screenings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">•</span> Guaranteed swap-credit escrow protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">•</span> Access premium & collector level exchanges
                </li>
              </ul>
            </div>
            <a 
              href={SUBSCRIPTION_URL} 
              className="block text-center bg-terracotta text-[#FAF6F1] py-3.5 rounded-2xl font-bold text-sm hover:bg-[#b05a41] transition-colors warm-shadow"
            >
              Subscribe for $1.00/mo
            </a>
          </div>

          {/* Card 3: One-Time Priority Pass */}
          <div className="bg-white p-8 rounded-3xl border border-sage/10 flex flex-col justify-between hover:border-sage/30 transition-all warm-shadow">
            <div>
              <h3 className="text-2xl font-heading text-brown mb-2">Priority Launch Pass</h3>
              <p className="text-sm text-brown/70 mb-6">
                A single contribution that adds massive weighting to help launch your local 5-mile boundary.
              </p>
              <div className="text-3xl font-heading text-brown mb-6">$1.00 <span className="text-xs font-sans text-brown/50">one-time</span></div>
              <ul className="text-sm space-y-3 mb-8 text-brown/80">
                <li className="flex items-center gap-2">
                  <span className="text-sage font-bold">•</span> Lifetime "Founding Gardener" badge
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage font-bold">•</span> Direct support to local Captain print budget
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage font-bold">•</span> High-priority launch queue weighting
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage font-bold">•</span> Digital kit of LeafLine printable labels
                </li>
              </ul>
            </div>
            <a 
              href={PRIORITY_PASS_URL} 
              className="block text-center border-2 border-brown text-brown py-3.5 rounded-2xl font-bold text-sm hover:bg-brown/5 transition-colors"
            >
              Get Priority Pass ($1.00)
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2 justify-center max-w-xl mx-auto text-left text-xs text-brown/60">
          <AlertCircle size={16} className="text-terracotta shrink-0 mt-0.5" />
          <p>
            Memberships directly fund local pod propagation tools, labels, and Captain safety packages. Your local pod requires active community nodes to schedule group meetups. Cancel anytime. Secured via Baget.
          </p>
        </div>
      </section>

      {/* Features / Safeguards */}
      <section className="bg-white py-24 px-6 border-y border-sage/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading mb-4 text-brown">The Private Club Protocol</h2>
            <p className="text-lg text-brown/70 max-w-2xl mx-auto">
              We've replaced the chaos of Facebook groups with three pillars of botanical trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="text-terracotta" size={32} />}
              title="AI Health Passport"
              description="Every cutting is vetted by AI photo analysis to ensure it's free of thrips, mites, and stowaways before the swap."
            />
            <FeatureCard 
              icon={<MapPin className="text-terracotta" size={32} />}
              title="5-Mile Pods"
              description="We only open zip codes with verified local interest. Trade with neighbors down the street, not across the city."
            />
            <FeatureCard 
              icon={<Star className="text-terracotta" size={32} />}
              title="Reliability Ledger"
              description="Our QR Handshake protocol builds real public reputation. Show up, complete swaps, and unlock rare collector exchanges."
            />
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist" className="py-24 px-6 max-w-3xl mx-auto text-center">
        <div className="bg-[#fffdfb] p-8 md:p-12 rounded-3xl warm-shadow border border-sage/10">
          <h2 className="text-4xl font-heading mb-6 text-brown">Join the Founding Circle</h2>
          <p className="text-lg text-brown/70 mb-10">
            We are launching in 5 target neighborhoods this summer. Sign up to reserve your spot and claim neighborhood status.
          </p>

          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12"
            >
              <div className="w-20 h-20 bg-sage text-[#FAF6F1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf size={40} className="text-[#FAF6F1]" />
              </div>
              <h3 className="text-3xl font-heading mb-2 text-brown">You're on the list!</h3>
              <p className="text-brown/70">Check your inbox. We'll reach out when your neighborhood pod is ready to sprout.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1 text-brown">Your Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Jane Doe"
                    className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage text-brown placeholder-brown/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1 text-brown">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="jane@example.com"
                    className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage text-brown placeholder-brown/40"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 ml-1 text-brown">Your Neighborhood / Zip Code</label>
                <input 
                  required
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  placeholder="Silver Lake / 90026"
                  className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage text-brown placeholder-brown/40"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 ml-1 text-brown">What's your favorite plant?</label>
                <input 
                  required
                  type="text"
                  value={formData.favorite_plant}
                  onChange={(e) => setFormData({...formData, favorite_plant: e.target.value})}
                  placeholder="Monstera deliciosa"
                  className="w-full p-4 rounded-2xl bg-linen border-none focus:ring-2 focus:ring-sage text-brown placeholder-brown/40"
                />
              </div>
              
              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-terracotta text-[#FAF6F1] py-5 rounded-2xl text-xl font-bold mt-6 hover:bg-[#b05a41] transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
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
            <span className="font-heading text-lg text-brown">LeafLine</span>
          </div>
          <p>© 2026 LeafLine. Growing community, one cutting at a time.</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-terracotta text-brown/50">Privacy</a>
            <a href="#" className="hover:text-terracotta text-brown/50">Terms</a>
            <a href="mailto:samuel@baget.ai" className="hover:text-terracotta text-brown/50">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#FAF6F1] p-10 rounded-3xl border border-sage/5 hover:border-sage/20 transition-colors text-center md:text-left">
      <div className="mb-6 flex justify-center md:justify-start">{icon}</div>
      <h3 className="text-2xl font-heading mb-4 text-brown">{title}</h3>
      <p className="text-brown/70 leading-relaxed">{description}</p>
    </div>
  );
}