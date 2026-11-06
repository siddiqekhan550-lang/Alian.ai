import React from 'react';
import { AlienLogo } from './AlienLogo.js';
import { useAuth } from '../context/AuthContext.js';
import {
  PlusCircle,
  History,
  Compass,
  Image as ImageIcon,
  Film,
  Coins,
  Settings,
  HelpCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentView: 'home' | 'history' | 'dashboard' | 'explore';
  onNavigate: (view: 'home' | 'history' | 'dashboard' | 'explore') => void;
  onOpenAdmin?: () => void;
  onOpenSettings?: () => void;
  onOpenLedger?: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenAdmin,
  onOpenSettings,
  onOpenLedger,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, openAuthModal } = useAuth();

  return (
    <aside
      className={`relative h-[calc(100vh-4.5rem)] bg-[#07060D] border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Branding & Collapse Toggle */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div
          onClick={() => onNavigate('home')}
          className="cursor-pointer overflow-hidden"
        >
          <AlienLogo size="sm" showWordmark={!collapsed} />
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-[#A29CB8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {/* Primary New Creation Action */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-sm ${
            currentView === 'dashboard'
              ? 'bg-gradient-to-r from-[#7C5CFF] to-[#B05CFF] text-white shadow-[#7C5CFF]/30'
              : 'bg-[#7C5CFF]/15 hover:bg-[#7C5CFF]/25 text-[#7C5CFF] hover:text-white border border-[#7C5CFF]/30'
          }`}
          title="Create New AI Video or Image"
        >
          <PlusCircle className="w-4 h-4 shrink-0 text-[#22E6A8]" />
          {!collapsed && <span>New Creation</span>}
        </button>

        <div className="pt-2">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-[#A29CB8]/60 uppercase tracking-wider">
              Workspace
            </div>
          )}

          {/* History */}
          <button
            onClick={() => onNavigate('history')}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'history'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-[#A29CB8] hover:text-white hover:bg-white/5'
            }`}
            title="History Library"
          >
            <History className="w-4 h-4 shrink-0 text-[#7C5CFF]" />
            {!collapsed && <span>History Library</span>}
          </button>

          {/* Explore */}
          <button
            onClick={() => onNavigate('explore')}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'explore'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-[#A29CB8] hover:text-white hover:bg-white/5'
            }`}
            title="Explore Community & Showcase"
          >
            <Compass className="w-4 h-4 shrink-0 text-[#22E6A8]" />
            {!collapsed && <span>Explore Gallery</span>}
          </button>
        </div>

        {/* Media Categories */}
        <div className="pt-2">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-[#A29CB8]/60 uppercase tracking-wider">
              My Creations
            </div>
          )}
          <button
            onClick={() => onNavigate('history')}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium text-[#A29CB8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Images"
          >
            <ImageIcon className="w-4 h-4 shrink-0 text-cyan-400" />
            {!collapsed && <span>Images</span>}
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium text-[#A29CB8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Videos"
          >
            <Film className="w-4 h-4 shrink-0 text-purple-400" />
            {!collapsed && <span>Videos</span>}
          </button>
        </div>

        {/* Tools & Account */}
        <div className="pt-2">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-[#A29CB8]/60 uppercase tracking-wider">
              Management
            </div>
          )}
          <button
            onClick={onOpenLedger}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium text-[#A29CB8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Credits & Transactions"
          >
            <Coins className="w-4 h-4 shrink-0 text-amber-400" />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Credits & Billing</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
                  {user?.credits ?? 0}
                </span>
              </div>
            )}
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium text-[#A29CB8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="API Keys & Settings"
          >
            <Settings className="w-4 h-4 shrink-0 text-[#A29CB8]" />
            {!collapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => alert('Alien.ai Support: Email support@alien.ai or visit our documentation for API troubleshooting.')}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-xs font-medium text-[#A29CB8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Help & Support"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-[#A29CB8]" />
            {!collapsed && <span>Help & Support</span>}
          </button>
        </div>
      </div>

      {/* User Card Footer */}
      <div className="p-3 border-t border-white/5 bg-[#14111F]/50">
        {user ? (
          <div className="flex items-center gap-2.5">
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-8 h-8 rounded-full bg-black/40 shrink-0 object-cover"
            />
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-semibold text-white truncate">{user.username}</div>
                <div className="text-[10px] text-[#22E6A8] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{user.credits} Credits Available</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full py-2 px-2 rounded-xl text-xs font-semibold text-center text-white bg-[#7C5CFF] hover:bg-[#8C6DFF] transition-colors cursor-pointer truncate"
          >
            {collapsed ? 'Sign In' : 'Sign Up (+50 Credits)'}
          </button>
        )}
      </div>
    </aside>
  );
};
