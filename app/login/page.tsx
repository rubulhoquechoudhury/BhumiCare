"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft Light Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-wash rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent-pale rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-[28px] bg-white shadow-xl shadow-accent/5 flex items-center justify-center border border-border-light overflow-hidden">
              <Image src="/bhumicare-logo.png" alt="BhumiCare Logo" width={96} height={96} className="w-full h-full object-contain scale-[1.8]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-1">BhumiCare AI</h1>
              <p className="text-text-secondary font-medium tracking-wide">Soil Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card-strong p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-text-primary">Welcome back</h2>
            <p className="text-text-secondary text-sm mt-2">
              Sign in to your workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-5 py-3.5 rounded-[20px] bg-surface/50 border border-border-light text-text-primary placeholder:text-text-muted/60 input-focus-ring text-base transition-colors"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-5 py-3.5 rounded-[20px] bg-surface/50 border border-border-light text-text-primary placeholder:text-text-muted/60 input-focus-ring text-base transition-colors"
              />
            </div>

            {error && (
              <div className="p-4 rounded-[20px] bg-danger/5 border border-danger/20 animate-fade-in">
                <p className="text-danger text-sm font-semibold text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-[20px] gradient-button text-white font-bold text-base
                hover:opacity-90 active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-light text-center">
            <p className="text-text-secondary text-sm font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-accent font-bold hover:text-accent-hover transition-colors ml-1"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-xs mt-8 font-medium">
          Powered by Advanced Soil Intelligence
        </p>
      </div>
    </div>
  );
}
