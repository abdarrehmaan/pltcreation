'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, ArrowLeft, Loader2, ArrowUpRight, ArrowDownLeft, ShieldCheck, History } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface WalletTransaction {
  id: string;
  amount: number;
  type: string; // CREDIT | DEBIT
  description: string;
  createdAt: string;
}

export default function MyWalletPage() {
  const user = useAuthStore((state) => state.user);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchWallet = async () => {
      try {
        const res = await fetch(`/api/account/wallet?userId=${user.id}`);
        const json = await res.json();
        if (res.ok && json.wallet) {
          setBalance(json.wallet.balance || 0);
          setTransactions(json.wallet.transactions || []);
        } else {
          toast.error(json.error || 'Failed to fetch wallet details');
        }
      } catch (err: any) {
        toast.error('Network error fetching wallet details');
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 min-h-screen py-10">
      <div className="container-plt max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/account"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Account
          </Link>
        </div>

        {/* Wallet Balance Header Card */}
        <div
          className="rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 60%, #c9a84c 100%)' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-widest font-semibold mb-1">
                <Wallet size={16} /> Store Credit Wallet
              </div>
              <h1 className="font-display text-4xl font-bold">{formatPrice(balance)}</h1>
              <p className="text-white/80 text-xs mt-1">Available balance for instant checkout</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-semibold text-white">
              100% Safe & Instant Refunds
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-white rounded-2xl p-5 shadow-card mb-8 border border-gray-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 text-brand-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">How PLT Store Credit Works</h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Your wallet balance includes store credits, order return refunds, or special promotional rewards.
              You can automatically apply your wallet balance towards future purchases at checkout.
            </p>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2">
              <History size={18} className="text-brand-600" /> Wallet Activity & History
            </h2>
            <span className="text-xs text-gray-400 font-medium">{transactions.length} Transactions</span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              <Wallet size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="font-semibold text-gray-700">No wallet transactions yet</p>
              <p className="text-xs text-gray-400 mt-1">Refunds and store credits will be logged here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => {
                const isCredit = tx.type === 'CREDIT';
                return (
                  <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{tx.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`font-mono font-bold text-sm ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
                      {isCredit ? '+' : '-'}{formatPrice(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
