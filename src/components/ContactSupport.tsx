import React, { useState } from 'react';
import { Send, CheckCircle, Headphones, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: 'Bug Report',
    project: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder submission
    setSubmitted(true);
    toast.success("Support request sent successfully. We will respond shortly.");
  };

  if (submitted) {
    return (
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto" id="support-submitted">
        <div className="flex justify-center text-brand-green mb-4">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h3 className="font-display text-2xl font-black text-white tracking-tight">Request Received</h3>
        <p className="font-sans text-sm text-white/60">
          Thank you. Our team will review your {formData.issueType.toLowerCase()} regarding "{formData.project || 'General Inquiry'}" and contact you at {formData.email} shortly.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFormData({...formData, message: ''}); }}
          className="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 sm:p-10 space-y-8 max-w-2xl mx-auto text-left" id="support-contact-form">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-brand-pink mb-1">
          <Headphones className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">Contact & Support</span>
        </div>
        <h2 className="font-display text-2xl font-black text-white tracking-tight">How can we help?</h2>
        <p className="font-sans text-xs text-white/50 leading-relaxed">
          Please fill out the form below. If you are experiencing an issue with a specific mix, please include the project name.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold text-white/40 shadow-sm ml-1">Your Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
              placeholder="Artist Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold text-white/40 shadow-sm ml-1">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
              placeholder="you@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider font-bold text-white/40 shadow-sm ml-1">Issue Type</label>
          <select 
            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-pink/50 transition-colors appearance-none"
            value={formData.issueType}
            onChange={(e) => setFormData({...formData, issueType: e.target.value})}
          >
            <option>Billing</option>
            <option>Refund Request</option>
            <option>Bug Report</option>
            <option>Other / General</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider font-bold text-white/40 shadow-sm ml-1">Project Name (Optional)</label>
          <input 
            type="text" 
            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
            placeholder="e.g. Broken Heart Mix"
            value={formData.project}
            onChange={(e) => setFormData({...formData, project: e.target.value})}
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider font-bold text-white/40 shadow-sm ml-1">Message</label>
          <textarea 
            required
            rows={5}
            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-pink/50 transition-colors resize-none"
            placeholder="Describe your issue or question..."
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full px-6 py-4 bg-white text-black font-display font-black text-sm uppercase tracking-wider rounded-xl hover:bg-brand-pink hover:text-white transition-colors flex justify-center items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Send Support Request</span>
        </button>
      </form>
    </div>
  );
}
