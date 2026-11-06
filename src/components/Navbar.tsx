import React, { useState } from 'react';
import { AlienLogo } from './AlienLogo.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  ChevronDown,
  Coins,
  History,
  LayoutDashboard,
  Shield,
  Settings,
  LogOut,
  Download,
  Menu,
  X,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'history' | 'dashboard' | 'explore';
  onNavigate: (view: 'home' | 'history' | 'dashboard' | 'explore') => void;
  onOpenAdmin?: () => void;
  onOpenSettings?: () => void;
  onOpenLedger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAdmin,
  onOpenSettings,
  onOpenLedger,
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [styleDropdown, setStyleDropdown] = useState(false);
  const [modelsDropdown, setModelsDropdown] = useState(false);

  const handleDownloadZip = () => {
    window.location.href = '/api/download/alien-ai-complete-website.zip';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07060D]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <AlienLogo
            size="md"
            animated
            onClick={() => onNavigate('home')}
            className="hover:opacity-90 transition-opacity"
          />

          {/* Desktop Navigation Links matching Screenshot */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#A29CB8]">
            <button
              onClick={() => onNavigate('explore')}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'explore' ? 'text-[#22E6A8] font-semibold' : ''
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore / Showcase</span>
            </button>

            {/* AI Video Tools Dropdown */}
            <div className="relative" onMouseLeave={() => setToolsDropdown(false)}>
              <button
                onMouseEnter={() => setToolsDropdown(true)}
                onClick={() => setToolsDropdown(!toolsDropdown)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>AI Video Tools</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {toolsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#14111F] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div
                    onClick={() => { onNavigate('dashboard'); setToolsDropdown(false); }}
                    className="p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    <div className="text-white text-xs font-semibold">Text to Video (Runway)</div>
                    <div className="text-[10px] text-[#A29CB8]">Generate cinema from text prompts</div>
                  </div>
                  <div
                    onClick={() => { onNavigate('dashboard'); setToolsDropdown(false); }}
                    className="p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    <div className="text-white text-xs font-semibold">Image to Video</div>
                    <div className="text-[10px] text-[#A29CB8]">Animate uploaded reference photos</div>
                  </div>
                  <div
                    onClick={() => { onNavigate('dashboard'); setToolsDropdown(false); }}
                    className="p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    <div className="text-white text-xs font-semibold">Text to Image (OpenAI)</div>
                    <div className="text-[10px] text-[#A29CB8]">DALL-E 3 ultra photorealism</div>
                  </div>
                </div>
              )}
            </div>

            {/* Create by Style Dropdown */}
            <div className="relative" onMouseLeave={() => setStyleDropdown(false)}>
              <button
                onMouseEnter={() => setStyleDropdown(true)}
                onClick={() => setStyleDropdown(!styleDropdown)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Create by Style</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {styleDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#14111F] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                  <div onClick={() => { onNavigate('dashboard'); setStyleDropdown(false); }} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer text-xs text-white">✨ Cinematic Sci-Fi</div>
                  <div onClick={() => { onNavigate('dashboard'); setStyleDropdown(false); }} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer text-xs text-white">👾 Cyberpunk Neon</div>
                  <div onClick={() => { onNavigate('dashboard'); setStyleDropdown(false); }} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer text-xs text-white">🐲 Fantasy & Mythic</div>
                  <div onClick={() => { onNavigate('dashboard'); setStyleDropdown(false); }} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer text-xs text-white">🎨 3D Holographic Pixar</div>
                </div>
              )}
            </div>

            {/* AI Models */}
            <div className="relative" onMouseLeave={() => setModelsDropdown(false)}>
              <button
                onMouseEnter={() => setModelsDropdown(true)}
                onClick={() => setModelsDropdown(!modelsDropdown)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>AI Models</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {modelsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#14111F] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                  <div className="p-2 border-b border-white/5">
                    <span className="text-[10px] text-[#22E6A8] uppercase font-bold tracking-wider">Connected Engines</span>
                  </div>
                  <div className="p-2 hover:bg-white/5 rounded-lg">
                    <div className="text-white text-xs font-semibold">OpenAI DALL-E 3</div>
                    <div className="text-[10px] text-[#A29CB8]">High fidelity 4k imagery</div>
                  </div>
                  <div className="p-2 hover:bg-white/5 rounded-lg">
                    <div className="text-white text-xs font-semibold">Runway Gen-3 Alpha</div>
                    <div className="text-[10px] text-[#A29CB8]">4s, 5s, 8s, 10s video tasks</div>
                  </div>
                  <div className="p-2 hover:bg-white/5 rounded-lg">
                    <div className="text-white text-xs font-semibold">Gemini Multimodal Studio</div>
                    <div className="text-[10px] text-[#A29CB8]">Instant built-in generation</div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('pricing-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onNavigate('home');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Pricing & Credits
            </button>

            {user && (
              <>
                <button
                  onClick={() => onNavigate('history')}
                  className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                    currentView === 'history' ? 'text-[#22E6A8] font-semibold' : ''
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>My History</span>
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                    currentView === 'dashboard' ? 'text-[#22E6A8] font-semibold' : ''
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Creator Studio</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Download Complete ZIP button */}
          <button
            onClick={handleDownloadZip}
            title="Download complete standalone website project ZIP"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#22E6A8] bg-[#22E6A8]/10 hover:bg-[#22E6A8]/20 border border-[#22E6A8]/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </button>

          {user ? (
            /* User Authenticated Menu */
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Credit balance badge */}
                <button
                  onClick={onOpenLedger}
                  title="View Credit Ledger & Pricing"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#14111F] border border-[#7C5CFF]/30 hover:border-[#7C5CFF] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  <Coins className="w-3.5 h-3.5 text-[#22E6A8]" />
                  <span>{user.credits}</span>
                  <span className="text-[#A29CB8] font-normal hidden sm:inline">Credits</span>
                </button>

                {/* Avatar Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#14111F] border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-7 h-7 rounded-full object-cover bg-black/40"
                  />
                  <span className="text-xs font-medium text-white max-w-[100px] truncate hidden md:inline">
                    {user.username}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#A29CB8]" />
                </button>
              </div>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-[#14111F] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150"
                >
                  <div className="p-2.5 border-b border-white/5 mb-1">
                    <div className="text-xs font-bold text-white truncate">{user.username}</div>
                    <div className="text-[11px] text-[#A29CB8] truncate">{user.email}</div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#22E6A8] font-medium">
                      <span>Available Balance:</span>
                      <span className="font-bold">{user.credits} Credits</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { onNavigate('history'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F4F2FB] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-[#7C5CFF]" />
                    <span>My History Library</span>
                  </button>

                  <button
                    onClick={() => { onNavigate('dashboard'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F4F2FB] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#22E6A8]" />
                    <span>Creative Studio</span>
                  </button>

                  <button
                    onClick={() => { onOpenLedger?.(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F4F2FB] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Credits & Billing</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => { onOpenAdmin?.(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Management</span>
                    </button>
                  )}

                  <button
                    onClick={() => { onOpenSettings?.(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F4F2FB] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#A29CB8]" />
                    <span>Settings & API Keys</span>
                  </button>

                  <div className="my-1 border-t border-white/5" />

                  <button
                    onClick={() => { logout(); setDropdownOpen(false); onNavigate('home'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Buttons */
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => openAuthModal('login')}
                className="py-2 px-3.5 text-xs font-semibold text-[#F4F2FB] hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="py-2.5 px-4 sm:px-5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:from-[#8C6DFF] hover:to-[#BD73FF] shadow-lg shadow-[#7C5CFF]/30 hover:shadow-[#7C5CFF]/50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-[#22E6A8] text-[#07060D] text-[9px] font-bold rounded-full">
                  50 Free
                </span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#A29CB8] hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#14111F] border-b border-white/10 px-4 py-4 space-y-3">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm text-white font-medium"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm text-white font-medium"
          >
            Explore Creations
          </button>
          {user ? (
            <>
              <button
                onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-sm text-[#22E6A8] font-medium"
              >
                My History Library
              </button>
              <button
                onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-sm text-[#7C5CFF] font-medium"
              >
                Creative Studio
              </button>
            </>
          ) : (
            <button
              onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF]"
            >
              Get Started (50 Free Credits)
            </button>
          )}
          <button
            onClick={handleDownloadZip}
            className="w-full py-2 rounded-xl text-center text-xs font-semibold text-[#22E6A8] bg-[#22E6A8]/10 border border-[#22E6A8]/30"
          >
            Download Complete Project ZIP
          </button>
        </div>
      )}
    </header>
  );
};
