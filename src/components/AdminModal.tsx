import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { X, Shield, Users, Layers, Coins, Film, Image as ImageIcon, PlusCircle, Check } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [grantAmount, setGrantAmount] = useState<number>(50);
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.overview);
      }
    } catch (e) {
      console.warn('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  const handleGrantCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !targetUserId) return;

    try {
      const res = await fetch('/api/admin/grant-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: targetUserId, amount: Number(grantAmount) }),
      });

      if (res.ok) {
        setGrantSuccess(`Granted ${grantAmount} credits successfully!`);
        setTimeout(() => setGrantSuccess(null), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.warn('Grant error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#14111F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading text-lg font-bold text-white">
              Alien.ai Platform Administration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A29CB8] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 bg-[#07060D] border border-white/5 rounded-xl">
            <div className="flex items-center justify-between text-[#A29CB8] text-xs">
              <span>Total Users</span>
              <Users className="w-4 h-4 text-[#7C5CFF]" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {data?.totalUsers ?? 0}
            </div>
          </div>

          <div className="p-3 bg-[#07060D] border border-white/5 rounded-xl">
            <div className="flex items-center justify-between text-[#A29CB8] text-xs">
              <span>Total Generations</span>
              <Layers className="w-4 h-4 text-[#22E6A8]" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {data?.totalGenerations ?? 0}
            </div>
          </div>

          <div className="p-3 bg-[#07060D] border border-white/5 rounded-xl">
            <div className="flex items-center justify-between text-[#A29CB8] text-xs">
              <span>AI Videos</span>
              <Film className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {data?.totalVideos ?? 0}
            </div>
          </div>

          <div className="p-3 bg-[#07060D] border border-white/5 rounded-xl">
            <div className="flex items-center justify-between text-[#A29CB8] text-xs">
              <span>Credits Circulating</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {data?.totalCreditsInCirculation ?? 0}
            </div>
          </div>
        </div>

        {/* Credit Grant Bar */}
        <form onSubmit={handleGrantCredits} className="mb-5 p-3 bg-[#07060D] border border-amber-500/20 rounded-xl flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-amber-300">Quick Credit Grant:</span>
          <select
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="bg-[#14111F] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none"
          >
            <option value="">Select User...</option>
            {data?.users?.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.email}) - {u.balance} Cr
              </option>
            ))}
          </select>
          <input
            type="number"
            value={grantAmount}
            onChange={(e) => setGrantAmount(Number(e.target.value))}
            className="w-20 bg-[#14111F] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
            placeholder="Amount"
          />
          <button
            type="submit"
            disabled={!targetUserId}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40"
          >
            Grant
          </button>
          {grantSuccess && (
            <span className="text-[#22E6A8] text-xs flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {grantSuccess}
            </span>
          )}
        </form>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-white mb-2">Registered Accounts</h4>
            <div className="bg-[#07060D] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-[#A29CB8]">
                  <tr>
                    <th className="p-2.5">User</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Balance</th>
                    <th className="p-2.5">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.users?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="p-2.5 font-medium text-white">{u.username}</td>
                      <td className="p-2.5 text-[#A29CB8]">{u.email}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-[#22E6A8]">{u.balance} Cr</td>
                      <td className="p-2.5 text-[#A29CB8]">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
