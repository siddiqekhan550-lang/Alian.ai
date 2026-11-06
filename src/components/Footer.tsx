import React from 'react';
import { AlienLogo } from './AlienLogo.js';
import { Download, Sparkles, Shield, Cpu, Film } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'history' | 'dashboard' | 'explore') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleDownloadZip = () => {
    window.location.href = '/api/download/alien-ai-complete-website.zip';
  };

  return (
    <footer className="w-full bg-[#07060D] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-4 md:col-span-1">
          <AlienLogo size="md" />
          <p className="text-xs text-[#A29CB8] leading-relaxed">
            Alien.ai is an advanced generative AI creation studio inspired by Google Flow. Create breathtaking cinematic AI videos and hyper-detailed images with unified prompt controls.
          </p>
          <div className="pt-2">
            <button
              onClick={handleDownloadZip}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#22E6A8] bg-[#22E6A8]/10 hover:bg-[#22E6A8]/20 border border-[#22E6A8]/30 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Complete ZIP</span>
            </button>
          </div>
        </div>

        {/* Studio Tools */}
        <div>
          <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-wider mb-3">
            AI Studio Tools
          </h4>
          <ul className="space-y-2 text-xs text-[#A29CB8]">
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <Film className="w-3 h-3 text-[#7C5CFF]" /> Text to Video (Runway)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#22E6A8]" /> Image Generation (OpenAI)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-purple-400" /> Image to Video Motion
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('history')} className="hover:text-white transition-colors cursor-pointer">
                Personal Generation Library
              </button>
            </li>
          </ul>
        </div>

        {/* Credit Rules */}
        <div>
          <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-wider mb-3">
            Credit System
          </h4>
          <ul className="space-y-2 text-xs text-[#A29CB8]">
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>New Account Grant</span>
              <span className="text-[#22E6A8] font-bold">+50 Credits</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>AI Image (DALL-E 3)</span>
              <span className="text-white font-medium">5 Credits</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>4s Video</span>
              <span className="text-white font-medium">5 Credits</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>5s Video</span>
              <span className="text-white font-medium">8 Credits</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>8s Video</span>
              <span className="text-white font-medium">10 Credits</span>
            </li>
            <li className="flex justify-between">
              <span>10s Video</span>
              <span className="text-white font-medium">15 Credits</span>
            </li>
          </ul>
        </div>

        {/* Security & Isolation */}
        <div>
          <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-wider mb-3">
            Security & Isolation
          </h4>
          <p className="text-xs text-[#A29CB8] leading-relaxed mb-3">
            Strict Row-Level Security (RLS) ensures every user's creations and uploads remain private. Atomic database ledger protects your credit balance against double charges.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#22E6A8]">
            <Shield className="w-3.5 h-3.5" />
            <span>Encrypted Provider API Routing</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A29CB8]">
        <div>© 2026 Alien.ai. All rights reserved. Powered by Google Flow Design Architecture.</div>
        <div className="flex items-center gap-4 mt-3 sm:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security Whitepaper</span>
        </div>
      </div>
    </footer>
  );
};
