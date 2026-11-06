import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { CreditTransaction } from '../types/index.js';
import { X, Coins, Sparkles, ArrowDownRight, ArrowUpRight, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

interface CreditsLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsLedgerModal: React.FC<CreditsLedgerModalProps> = ({ isOpen, onClose }) => {
  const { user, token, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/credits/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.warn('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
      refreshUser();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#14111F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#22E6A8] flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#07060D]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Credits & Billing Ledger
              </h3>
              <p className="text-xs text-[#A29CB8]">
                Real-time transparent record of all credit grants, deductions, and refunds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A29CB8] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="p-4 rounded-xl bg-[#07060D] border border-[#7C5CFF]/30 flex items-center justify-between alien-glow">
            <div>
              <span className="text-xs text-[#A29CB8]">Available Creative Balance</span>
              <div className="text-3xl font-heading font-extrabold text-white mt-1">
                {user?.credits ?? 0} <span className="text-base text-[#22E6A8]">Credits</span>
              </div>
            </div>
            <button
              onClick={() => { fetchTransactions(); refreshUser(); }}
              title="Refresh Balance"
              className="p-2 text-[#A29CB8] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Guaranteed Rules Card */}
          <div className="p-4 rounded-xl bg-[#07060D] border border-white/5 text-xs text-[#A29CB8] flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-white font-medium mb-1">
              <ShieldCheck className="w-4 h-4 text-[#22E6A8]" />
              <span>Atomic Credit Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Credits are only permanently charged when AI generation completes successfully. Any failed generation is automatically refunded.
            </p>
          </div>
        </div>

        {/* Official Pricing Schedule Reference */}
        <div className="mb-4 p-3 bg-[#07060D]/60 rounded-xl border border-white/5 text-xs">
          <div className="text-white font-semibold mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#7C5CFF]" /> Official Generation Rates
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-white/5">
              <div className="text-[#A29CB8]">AI Image</div>
              <div className="text-white font-bold mt-0.5">5 Cr</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <div className="text-[#A29CB8]">4s Video</div>
              <div className="text-white font-bold mt-0.5">5 Cr</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <div className="text-[#A29CB8]">5s Video</div>
              <div className="text-white font-bold mt-0.5">8 Cr</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <div className="text-[#A29CB8]">8s Video</div>
              <div className="text-white font-bold mt-0.5">10 Cr</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <div className="text-[#A29CB8]">10s Video</div>
              <div className="text-white font-bold mt-0.5">15 Cr</div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-white mb-2">Audit Ledger</div>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#A29CB8]">
              No transactions recorded yet. Create an image or video to see credit activities.
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-[#07060D] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.amount > 0
                          ? 'bg-[#22E6A8]/20 text-[#22E6A8]'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{tx.description}</div>
                      <div className="text-[10px] text-[#A29CB8]">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-heading font-bold text-sm ${
                        tx.amount > 0 ? 'text-[#22E6A8]' : 'text-red-400'
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Cr
                    </div>
                    <div className="text-[10px] text-[#A29CB8]">
                      Bal: {tx.balance_after}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
