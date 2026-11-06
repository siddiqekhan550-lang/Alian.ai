import React from 'react';
import { Sparkles, Film, Image as ImageIcon, ArrowRight, Play } from 'lucide-react';

interface ExplorePageProps {
  onNavigate: (view: 'home' | 'history' | 'dashboard' | 'explore') => void;
  onUsePrompt: (prompt: string, type: 'image' | 'video', duration?: number) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate, onUsePrompt }) => {
  const showcaseItems = [
    {
      id: 'showcase-1',
      title: 'The Sleepy Dragon',
      prompt: 'Scene 1 · The sleepy dragon awakening in an enchanted bioluminescent nebula forest, cinematic 8k lighting',
      type: 'video' as const,
      duration: 8,
      media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      credits: 10,
    },
    {
      id: 'showcase-2',
      title: 'Neon Cyberpunk Samurai',
      prompt: 'Futuristic armored warrior in neon rainy Neo-Tokyo street with holographic cherry blossoms and glowing katana, cinematic lighting',
      type: 'image' as const,
      media: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      credits: 5,
    },
    {
      id: 'showcase-3',
      title: 'Bioluminescent Abyss',
      prompt: 'Ethereal glowing glass jellyfish floating through deep violet hydrothermal trench with sparkling plankton, photorealistic',
      type: 'video' as const,
      duration: 5,
      media: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
      credits: 8,
    },
    {
      id: 'showcase-4',
      title: 'Alien Botanical Haven',
      prompt: 'Surreal crystal flowers blooming in zero-gravity greenhouse orbiting Saturn with volumetric rings reflection in window glass',
      type: 'image' as const,
      media: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80',
      credits: 5,
    },
    {
      id: 'showcase-5',
      title: 'Solar Voyager Racing',
      prompt: 'Futuristic solar hovercraft racing through glowing alien crystalline canyon, volumetric golden hour haze, 8k render',
      type: 'video' as const,
      duration: 10,
      media: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      credits: 15,
    },
    {
      id: 'showcase-6',
      title: 'Holographic Android Portrait',
      prompt: 'Ultra-detailed portrait of synthetic android with translucent obsidian faceplates and pulsing cyan circuits, sharp focus studio lighting',
      type: 'image' as const,
      media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      credits: 5,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C5CFF]/15 text-[#7C5CFF] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#22E6A8]" /> Prompt Gallery & Showcase
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Explore Alien.ai Creations
        </h1>
        <p className="text-xs sm:text-sm text-[#A29CB8]">
          Discover stunning prompts generated with OpenAI DALL-E 3 and Runway Gen-3. Click any prompt to open and modify it directly in the Creative Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcaseItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-[#14111F] border border-white/5 hover:border-[#7C5CFF]/40 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full bg-[#07060D] overflow-hidden">
              <img
                src={item.media}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {item.type}
                </span>
                {item.duration && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-black/60 text-[#22E6A8] backdrop-blur-md border border-white/10">
                    {item.duration}s
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#7C5CFF]/80 text-white backdrop-blur-md">
                  {item.credits} Cr
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A29CB8] line-clamp-2 leading-relaxed mb-4">
                  {item.prompt}
                </p>
              </div>

              <button
                onClick={() => {
                  onUsePrompt(item.prompt, item.type, item.duration);
                  onNavigate('dashboard');
                }}
                className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-gradient-to-r hover:from-[#7C5CFF] hover:to-[#B05CFF] border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Use Prompt in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
