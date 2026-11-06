import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Generation } from '../types/index.js';
import { MediaViewerModal } from '../components/MediaViewerModal.js';
import {
  PlusCircle,
  Film,
  Image as ImageIcon,
  Search,
  Filter,
  Play,
  Clock,
  Sparkles,
  Download,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (view: 'home' | 'history' | 'dashboard' | 'explore') => void;
  onRegenerate: (prompt: string, type: 'image' | 'video', duration?: number, ratio?: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, onRegenerate }) => {
  const { user, token, openAuthModal } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'processing' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/generations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setGenerations(data.generations || []);
      }
    } catch (err) {
      console.warn('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  // Handle deletion
  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setGenerations((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (e) {
      console.warn('Delete error:', e);
    }
  };

  // Filter items
  const filteredGenerations = generations.filter((item) => {
    if (activeFilter === 'image' && item.type !== 'image') return false;
    if (activeFilter === 'video' && item.type !== 'video') return false;
    if (activeFilter === 'processing' && item.status !== 'processing' && item.status !== 'queued') return false;
    if (activeFilter === 'failed' && item.status !== 'failed') return false;

    if (searchQuery.trim()) {
      return item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Featured video is either the latest completed video or the featured dragon from blueprint
  const featuredVideo = generations.find((g) => g.type === 'video' && g.status === 'completed') || generations[0];

  const handleCopyPrompt = (e: React.MouseEvent, promptText: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-2xl bg-[#14111F] border border-white/10 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#7C5CFF]/20 flex items-center justify-center text-[#7C5CFF] mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-white mb-2">
            Sign In to View Your History Library
          </h2>
          <p className="text-xs text-[#A29CB8] mb-6">
            Your generated videos and images are private and safely stored under your account.
          </p>
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:opacity-90 transition-opacity cursor-pointer"
          >
            Sign Up for 50 Free Credits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Featured Video Header Banner (Blueprint Page 7) */}
      {featuredVideo && (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#14111F] shadow-2xl group">
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-[#07060D] overflow-hidden flex items-center justify-center">
            <img
              src={featuredVideo.output_url || featuredVideo.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80'}
              alt={featuredVideo.prompt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07060D] via-[#07060D]/30 to-transparent" />

            {/* Play Button Overlay */}
            <button
              onClick={() => setSelectedGeneration(featuredVideo)}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 hover:bg-[#7C5CFF]/80 transition-all duration-300 shadow-2xl cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            </button>

            {/* Featured Info Bar */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22E6A8]/10 text-[#22E6A8] text-[11px] font-semibold mb-2">
                  <Sparkles className="w-3 h-3" /> Featured Creation
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2">
                  {featuredVideo.prompt}
                </h3>
              </div>

              {/* Prominent CREATE NEW Button (Blueprint Page 7 & 8) */}
              <button
                onClick={() => onNavigate('dashboard')}
                className="py-3 px-6 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:from-[#8C6DFF] hover:to-[#BD73FF] shadow-lg shadow-[#7C5CFF]/40 hover:shadow-[#7C5CFF]/60 transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-[#22E6A8]" />
                <span>CREATE NEW</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Filters, Search & Refresh */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'video', label: 'Videos' },
            { id: 'image', label: 'Images' },
            { id: 'processing', label: 'Processing' },
            { id: 'failed', label: 'Failed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#7C5CFF] text-white shadow-md'
                  : 'bg-[#14111F] text-[#A29CB8] hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#A29CB8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full bg-[#14111F] border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-[#A29CB8]/50 focus:outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <button
            onClick={fetchHistory}
            title="Refresh Library"
            className="p-2 rounded-xl bg-[#14111F] border border-white/10 text-[#A29CB8] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#22E6A8]" />
            <span>Create New</span>
          </button>
        </div>
      </div>

      {/* History Grid */}
      {loading && generations.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-[#7C5CFF] animate-spin mb-3" />
          <p className="text-xs text-[#A29CB8]">Loading your creation library...</p>
        </div>
      ) : filteredGenerations.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#14111F]/50 border border-white/5 p-8">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#A29CB8] mx-auto mb-3">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Creations Found</h3>
          <p className="text-xs text-[#A29CB8] max-w-sm mx-auto mb-5">
            {searchQuery
              ? `No items match "${searchQuery}". Try a different search term.`
              : "You haven't generated any media in this filter yet. Create your first video or image now!"}
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="py-2.5 px-5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#22E6A8]" />
            <span>Open Creator Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGenerations.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedGeneration(item)}
              className="group relative rounded-2xl bg-[#14111F] border border-white/5 hover:border-[#7C5CFF]/40 overflow-hidden shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video w-full bg-[#07060D] overflow-hidden">
                <img
                  src={item.output_url || item.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'}
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status or Play overlay */}
                {item.status === 'processing' || item.status === 'queued' ? (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1.5 p-3">
                    <Loader2 className="w-5 h-5 text-[#22E6A8] animate-spin" />
                    <span className="text-[11px] text-white font-medium">Generating... {item.progress || 10}%</span>
                  </div>
                ) : item.status === 'failed' ? (
                  <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center gap-1 p-3 text-center">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-[10px] text-red-300 font-semibold">Generation Failed</span>
                    <span className="text-[9px] text-[#A29CB8]">Credits Refunded</span>
                  </div>
                ) : (
                  item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )
                )}

                {/* Type & Duration Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      item.type === 'video'
                        ? 'bg-purple-500/80 text-white'
                        : 'bg-cyan-500/80 text-white'
                    }`}
                  >
                    {item.type}
                  </span>
                  {item.duration && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-black/60 text-white backdrop-blur-md">
                      {item.duration}s
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-black/60 text-[#22E6A8] backdrop-blur-md">
                    {item.credits_charged} Cr
                  </span>
                </div>
              </div>

              {/* Prompt & Date Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-white line-clamp-2 leading-relaxed mb-2">
                    {item.prompt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#A29CB8]">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>

                  {/* Quick Card Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopyPrompt(e, item.prompt, item.id)}
                      title="Copy Prompt"
                      className="p-1 hover:text-white rounded hover:bg-white/10"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-[#22E6A8]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRegenerate(item.prompt, item.type, item.duration, item.aspect_ratio);
                        onNavigate('dashboard');
                      }}
                      title="Regenerate"
                      className="p-1 hover:text-[#22E6A8] rounded hover:bg-white/10"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      title="Delete"
                      className="p-1 hover:text-red-400 rounded hover:bg-white/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Lightbox Modal */}
      <MediaViewerModal
        isOpen={!!selectedGeneration}
        generation={selectedGeneration}
        onClose={() => setSelectedGeneration(null)}
        onRegenerate={(p, t, d, r) => {
          onRegenerate(p, t, d, r);
          onNavigate('dashboard');
        }}
        onDelete={(id) => handleDelete(id)}
      />
    </div>
  );
};
