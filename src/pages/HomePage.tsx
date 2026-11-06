import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  Play,
  Film,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Coins,
  CheckCircle2,
  Download,
  Clock,
  Compass,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: 'home' | 'history' | 'dashboard' | 'explore') => void;
  onOpenLedger?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenLedger }) => {
  const { user, openAuthModal } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleHeroCta = () => {
    if (user) {
      onNavigate('history');
    } else {
      openAuthModal('signup');
    }
  };

  const handleDownloadZip = () => {
    window.location.href = '/api/download/alien-ai-complete-website.zip';
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section Matching Blueprint Screenshot Page 4 */}
      <section className="relative w-full max-w-6xl mx-auto px-4 pt-16 pb-12 text-center flex flex-col items-center">
        {/* Ambient Top Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#7C5CFF]/20 via-[#B05CFF]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14111F] border border-white/10 text-xs font-medium text-[#22E6A8] mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#22E6A8]" />
          <span>Next-Gen Generative Video & Image Canvas</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22E6A8] animate-pulse" />
        </div>

        {/* Large Two-Line Headline (Exact reference from Screenshot) */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] mb-5">
          Best AI Video Generator For <br />
          <span className="bg-gradient-to-r from-white via-[#F4F2FB] to-[#A29CB8] bg-clip-text text-transparent">
            Long-Form Video Creation
          </span>
        </h1>

        {/* Short Supporting Copy (Exact reference from Screenshot) */}
        <p className="text-[#A29CB8] text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
          Create AI images and short-form videos from your ideas, scripts, or stories. Generation is available when your provider services are configured.
        </p>

        {/* Primary CTA Button (Exact reference from Screenshot) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
          <button
            onClick={handleHeroCta}
            className="py-3.5 px-8 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:from-[#8C6DFF] hover:to-[#BD73FF] shadow-[0_0_30px_rgba(124,92,255,0.4)] hover:shadow-[0_0_40px_rgba(124,92,255,0.6)] transition-all duration-300 flex items-center gap-2 group cursor-pointer"
          >
            <span>Create your first video for free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('explore')}
            className="py-3.5 px-6 rounded-full font-semibold text-sm text-[#F4F2FB] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#22E6A8]" />
            <span>Explore Creations</span>
          </button>
        </div>

        {/* Featured Video Player Card (Blueprint Page 4 & 7: "Scene 1 · The sleepy dragon") */}
        <div className="w-full max-w-4xl relative rounded-2xl overflow-hidden border border-white/10 bg-[#14111F] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
          <div className="relative aspect-video w-full bg-[#07060D] overflow-hidden flex items-center justify-center">
            {isPlaying ? (
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-nebula-clouds-in-outer-space-40344-large.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80"
                  alt="Scene 1 · The sleepy dragon"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07060D] via-transparent to-black/30" />

                {/* Play Button Trigger */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 hover:bg-[#7C5CFF]/80 transition-all duration-300 shadow-2xl cursor-pointer"
                  title="Play Sample Video"
                >
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                </button>

                {/* Bottom Video Badge matching blueprint page 7 */}
                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-left">
                  <div className="bg-[#07060D]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white">
                    Scene 1 · The sleepy dragon
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#A29CB8] bg-[#07060D]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <Clock className="w-3 h-3 text-[#22E6A8]" />
                    <span>8s 4K Cinema • Runway Gen-3</span>
                  </div>
                </div>

                {/* Progress bar line matching blueprint */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C5CFF] via-[#B05CFF] to-[#22E6A8]" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
            Engineered for Creators. Driven by Real AI.
          </h2>
          <p className="text-sm text-[#A29CB8]">
            Alien.ai combines the best models in generative AI into a unified Google Flow-inspired workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#14111F] border border-white/5 hover:border-[#7C5CFF]/40 transition-all duration-300 alien-glow-card">
            <div className="w-12 h-12 rounded-xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/30 flex items-center justify-center text-[#7C5CFF] mb-5">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Runway Gen-3 Video Engine
            </h3>
            <p className="text-xs text-[#A29CB8] leading-relaxed mb-4">
              Generate real cinematic video sequences with exact duration control: 4s (5 cr), 5s (8 cr), 8s (10 cr), and 10s (15 cr).
            </p>
            <div className="text-xs text-[#22E6A8] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Text & Image to Video
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#14111F] border border-white/5 hover:border-[#22E6A8]/40 transition-all duration-300 alien-glow-card">
            <div className="w-12 h-12 rounded-xl bg-[#22E6A8]/20 border border-[#22E6A8]/30 flex items-center justify-center text-[#22E6A8] mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              OpenAI DALL-E 3 & Imagen
            </h3>
            <p className="text-xs text-[#A29CB8] leading-relaxed mb-4">
              Turn complex prompts into photorealistic images across 1:1, 16:9, 9:16, 4:3, and 3:4 aspect ratios for just 5 credits.
            </p>
            <div className="text-xs text-[#22E6A8] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution Output
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#14111F] border border-white/5 hover:border-purple-400/40 transition-all duration-300 alien-glow-card">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Atomic Credit Ledger & RLS
            </h3>
            <p className="text-xs text-[#A29CB8] leading-relaxed mb-4">
              Every generation is isolated. Failed jobs are refunded automatically. 50 free credits are guaranteed upon verified signup.
            </p>
            <div className="text-xs text-[#22E6A8] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Protected Ledger & Privacy
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Credits Section */}
      <section id="pricing-section" className="w-full max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22E6A8]/10 text-[#22E6A8] text-xs font-semibold mb-2">
            <Coins className="w-3.5 h-3.5" /> Transparent Pricing
          </div>
          <h2 className="font-heading text-3xl font-bold text-white">
            Simple Credit-Based Generation
          </h2>
          <p className="text-xs text-[#A29CB8] mt-1">
            New accounts receive 50 Free Welcome Credits instantly on registration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Starter Free Grant */}
          <div className="p-6 rounded-2xl bg-[#14111F] border border-[#7C5CFF]/30 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#7C5CFF] to-transparent py-1 px-4 text-[10px] font-bold text-white uppercase tracking-wider">
              Included Free
            </div>
            <div>
              <div className="text-xs text-[#7C5CFF] font-semibold uppercase tracking-wider">
                New Creator Tier
              </div>
              <div className="text-3xl font-heading font-extrabold text-white mt-1 mb-2">
                50 <span className="text-lg text-[#22E6A8]">Credits</span>
              </div>
              <p className="text-xs text-[#A29CB8] mb-6">
                Awarded upon your first signup. Good for up to 10 images or multiple cinematic AI video generations.
              </p>

              <ul className="space-y-2 text-xs text-white/90 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22E6A8]" />
                  <span>10x AI Image Generations (5 Cr each)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22E6A8]" />
                  <span>Or 10x 4s Runway Videos (5 Cr each)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22E6A8]" />
                  <span>Or 5x 8s Runway Videos (10 Cr each)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22E6A8]" />
                  <span>Full access to Google Flow creative studio</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (user ? onNavigate('dashboard') : openAuthModal('signup'))}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:opacity-90 transition-opacity cursor-pointer text-center"
            >
              {user ? 'Enter Creative Studio' : 'Claim 50 Free Credits'}
            </button>
          </div>

          {/* Card 2: Official Rate Card */}
          <div className="p-6 rounded-2xl bg-[#14111F] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-[#A29CB8] font-semibold uppercase tracking-wider">
                Cost Breakdown Schedule
              </div>
              <div className="text-2xl font-heading font-bold text-white mt-1 mb-2">
                Pay As You Create
              </div>
              <p className="text-xs text-[#A29CB8] mb-4">
                Deducted only upon completed generation. Failed generations are automatically refunded.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#07060D] border border-white/5">
                  <span className="text-white">AI Image (DALL-E 3)</span>
                  <span className="font-bold text-[#22E6A8]">5 Credits</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#07060D] border border-white/5">
                  <span className="text-white">4s Video (Runway)</span>
                  <span className="font-bold text-[#22E6A8]">5 Credits</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#07060D] border border-white/5">
                  <span className="text-white">5s Video (Runway)</span>
                  <span className="font-bold text-[#22E6A8]">8 Credits</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#07060D] border border-white/5">
                  <span className="text-white">8s Video (Runway)</span>
                  <span className="font-bold text-[#22E6A8]">10 Credits</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#07060D] border border-white/5">
                  <span className="text-white">10s Video (Runway)</span>
                  <span className="font-bold text-[#22E6A8]">15 Credits</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenLedger}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer text-center"
            >
              View My Credit Ledger
            </button>
          </div>
        </div>
      </section>

      {/* ZIP Packaging Delivery Banner (Section 20 of prompt) */}
      <section className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#14111F] via-[#100D1C] to-[#14111F] border border-[#22E6A8]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22E6A8]/10 text-[#22E6A8] text-xs font-semibold">
              <Download className="w-3.5 h-3.5" /> Standalone Project ZIP
            </div>
            <h3 className="font-heading text-xl font-bold text-white">
              Download Alien.ai-Complete-Website.zip
            </h3>
            <p className="text-xs text-[#A29CB8] max-w-xl leading-relaxed">
              Includes complete frontend, backend Express API, Supabase database schemas & RLS policies, OpenAI & Runway provider adapters, and setup guides.
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            className="py-3.5 px-6 rounded-xl font-semibold text-xs text-[#07060D] bg-[#22E6A8] hover:bg-[#20d89e] transition-colors shadow-lg shadow-[#22E6A8]/20 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Full ZIP Archive</span>
          </button>
        </div>
      </section>
    </div>
  );
};
