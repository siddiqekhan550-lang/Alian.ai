import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  Image as ImageIcon,
  Film,
  Paperclip,
  X,
  ArrowUp,
  Loader2,
  Clock,
  Ratio,
  Wand2,
  AlertCircle,
  Coins,
} from 'lucide-react';

interface PromptComposerProps {
  onGenerate: (params: {
    type: 'image' | 'video';
    prompt: string;
    aspect_ratio: string;
    duration?: number;
    reference_image_url?: string;
  }) => Promise<void>;
  isGenerating: boolean;
  onOpenLedger?: () => void;
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  onGenerate,
  isGenerating,
  onOpenLedger,
}) => {
  const { user, openAuthModal } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'image' | 'video'>('video');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState<4 | 5 | 8 | 10>(4);
  const [referenceMedia, setReferenceMedia] = useState<{ url: string; name: string; type: string } | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Credit calculation
  const currentCost = mode === 'image' ? 5 : { 4: 5, 5: 8, 8: 10, 10: 15 }[duration];
  const userBalance = user?.credits ?? 0;
  const hasEnoughCredits = userBalance >= currentCost;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds 25MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setReferenceMedia({
        url: event.target?.result as string,
        name: file.name,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);

    setTimeout(() => {
      const cinematicAdditions = [
        ', cinematic 8k resolution, volumetric ethereal lighting, shallow depth of field, hyper-detailed textures, unreal engine 5 render',
        ', bioluminescent rim light, anamorphic lens flare, photorealistic atmospheric haze, masterpiece composition',
        ', dark nebula gradient atmosphere, ultra-sharp detail, award-winning cinematography, slow camera pan',
      ];
      const addition = cinematicAdditions[Math.floor(Math.random() * cinematicAdditions.length)];
      setPrompt((prev) => prev.trim() + addition);
      setIsEnhancing(false);
    }, 600);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    if (!user) {
      openAuthModal('signup');
      return;
    }

    if (!hasEnoughCredits) {
      setShowInsufficientCredits(true);
      return;
    }

    setShowInsufficientCredits(false);
    await onGenerate({
      type: mode,
      prompt: prompt.trim(),
      aspect_ratio: aspectRatio,
      duration: mode === 'video' ? duration : undefined,
      reference_image_url: referenceMedia?.url,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Insufficient Credits Banner/Popup */}
      {showInsufficientCredits && (
        <div className="absolute -top-16 left-0 right-0 mx-auto w-full p-3 rounded-xl bg-[#14111F] border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              You don't have enough credits. This {mode} requires <strong>{currentCost} credits</strong>, but your balance is <strong>{userBalance}</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLedger}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Check Ledger / Top-Up
            </button>
            <button
              onClick={() => setShowInsufficientCredits(false)}
              className="text-[#A29CB8] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Composer Box */}
      <div className="bg-[#14111F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-3 sm:p-4 transition-all focus-within:border-[#7C5CFF]/60 focus-within:ring-2 focus-within:ring-[#7C5CFF]/20">
        {/* Uploaded Reference Preview Chip */}
        {referenceMedia && (
          <div className="mb-3 flex items-center gap-2.5 p-2 bg-[#07060D] border border-white/10 rounded-xl w-fit max-w-full">
            {referenceMedia.type.startsWith('video') ? (
              <video src={referenceMedia.url} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <img src={referenceMedia.url} alt="Reference" className="w-10 h-10 rounded-lg object-cover" />
            )}
            <div className="text-left text-xs truncate max-w-[200px]">
              <div className="text-white font-medium truncate">{referenceMedia.name}</div>
              <div className="text-[10px] text-[#22E6A8]">Attached reference media</div>
            </div>
            <button
              type="button"
              onClick={() => setReferenceMedia(null)}
              className="p-1 text-[#A29CB8] hover:text-white rounded-md hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={
              mode === 'video'
                ? 'Describe a cinematic video scene (e.g. A neon dragon soaring over a futuristic Tokyo cyber-temple in heavy rain)...'
                : 'Describe an image in rich visual detail (e.g. An alien bioluminescent botanical garden with glowing flora)...'
            }
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-[#A29CB8]/50 resize-none focus:outline-none pr-10"
          />

          {/* Enhance Prompt Button */}
          {prompt.trim().length > 5 && (
            <button
              type="button"
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
              title="Enhance prompt with cinematic AI descriptors"
              className="absolute right-1 top-1 p-1.5 rounded-lg bg-[#7C5CFF]/20 hover:bg-[#7C5CFF]/30 text-[#7C5CFF] hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              {isEnhancing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5 text-[#22E6A8]" />
              )}
              <span className="hidden sm:inline text-[11px] font-medium">Enhance</span>
            </button>
          )}
        </div>

        {/* Composer Controls Bar */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher: Image / Video */}
            <div className="flex bg-[#07060D] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setMode('image')}
                className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'image'
                    ? 'bg-[#7C5CFF] text-white shadow-sm'
                    : 'text-[#A29CB8] hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('video')}
                className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'video'
                    ? 'bg-[#7C5CFF] text-white shadow-sm'
                    : 'text-[#A29CB8] hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video</span>
              </button>
            </div>

            {/* Video Duration Selector (Strictly 4s, 5s, 8s, 10s as required) */}
            {mode === 'video' && (
              <div className="flex items-center bg-[#07060D] p-1 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#A29CB8] px-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#7C5CFF]" />
                  <span className="hidden sm:inline">Duration:</span>
                </span>
                {([4, 5, 8, 10] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      duration === d
                        ? 'bg-[#22E6A8] text-[#07060D] shadow-sm'
                        : 'text-[#A29CB8] hover:text-white'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            )}

            {/* Aspect Ratio Selector */}
            <div className="flex items-center bg-[#07060D] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] text-[#A29CB8] px-1.5 flex items-center gap-1">
                <Ratio className="w-3 h-3 text-[#22E6A8]" />
              </span>
              {(mode === 'video' ? ['16:9', '9:16', '1:1'] : ['1:1', '16:9', '9:16', '4:3', '3:4']).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`py-1 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    aspectRatio === r
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-[#A29CB8] hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Upload Reference Media Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload reference image or video"
              className="p-2 rounded-xl bg-[#07060D] border border-white/5 hover:border-white/20 text-[#A29CB8] hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              <Paperclip className="w-3.5 h-3.5 text-[#22E6A8]" />
              <span className="hidden sm:inline">Attach Media</span>
            </button>
          </div>

          {/* Right Action: Cost Pill & Generate Button */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Dynamic Credit Cost Badge */}
            <div
              onClick={onOpenLedger}
              title={`Will deduct ${currentCost} credits upon successful generation`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                hasEnoughCredits
                  ? 'bg-[#07060D] border-[#7C5CFF]/30 text-white'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <Coins className={`w-3.5 h-3.5 ${hasEnoughCredits ? 'text-[#22E6A8]' : 'text-red-400'}`} />
              <span>{currentCost} Credits</span>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              disabled={isGenerating || !prompt.trim()}
              onClick={() => handleSubmit()}
              className="py-2 px-5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:from-[#8C6DFF] hover:to-[#BD73FF] transition-all duration-200 shadow-lg shadow-[#7C5CFF]/30 hover:shadow-[#7C5CFF]/50 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowUp className="w-4 h-4 rounded-full bg-white/20 p-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
