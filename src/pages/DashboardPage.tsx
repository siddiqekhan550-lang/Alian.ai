import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Generation } from '../types/index.js';
import { PromptComposer } from '../components/PromptComposer.js';
import { MediaViewerModal } from '../components/MediaViewerModal.js';
import {
  Sparkles,
  Film,
  Image as ImageIcon,
  Loader2,
  Download,
  RotateCcw,
  Copy,
  Check,
  Play,
  Share2,
  Wand2,
  Layers,
  ArrowRight,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (view: 'home' | 'history' | 'dashboard' | 'explore') => void;
  onOpenLedger?: () => void;
  initialPrompt?: string;
  initialType?: 'image' | 'video';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenLedger,
  initialPrompt,
  initialType,
}) => {
  const { user, token, setCredits, openAuthModal } = useAuth();
  const [activeGeneration, setActiveGeneration] = useState<Generation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedModalGen, setSelectedModalGen] = useState<Generation | null>(null);

  // Poll active generation if status is queued or processing
  useEffect(() => {
    let interval: any;
    if (activeGeneration && (activeGeneration.status === 'processing' || activeGeneration.status === 'queued')) {
      interval = setInterval(async () => {
        if (!token) return;
        try {
          const res = await fetch(`/api/generations/${activeGeneration.id}/poll`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setActiveGeneration(data.generation);
            if (data.generation.status === 'completed' || data.generation.status === 'failed') {
              setIsGenerating(false);
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.warn('Poll error:', e);
        }
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [activeGeneration, token]);

  const handleStartGeneration = async (params: {
    type: 'image' | 'video';
    prompt: string;
    aspect_ratio: string;
    duration?: number;
    reference_image_url?: string;
  }) => {
    if (!token) {
      openAuthModal('signup');
      return;
    }

    setIsGenerating(true);
    setErrorNotice(null);

    const endpoint = params.type === 'video' ? '/api/generations/video' : '/api/generations/image';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed.');
      }

      setActiveGeneration(data.generation);
      if (typeof data.newBalance === 'number') {
        setCredits(data.newBalance);
      }

      if (data.generation.status === 'completed') {
        setIsGenerating(false);
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Generation error.');
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!activeGeneration) return;
    navigator.clipboard.writeText(activeGeneration.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeGeneration) return;
    const url = activeGeneration.output_url || activeGeneration.thumbnail_url;
    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = `alien-ai-${activeGeneration.type}-${activeGeneration.id}.${
      activeGeneration.type === 'video' ? 'mp4' : 'jpg'
    }`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-[calc(100vh-4.5rem)] overflow-hidden relative bg-[#07060D]">
      {/* Top Studio Action Bar */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-[#07060D]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-sm text-white">
            Alien Creative Studio
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[11px] text-[#7C5CFF] font-medium">
            <Sparkles className="w-3 h-3 text-[#22E6A8]" /> Google Flow Architecture
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => onNavigate('history')}
            className="text-[#A29CB8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>View All in History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
        {/* Error Notice */}
        {errorNotice && (
          <div className="w-full max-w-2xl mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-white hover:opacity-70 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* State 1: Actively Generating */}
        {isGenerating && activeGeneration && activeGeneration.status !== 'completed' ? (
          <div className="w-full max-w-2xl p-8 rounded-2xl bg-[#14111F] border border-[#7C5CFF]/40 shadow-2xl text-center alien-glow flex flex-col items-center animate-in fade-in duration-300">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-[#7C5CFF]/20 border-t-[#22E6A8] animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#22E6A8] flex items-center justify-center">
                {activeGeneration.type === 'video' ? (
                  <Film className="w-6 h-6 text-[#07060D]" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#07060D]" />
                )}
              </div>
            </div>

            <h3 className="font-heading text-xl font-bold text-white mb-2">
              Rendering {activeGeneration.type === 'video' ? 'Cinematic Video' : 'AI Image'}
            </h3>
            <p className="text-xs text-[#A29CB8] max-w-md mx-auto mb-6 italic">
              "{activeGeneration.prompt}"
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#07060D] h-2.5 rounded-full overflow-hidden mb-3 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#22E6A8] transition-all duration-500"
                style={{ width: `${Math.max(15, activeGeneration.progress || 25)}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[11px] text-[#A29CB8]">
              <span className="flex items-center gap-1.5 text-[#22E6A8]">
                <Loader2 className="w-3 h-3 animate-spin" /> Synthesizing frames...
              </span>
              <span>{activeGeneration.progress || 25}% complete</span>
            </div>
          </div>
        ) : activeGeneration && activeGeneration.status === 'completed' ? (
          /* State 2: Completed Generation Result on Canvas */
          <div className="w-full max-w-4xl rounded-2xl bg-[#14111F] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-300">
            {/* Visual Media Viewer */}
            <div className="relative aspect-video w-full bg-[#07060D] overflow-hidden flex items-center justify-center">
              {activeGeneration.type === 'video' ? (
                <video
                  src={activeGeneration.output_url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeGeneration.output_url || activeGeneration.thumbnail_url}
                  alt={activeGeneration.prompt}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Top overlay pills */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#22E6A8] border border-white/10 uppercase tracking-wider">
                  ✓ {activeGeneration.provider.toUpperCase()} COMPLETED
                </span>
                {activeGeneration.duration && (
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-medium text-white border border-white/10">
                    {activeGeneration.duration}s
                  </span>
                )}
              </div>
            </div>

            {/* Prompt & Actions Toolbar */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5 bg-[#14111F]">
              <div className="flex-1">
                <p className="text-xs text-white leading-relaxed line-clamp-2">
                  {activeGeneration.prompt}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#A29CB8]">
                  <span>{activeGeneration.aspect_ratio}</span>
                  <span>•</span>
                  <span>{activeGeneration.credits_charged} Credits charged</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyPrompt}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22E6A8]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Prompt'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="py-2 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:opacity-90 shadow-lg shadow-[#7C5CFF]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* State 3: Empty / Studio Welcome Canvas with inspiration chips */
          <div className="max-w-2xl text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 to-[#22E6A8]/20 border border-[#7C5CFF]/30 flex items-center justify-center text-[#22E6A8] mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>

            <h2 className="font-heading text-2xl font-bold text-white mb-2">
              Ready to Create
            </h2>
            <p className="text-xs text-[#A29CB8] max-w-md mx-auto mb-6">
              Enter a prompt in the composer below. Choose between high-res image synthesis or 4s, 5s, 8s, 10s video generation.
            </p>

            {/* Quick Inspiration Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {[
                {
                  title: '🐲 Sleepy Nebula Dragon',
                  prompt: 'Scene 1 · The sleepy dragon awakening in an enchanted bioluminescent nebula forest, cinematic 8k lighting',
                  type: 'video' as const,
                },
                {
                  title: '🚀 Cosmic Solarpunk Voyager',
                  prompt: 'Futuristic solar hovercraft racing through glowing alien crystalline canyon, volumetric golden hour haze',
                  type: 'video' as const,
                },
                {
                  title: '👾 Cyberpunk Neo-Tokyo',
                  prompt: 'Cybernetic astronaut standing in rainy neon Tokyo alleyway with holographic cherry blossoms, photorealistic',
                  type: 'image' as const,
                },
                {
                  title: '🌌 Bioluminescent Deep Ocean',
                  prompt: 'Ethereal glowing glass jellyfish floating through deep violet hydrothermal abyss, award-winning macro cinema',
                  type: 'image' as const,
                },
              ].map((chip, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleStartGeneration({
                      type: chip.type,
                      prompt: chip.prompt,
                      aspect_ratio: '16:9',
                      duration: chip.type === 'video' ? 4 : undefined,
                    });
                  }}
                  className="p-3 rounded-xl bg-[#14111F] border border-white/5 hover:border-[#7C5CFF]/40 cursor-pointer transition-all hover:bg-white/5 group"
                >
                  <div className="text-xs font-semibold text-white group-hover:text-[#22E6A8] transition-colors flex items-center justify-between">
                    <span>{chip.title}</span>
                    <span className="text-[10px] text-[#A29CB8] uppercase">{chip.type}</span>
                  </div>
                  <div className="text-[11px] text-[#A29CB8] line-clamp-1 mt-1">
                    {chip.prompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Docked Prompt Composer at Bottom (Google Flow Design) */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-[#07060D] via-[#07060D]/95 to-transparent">
        <PromptComposer
          onGenerate={handleStartGeneration}
          isGenerating={isGenerating}
          onOpenLedger={onOpenLedger}
        />
      </div>

      <MediaViewerModal
        isOpen={!!selectedModalGen}
        generation={selectedModalGen}
        onClose={() => setSelectedModalGen(null)}
      />
    </div>
  );
};
