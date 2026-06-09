"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import {
  Sprout,
  TrendingUp,
  Droplet,
  Settings,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Shield,
  Smartphone,
  Database,
  BarChart3,
  Users
} from "lucide-react";

interface LandingPageClientProps {
  user: User | null;
}

export default function LandingPageClient({ user }: LandingPageClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Where can BhumiCare sensors be installed?",
      a: "BhumiCare outdoor units can be installed in open fields, tea gardens, polyhouses, orchards, and trial plots. Our team will help you design an installation plan tailored to your soil type and crop mix."
    },
    {
      q: "Do I need constant internet connectivity on the farm?",
      a: "Sensors use built‑in LTE or LoRaWAN where available and buffer data if connectivity drops. The dashboard automatically updates once the connection is restored."
    },
    {
      q: "Which crops are currently supported?",
      a: "Our crop models currently cover key staples such as tea, wheat, rice, maize, soybean, cotton, and potatoes, with specialized advanced diagnostics optimized for tea cultivation in Northeast India."
    },
    {
      q: "How do pilots and pricing work?",
      a: "We typically start with a limited-acre pilot to prove value within one season. Pricing depends on the number of sensors, fields, and the level of support required. Contact us to design a pilot program."
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-text-primary flex flex-col selection:bg-accent-wash selection:text-primary">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="#top" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors">
              BhumiCare <span className="text-accent">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-text-secondary">
            <a href="#product" className="hover:text-text-primary transition-colors">Product</a>
            <a href="#dashboard" className="hover:text-text-primary transition-colors">Dashboard</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">How it works</a>
            <a href="#use-cases" className="hover:text-text-primary transition-colors">Use cases</a>
            <a href="#about" className="hover:text-text-primary transition-colors">About</a>
            <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-text-primary transition-colors">Contact</a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-light shadow-md transition-all active:scale-[0.98]"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-bold text-text-primary hover:text-accent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-full gradient-button text-white font-bold text-sm hover:opacity-90 shadow-lg shadow-accent/15 transition-all active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border-light transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-6 space-y-3 animate-fade-in">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-text-secondary hover:bg-border-light hover:text-text-primary transition-colors"
            >
              Product
            </a>
            <a
              href="#dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-text-secondary hover:bg-border-light hover:text-text-primary transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-text-secondary hover:bg-border-light hover:text-text-primary transition-colors"
            >
              How it works
            </a>
            <a
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-text-secondary hover:bg-border-light hover:text-text-primary transition-colors"
            >
              Use cases
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-text-secondary hover:bg-border-light hover:text-text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-text-secondary hover:bg-border-light hover:text-text-primary transition-colors"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-text-secondary hover:bg-border-light hover:text-text-primary transition-colors"
            >
              Contact
            </a>

            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary-light shadow-md transition-all active:scale-[0.98]"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-2xl border border-border text-base font-bold text-text-primary hover:bg-border-light transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-2xl gradient-button text-white font-bold text-base hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main id="top" className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
          {/* Background Sage blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[10%] right-[-10%] w-[550px] h-[550px] bg-accent-wash rounded-full blur-[120px] opacity-75 animate-pulse-soft" />
            <div className="absolute bottom-[10%] left-[-15%] w-[650px] h-[650px] bg-accent-pale rounded-full blur-[140px] opacity-50" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Hero Copy */}
              <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-wash text-accent font-semibold text-sm border border-accent/10">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  Smarter soil. Stronger yields.
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-[1.15]">
                  Intelligent IoT soil health monitoring for{" "}
                  <span className="text-accent relative inline-block">
                    confident crop
                  </span>{" "}
                  decisions.
                </h1>

                <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
                  BhumiCare places rugged IoT sensing devices directly in your field, continuously reading ground conditions and turning them into clear, actionable recommendations on what to add to your soil and which crops will thrive.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={user ? "/dashboard" : "/signup"}
                    className="px-8 py-4 rounded-2xl gradient-button text-white font-bold text-base hover:opacity-95 shadow-xl shadow-accent/25 transition-all hover:translate-y-[-2px] active:translate-y-0"
                  >
                    {user ? "Go to Dashboard" : "Join the Wishlist"}
                  </Link>
                  <a
                    href="#contact"
                    className="px-8 py-4 rounded-2xl border border-border bg-white text-text-primary font-bold text-base hover:bg-surface-hover transition-all hover:translate-y-[-2px] active:translate-y-0"
                  >
                    Contact us
                  </a>
                </div>

                {/* Hero Stats badges */}
                <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border w-full">
                  <div>
                    <span className="block text-3xl font-extrabold text-primary">25%</span>
                    <span className="text-xs text-text-secondary font-medium">Higher Yield per Acre*</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-extrabold text-primary">Zero</span>
                    <span className="text-xs text-text-secondary font-medium">Input Fertiliser Waste</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-extrabold text-primary">24/7</span>
                    <span className="text-xs text-text-secondary font-medium">Continuous Monitoring</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual Preview */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  
                  {/* Floating Tag 1 */}
                  <div className="absolute top-[8%] left-[-8%] bg-white/95 backdrop-blur-sm border border-border shadow-xl px-4 py-2.5 rounded-2xl flex items-center gap-2 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                    <span className="text-xs font-bold text-text-primary">Real-time alerts</span>
                  </div>

                  {/* Floating Tag 2 */}
                  <div className="absolute bottom-[10%] right-[-5%] bg-white/95 backdrop-blur-sm border border-border shadow-xl px-4 py-2.5 rounded-2xl flex items-center gap-2 z-20 animate-bounce" style={{ animationDuration: '5s' }}>
                    <Sprout className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold text-text-primary">AI crop suggestions</span>
                  </div>

                  {/* IoT Device Preview Card */}
                  <div className="glass-card-strong p-6 relative z-10 border-border bg-white/80 shadow-2xl translate-x-[-15px] translate-y-[-20px] hover:translate-y-[-25px] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold text-xs">IoT Sensor</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-1">BhumiCare Probe V1</h3>
                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                      Rugged agritech device living in your soil. Sensors monitor NPK, pH, EC, moisture, and temperature.
                    </p>
                    <div className="h-24 relative overflow-hidden rounded-xl bg-surface flex items-center justify-center border border-border-light">
                      <Image
                        src="/bhumicare-logo.png"
                        alt="BhumiCare Logo"
                        width={60}
                        height={60}
                        className="object-contain opacity-85 scale-120"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Soil Health Metric Card */}
                  <div className="glass-card p-5 absolute bottom-[-30px] left-[-20px] w-[280px] z-20 border-border bg-white shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold tracking-wide uppercase text-text-secondary">Dashboard Live</span>
                      <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-text-secondary">Soil Moisture</span>
                          <span className="text-accent font-bold">68%</span>
                        </div>
                        <div className="w-full bg-border-light h-2 rounded-full overflow-hidden">
                          <div className="bg-accent h-full rounded-full" style={{ width: '68%' }} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1 border-t border-border-light">
                        <span className="text-text-secondary font-medium">Soil pH Level</span>
                        <span className="font-bold text-primary">6.4 (Optimal)</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-accent-wash/60 border border-accent/10 text-[10px] text-accent font-medium leading-relaxed">
                        <strong>Action Suggested:</strong> Apply NPK 10-26-26 within 3 days for paddy cultivation.
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* THE PRODUCT STACK */}
        <section id="product" className="py-24 bg-white border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                The BhumiCare Sensing Stack
              </h2>
              <p className="text-lg text-text-secondary">
                From ground to cloud to clear decisions – everything you need in a single, integrated agritech platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Product 1 */}
              <div className="glass-card p-8 border-border bg-surface-card hover:translate-y-[-4px] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-accent-wash text-accent flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">BhumiCare Outdoor Unit</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Intelligent soil sensor array that continuously monitors moisture, temperature, pH, EC, and macronutrients exactly where roots live.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    Multi-depth soil probes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    Weather-proof & farm-ready design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    Over-the-air firmware updates
                  </li>
                </ul>
              </div>

              {/* Product 2 */}
              <div className="glass-card p-8 border-border bg-surface-card hover:translate-y-[-4px] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-accent-wash text-accent flex items-center justify-center mb-6">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">BhumiCloud™ Data Engine</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Secure cloud pipeline that cleans, enriches, and correlates sensor readings with weather reports, historical parameters, and advanced agronomy crop models.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    High-frequency streaming data ingestion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    Historical trend analysis databases
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    APIs for agronomy & cultivation partners
                  </li>
                </ul>
              </div>

              {/* Product 3 */}
              <div className="glass-card p-8 border-border bg-surface-card hover:translate-y-[-4px] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-accent-wash text-accent flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Recommendation Dashboard</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Access soil insights and AI-driven recommendations on any device. Available for web, Android, iOS, and feature keypad phones.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    Per-field real-time health scores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    Precise input & irrigation windows
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    Crop suitability rankings & metrics
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* FARMER DASHBOARD MOCK */}
        <section id="dashboard" className="py-24 bg-surface relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left text */}
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight leading-tight">
                  A dashboard farmers actually enjoy using.
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  No more spreadsheets or guesswork. Access BhumiCare recommendations on web, Android, iOS, or feature keypad phones. Get a clean, visual snapshot of what is happening in your soil – and what to do next.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-wash flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">Actionable soil suggestions</h4>
                      <p className="text-xs text-text-secondary mt-1">Get precise guidance on exact fertiliser dosage, irrigation times, and soil amendments.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-wash flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">Multilingual support</h4>
                      <p className="text-xs text-text-secondary mt-1">Fully translated interfaces and SMS advisors designed for Assamese, Hindi, and English users.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Dashboard Mockup UI */}
              <div className="lg:col-span-7">
                <div className="glass-card-strong bg-white border-border shadow-2xl overflow-hidden animate-slide-up">
                  {/* Mockup header */}
                  <div className="px-6 py-4 bg-primary text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-extrabold text-sm">
                        B
                      </div>
                      <span className="font-bold text-sm tracking-tight text-white/90">Field Overview — Kharif 2025</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent text-white">Live Data</span>
                  </div>

                  {/* Mockup content */}
                  <div className="p-6 bg-surface/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      
                      {/* Soil Health ring */}
                      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col items-center text-center">
                        <h4 className="text-xs font-extrabold text-text-secondary mb-3 uppercase tracking-wider">Health Score</h4>
                        <div className="w-20 h-20 rounded-full border-4 border-accent border-r-transparent flex items-center justify-center relative">
                          <span className="text-2xl font-black text-primary">82</span>
                          <span className="text-[10px] text-text-secondary absolute bottom-2.5">/100</span>
                        </div>
                        <p className="text-[10px] text-text-secondary font-medium mt-2">
                          Healthy soil. Minor K deficit.
                        </p>
                      </div>

                      {/* parameters list */}
                      <div className="bg-white p-4 rounded-2xl border border-border">
                        <h4 className="text-xs font-extrabold text-text-secondary mb-3 uppercase tracking-wider">Key Soil Metrics</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-border-light">
                            <span className="text-text-secondary font-medium">Moisture</span>
                            <span className="font-extrabold text-accent bg-accent-wash px-2 py-0.5 rounded-full text-[10px]">68%</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-border-light">
                            <span className="text-text-secondary font-medium">pH Level</span>
                            <span className="font-extrabold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-[10px]">6.4</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-text-secondary font-medium">Potassium (K)</span>
                            <span className="font-extrabold text-danger bg-danger/5 px-2 py-0.5 rounded-full text-[10px]">Low</span>
                          </div>
                        </div>
                      </div>

                      {/* Suitability Ranking */}
                      <div className="bg-white p-4 rounded-2xl border border-border">
                        <h4 className="text-xs font-extrabold text-text-secondary mb-3 uppercase tracking-wider">Crop Rankings</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-border-light">
                            <span className="text-text-primary font-semibold">Maize</span>
                            <span className="font-extrabold text-accent">94%</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-border-light">
                            <span className="text-text-primary font-semibold">Paddy</span>
                            <span className="font-extrabold text-accent/80">82%</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-text-primary font-semibold">Tea</span>
                            <span className="font-extrabold text-accent/80">80%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What to do list */}
                    <div className="bg-white p-5 rounded-2xl border border-border space-y-4">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">Required Soil Actions</h4>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-extrabold text-[10px] h-fit">Nutrition</span>
                          <p className="text-text-secondary">
                            Apply <strong>potash 30 kg/acre</strong> to raise potassium levels into the optimal range.
                          </p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed pt-2.5 border-t border-border-light">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] h-fit">Irrigation</span>
                          <p className="text-text-secondary">
                            Next irrigation window in <strong>36-48 hours</strong> based on root-zone moisture trend.
                          </p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed pt-2.5 border-t border-border-light">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-extrabold text-[10px] h-fit">Amendment</span>
                          <p className="text-text-secondary">
                            Add <strong>organic compost 2 tonnes/acre</strong> to improve structural integrity and water retention.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-white border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                From Soil to Insight in Four Simple Steps
              </h2>
              <p className="text-lg text-text-secondary">
                We handle the complexity of IoT hardware, connectivity, and agronomic modeling so you can focus on growing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Process card 1 */}
              <div className="relative p-6 bg-surface rounded-2xl border border-border-light flex flex-col items-start space-y-4 hover:border-accent transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-lg text-primary">Place sensor probes</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Our field agents help select optimal locations and place BhumiCare probes in your soil, mapped for root-zone depth.
                </p>
              </div>

              {/* Process card 2 */}
              <div className="relative p-6 bg-surface rounded-2xl border border-border-light flex flex-col items-start space-y-4 hover:border-accent transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-lg text-primary">Stream sensor data</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Probes securely stream soil parameters over cellular connectivity to our cloud databases automatically.
                </p>
              </div>

              {/* Process card 3 */}
              <div className="relative p-6 bg-surface rounded-2xl border border-border-light flex flex-col items-start space-y-4 hover:border-accent transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-lg text-primary">AI recommendation</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Our machine learning models map soil health parameters against target crop requirements and weather data.
                </p>
              </div>

              {/* Process card 4 */}
              <div className="relative p-6 bg-surface rounded-2xl border border-border-light flex flex-col items-start space-y-4 hover:border-accent transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="font-bold text-lg text-primary">Act with confidence</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Access clear guidelines on inputs, crop suitability, and irrigation times via our web portal, mobile app, or SMS.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section id="use-cases" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                Designed for every stakeholder in the agri value chain.
              </h2>
              <p className="text-lg text-text-secondary">
                Whether you manage a single farm or an entire commercial crop region, BhumiCare brings clarity to the ground.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Use Case 1 */}
              <div className="bg-white p-8 rounded-3xl border border-border flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300">
                <div className="w-10 h-10 rounded-full bg-accent-wash text-accent flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-primary">Progressive Farmers</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Optimise fertiliser inputs, control water scheduling, and improve crop quality planning to secure yields and increase margins season after season.
                </p>
                <ul className="pt-4 border-t border-border-light space-y-2 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2">✓ Field-level nutrient scores</li>
                  <li className="flex items-center gap-2">✓ Simple traffic-light suitability index</li>
                  <li className="flex items-center gap-2">✓ Keypad SMS support for simple mobile phones</li>
                </ul>
              </div>

              {/* Use Case 2 */}
              <div className="bg-white p-8 rounded-3xl border border-border flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300">
                <div className="w-10 h-10 rounded-full bg-accent-wash text-accent flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-primary">FPOs & Co-operatives</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Standardise cultivation practices across thousands of member fields, monitor crop growth stages remotely, and unlock better pricing with consistent yields.
                </p>
                <ul className="pt-4 border-t border-border-light space-y-2 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2">✓ Unified multi-farm fleet manager</li>
                  <li className="flex items-center gap-2">✓ Regional benchmarking data</li>
                  <li className="flex items-center gap-2">✓ Exportable yield projection reports</li>
                </ul>
              </div>

              {/* Use Case 3 */}
              <div className="bg-white p-8 rounded-3xl border border-border flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300">
                <div className="w-10 h-10 rounded-full bg-accent-wash text-accent flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-primary">Agritech & Input Brands</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Integrate precise real-world soil analytics data directly into advisory portals or product supply chains via our REST API.
                </p>
                <ul className="pt-4 border-t border-border-light space-y-2 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2">✓ White-label agritech dashboards</li>
                  <li className="flex items-center gap-2">✓ Secure REST API endpoints</li>
                  <li className="flex items-center gap-2">✓ Data-driven product testing protocols</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* STATS & TESTIMONIALS */}
        <section className="py-24 bg-white border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Text & stats */}
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight leading-tight">
                  Built for the realities of the field.
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  BhumiCare is built in close partnership with local agronomy teams and smallholder farmers. Our physical systems and digital recommendations are refined to withstand rugged field conditions, high precipitation, and limited cellular signals.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="p-5 rounded-2xl bg-surface border border-border-light">
                    <span className="block text-3xl font-extrabold text-primary">12+</span>
                    <span className="text-xs text-text-secondary font-medium mt-1 block">Key Crops Modelled</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface border border-border-light">
                    <span className="block text-3xl font-extrabold text-primary">5 mins</span>
                    <span className="text-xs text-text-secondary font-medium mt-1 block">Avg Data Latency</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface border border-border-light">
                    <span className="block text-3xl font-extrabold text-primary">24x7</span>
                    <span className="text-xs text-text-secondary font-medium mt-1 block">Continuous Stream</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface border border-border-light">
                    <span className="block text-3xl font-extrabold text-primary">3-6</span>
                    <span className="text-xs text-text-secondary font-medium mt-1 block">Sensors Per Acre</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div className="relative">
                <div className="absolute inset-0 bg-accent-wash rounded-[32px] transform rotate-1 pointer-events-none" />
                <div className="relative bg-white border border-border p-8 sm:p-10 rounded-[32px] shadow-xl space-y-6 transform hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-accent text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-lg text-text-primary font-medium italic leading-relaxed">
                    “With BhumiCare, I finally understand what is happening under the ground. I can see when to irrigate and which fertiliser to use instead of just guessing. My input costs are lower and yields are more consistent.”
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                      P
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">Pilot Farmer</h4>
                      <p className="text-xs text-text-secondary">Assam, India</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  About BhumiCare
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  BhumiCare is a forward-thinking agritech venture on a mission to elevate agricultural productivity, sustainability, and soil durability. We merge deep technical expertise in internet-of-things (IoT) hardware development, scalable cloud systems, and local agricultural practices to empower cultivators across regions.
                </p>
                <div className="pt-2">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent-hover transition-colors"
                  >
                    Partner with us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
                  <h4 className="font-bold text-primary">IoT-first Approach</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Our hardware sensors are custom-engineered in-house with solar-charging capability and high-durability seals for open fields.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
                  <h4 className="font-bold text-primary">Agronomy Science</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    We collaborate closely with academic agronomists and regional specialists to configure accurate crop nutrition and pH guides.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
                  <h4 className="font-bold text-primary">Farmer Centric</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Interfaces are built to remain incredibly simple, fast loading, and readable under bright sunlight on field smartphones.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 bg-white border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
              
              <div className="lg:col-span-4 space-y-4">
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Have questions about sensor installations, pricing tiers, or pilot programs? Reach out to our agronomy support team directly.
                </p>
                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent-hover transition-colors text-sm"
                  >
                    Have other questions? Contact support
                  </a>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div
                      key={index}
                      className="border border-border rounded-2xl overflow-hidden bg-surface-card transition-colors duration-200"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-primary hover:text-accent transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 border-t border-border-light bg-white' : 'max-h-0'}`}
                      >
                        <p className="p-6 text-sm text-text-secondary leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* CONTACT & CTA SECTION */}
        <section id="contact" className="py-24 bg-surface relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-accent-wash rounded-full blur-[100px] opacity-60 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              
              {/* Contact info column */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                    Contact Us
                  </h2>
                  <p className="text-text-secondary leading-relaxed max-w-sm">
                    Interested in starting a soil sensor pilot in your fields or standardizing farm practices? Connect with us.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-text-secondary">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-accent shadow-sm flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-text-muted">Email</span>
                      <a href="mailto:rubulhoquechoudhury8@gmail.com" className="font-bold text-primary hover:text-accent text-sm sm:text-base break-all">
                        rubulhoquechoudhury8@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-text-secondary">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-accent shadow-sm flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-text-muted">Phone / WhatsApp</span>
                      <a href="tel:+917086524249" className="font-bold text-primary hover:text-accent text-sm sm:text-base">
                        +91 70865 24249
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-text-secondary">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-accent shadow-sm flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-text-muted">Location</span>
                      <span className="font-bold text-primary text-sm sm:text-base">Assam, India</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href="mailto:rubulhoquechoudhury8@gmail.com"
                    className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all flex items-center gap-2 shadow-md"
                  >
                    <Mail className="w-4 h-4" /> Email Us
                  </a>
                  <a
                    href="https://wa.me/917086524249"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl border border-border bg-white text-text-primary text-sm font-bold hover:bg-surface-hover transition-all flex items-center gap-2 shadow-sm"
                  >
                    WhatsApp Chat
                  </a>
                </div>
              </div>

              {/* Form column (using the google form iframe or fallback) */}
              <div className="lg:col-span-7">
                <div className="glass-card-strong bg-white border-border shadow-2xl overflow-hidden p-1 sm:p-2 min-h-[550px] relative flex flex-col justify-stretch">
                  <div className="p-4 bg-primary/5 border-b border-border-light text-center">
                    <h3 className="font-bold text-sm text-primary">BhumiCare Soil Analytics Query</h3>
                    <p className="text-[10px] text-text-secondary mt-1">Submit your farm requirements and our coordinator will connect with you.</p>
                  </div>
                  
                  {/* Google Forms Embed wrapper */}
                  <div className="flex-grow relative w-full h-[500px]">
                    <iframe
                      src="https://forms.gle/7Qsp2J3ocGmNzwTw7?embedded=true"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      title="Contact BhumiCare Form"
                      className="absolute inset-0 w-full h-full rounded-b-2xl border-0"
                    >
                      Loading form...
                    </iframe>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-primary text-white py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 border-b border-white/10">
            
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-extrabold text-sm">
                  B
                </div>
                <span className="text-lg font-bold tracking-tight text-white">BhumiCare AI</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed max-w-sm">
                Intelligent IoT soil sensing and AI agronomy intelligence to make every acre more productive, cost-effective, and ecologically sustainable.
              </p>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-white/90">Platform</h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li><a href="#product" className="hover:text-white transition-colors">IoT Sensing Stack</a></li>
                <li><a href="#dashboard" className="hover:text-white transition-colors">Farmer Dashboard</a></li>
                <li><a href="#use-cases" className="hover:text-white transition-colors">Regional Fleet View</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-white/90">Agronomy Advisors</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Connect with our local tea garden consultants and agronomists:
              </p>
              <p className="text-xs font-semibold text-accent">
                Email: rubulhoquechoudhury8@gmail.com <br />
                Phone: +91 70865 24249
              </p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-text-muted">
            <p>© {new Date().getFullYear()} BhumiCare AI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
