import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { X, Key, Shield, CheckCircle2, Sparkles, AlertCircle, Save, Loader2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [openaiKey, setOpenaiKey] = useState('');
  const [runwayKey, setRunwayKey] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.settings);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          openai_api_key: openaiKey || undefined,
          runway_api_key: runwayKey || undefined,
        }),
      });

      if (res.ok) {
        setMessage('Settings and API credentials updated successfully!');
        loadSettings();
        setOpenaiKey('');
        setRunwayKey('');
      } else {
        const err = await res.json();
        setMessage('Notice: ' + (err.error || 'Saved in session.'));
      }
    } catch (err: any) {
      setMessage('Error updating settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#14111F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-[#22E6A8]" />
            <h3 className="font-heading text-lg font-bold text-white">
              Studio Providers & API Keys
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A29CB8] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Connectivity Status Overview */}
        <div className="mb-5 p-3.5 bg-[#07060D] border border-white/5 rounded-xl space-y-2.5">
          <div className="text-xs font-semibold text-white flex items-center justify-between">
            <span>Provider Engine Status</span>
            <span className="text-[10px] text-[#22E6A8] uppercase tracking-wider font-bold">Active Engine</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A29CB8]">Gemini Multimodal Studio:</span>
            <span className="flex items-center gap-1 text-[#22E6A8] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready & Connected
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A29CB8]">OpenAI DALL-E 3 Images:</span>
            <span className={`flex items-center gap-1 font-medium ${status?.has_openai_key ? 'text-[#22E6A8]' : 'text-amber-400'}`}>
              {status?.has_openai_key ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" /> Using Auto-Fallback
                </>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A29CB8]">Runway Gen-3 Alpha Video:</span>
            <span className={`flex items-center gap-1 font-medium ${status?.has_runway_key ? 'text-[#22E6A8]' : 'text-amber-400'}`}>
              {status?.has_runway_key ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" /> Using Auto-Fallback
                </>
              )}
            </span>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-white text-xs">
            {message}
          </div>
        )}

        {/* Form to configure provider keys */}
        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A29CB8] mb-1">
              OpenAI API Key (Optional Override)
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-[#07060D] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder:text-[#A29CB8]/40 focus:outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A29CB8] mb-1">
              Runway API Key (Optional Override)
            </label>
            <input
              type="password"
              value={runwayKey}
              onChange={(e) => setRunwayKey(e.target.value)}
              placeholder="key_..."
              className="w-full bg-[#07060D] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder:text-[#A29CB8]/40 focus:outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <p className="text-[11px] text-[#A29CB8] leading-relaxed">
            API keys are securely transmitted directly to your backend server and never exposed in browser source code or public repos.
          </p>

          <button
            type="submit"
            disabled={saving || (!openaiKey && !runwayKey)}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] hover:from-[#8C6DFF] hover:to-[#BD73FF] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Provider Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
};
