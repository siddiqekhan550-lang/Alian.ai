import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AlienLogo } from './AlienLogo.js';
import { Sparkles, Coins, ArrowRight } from 'lucide-react';

interface WelcomeCreditsModalProps {
  isOpen: boolean;
  credits: number;
  onClose: () => void;
  onProceedToHistory: () => void;
}

export const WelcomeCreditsModal: React.FC<WelcomeCreditsModalProps> = ({
  isOpen,
  credits,
  onProceedToHistory,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive Alien purple & mint confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C5CFF', '#B05CFF', '#22E6A8', '#FFFFFF'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#14111F] border border-[#7C5CFF]/30 rounded-2xl p-7 text-center shadow-[0_0_50px_rgba(124,92,255,0.35)] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-[#7C5CFF]/30 to-transparent blur-2xl pointer-events-none" />

        {/* Alien Logo Badge */}
        <div className="flex justify-center mb-4">
          <AlienLogo size="lg" animated showWordmark={false} />
        </div>

        {/* Heading */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22E6A8]/10 border border-[#22E6A8]/30 text-[#22E6A8] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> First-Time Creator Gift
        </div>

        <h3 className="font-heading text-2xl font-bold text-white mb-2">
          Congratulations!
        </h3>
        <p className="text-[#A29CB8] text-sm mb-6 leading-relaxed">
          Your new Alien.ai account is verified and ready. We have credited your account with free creative tokens!
        </p>

        {/* 50 Credits Badge Highlight */}
        <div className="relative py-4 px-6 mx-auto mb-6 bg-[#07060D] border border-[#7C5CFF]/40 rounded-xl flex items-center justify-center gap-3 alien-glow">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#22E6A8] flex items-center justify-center shadow-lg shadow-[#7C5CFF]/20">
            <Coins className="w-6 h-6 text-[#07060D]" />
          </div>
          <div className="text-left">
            <div className="text-3xl font-heading font-extrabold text-white tracking-tight">
              {credits} <span className="text-[#22E6A8] text-lg font-normal">Credits</span>
            </div>
            <div className="text-xs text-[#A29CB8]">Ready to generate videos & images</div>
          </div>
        </div>

        {/* OK / Explore History Button */}
        <button
          onClick={onProceedToHistory}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:from-[#8C6DFF] hover:to-[#BD73FF] transition-all duration-200 shadow-lg shadow-[#7C5CFF]/30 hover:shadow-[#7C5CFF]/50 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>OK — Go to My History</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[11px] text-[#A29CB8]/70 mt-4">
          Enjoy unlimited prompt experimentation. 4s video = 5 credits, Image = 5 credits.
        </p>
      </div>
    </div>
  );
};
