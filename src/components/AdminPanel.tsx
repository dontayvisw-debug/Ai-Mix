import React, { useState } from 'react';
import { Settings, CheckCircle2, ShieldAlert, Server, Activity, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [plans, setPlans] = useState({
    mix: 20,
    master: 10,
    monthly: 75
  });

  const handleSave = () => {
    toast.success("Admin configuration saved.");
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 sm:p-10 space-y-8 max-w-4xl mx-auto text-left" id="admin-panel">
      <div className="space-y-2 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2 text-rose-500 mb-1">
          <ShieldAlert className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">Administrator Hub</span>
        </div>
        <h2 className="font-display text-2xl font-black text-white tracking-tight">mixedbytae Environment Settings</h2>
        <p className="font-sans text-xs text-white/50 leading-relaxed">
          Manage system configurations, pricing controls, demo states, and support settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-black border border-white/5 rounded-xl p-5 space-y-4">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-green" />
            <span>Telemetry & Status</span>
          </h3>
          <ul className="space-y-3 font-mono text-xs text-white/70">
            <li className="flex justify-between items-center"><span className="text-white/40">Demo Assets:</span> <span className="text-brand-green font-bold flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> ONLLINE</span></li>
            <li className="flex justify-between items-center"><span className="text-white/40">Background DSP:</span> <span className="text-brand-green font-bold flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> ACTIVE</span></li>
            <li className="flex justify-between items-center"><span className="text-white/40">Registered Users (Mock):</span> <span className="text-white">1,402</span></li>
            <li className="flex justify-between items-center"><span className="text-white/40">Monthly Revenue (Mock):</span> <span className="text-white">$8,490</span></li>
          </ul>
        </div>

        {/* Global Configurations */}
        <div className="bg-black border border-white/5 rounded-xl p-5 space-y-4">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="h-4 w-4 text-brand-pink" />
            <span>App Config</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
              <span className="font-sans text-xs text-white/60 font-medium">Payment Provider</span>
              <select className="bg-black border border-white/20 rounded px-2 py-1 text-xs font-mono text-white outline-none" value={stripeEnabled ? 'stripe' : 'shopify'} onChange={e => setStripeEnabled(e.target.value === 'stripe')}>
                <option value="stripe">Stripe</option>
                <option value="shopify">Shopify</option>
              </select>
            </div>
            <div className="space-y-1">
               <label className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1 block">Support Redirect Email</label>
               <input disabled type="text" value="Dontayvisw@gmail.com" className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/50" />
            </div>
            <div className="space-y-1">
               <label className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1 block">Tutorial Video Link (Optional)</label>
               <input type="text" placeholder="https://youtube.com/..." className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Adjustments */}
      <div className="bg-black border border-white/5 rounded-xl p-5 space-y-4">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-brand-green" />
            <span>Pricing Controls</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 align-middle">
               <label className="font-mono text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1 block">Single Mix ($)</label>
               <input type="number" value={plans.mix} onChange={e=>setPlans({...plans, mix: Number(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white" />
            </div>
            <div className="space-y-1.5">
               <label className="font-mono text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1 block">Master Only ($)</label>
               <input type="number" value={plans.master} onChange={e=>setPlans({...plans, master: Number(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white" />
            </div>
            <div className="space-y-1.5">
               <label className="font-mono text-[10px] text-white/40 uppercase font-bold tracking-widest pl-1 block">Artist Monthly ($)</label>
               <input type="number" value={plans.monthly} onChange={e=>setPlans({...plans, monthly: Number(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white" />
            </div>
          </div>
      </div>
      
      <div className="pt-4 border-t border-white/5 text-right">
        <button onClick={handleSave} className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
          Save Configuration
        </button>
      </div>

    </div>
  );
}
