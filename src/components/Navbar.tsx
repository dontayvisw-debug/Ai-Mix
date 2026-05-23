import { Music, Sparkles, User, LayoutDashboard, CreditCard, Layers, HelpCircle, Headphones, FileText, Play } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
}

export default function Navbar({ currentTab, onTabChange, userEmail = "Dontayvisw@gmail.com" }: NavbarProps) {
  const navItems = [
    { id: 'landing', targetId: 'real-vocal-demo-section', label: 'Demo', icon: Headphones },
    { id: 'landing', targetId: 'features-how-it-works', label: 'How It Works', icon: FileText },
    { id: 'landing', targetId: 'pricing-module-container', label: 'Pricing', icon: CreditCard },
    { id: 'landing', targetId: 'tutorial-video-section-container', label: 'Tutorial', icon: Play },
    { id: 'dashboard', targetId: null, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'support', targetId: null, label: 'Support', icon: HelpCircle },
    { id: 'workshop', targetId: null, label: 'Start Mixing', icon: Layers },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (currentTab !== item.id) {
      onTabChange(item.id);
      if (item.targetId) {
        setTimeout(() => {
          document.getElementById(item.targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (item.targetId) {
      document.getElementById(item.targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black bg-[#050505]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick({ id: 'landing', targetId: 'landing-hero', label: 'Home', icon: Music })} 
            className="flex cursor-pointer items-center space-x-2 text-white"
            id="nav-logo"
          >
            <BrandLogo mode="navbar" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" id="nav-desktop-menu">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              const isAccent = item.label === 'Start Mixing';

              return (
                <button
                  key={`${item.label}-${idx}`}
                  id={`nav-item-${idx}`}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 font-display text-sm font-medium transition-all duration-200 ${
                    isAccent 
                      ? 'ml-2 bg-brand-green text-black border-transparent hover:bg-orange-400 studio-glow-green font-extrabold'
                      : isActive && !item.targetId
                      ? 'bg-white/5 border-white/10 text-brand-cyan'
                      : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive && !isAccent ? 'text-brand-cyan' : isAccent ? 'text-black' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Session Info */}
          <div className="flex items-center space-x-4" id="nav-user-section">
            <div className="hidden xl:flex flex-col text-right pr-2">
              <span className="font-mono text-[10px] text-white/40 uppercase">Artist Portal</span>
              <span className="text-xs font-semibold text-white/80">{userEmail}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-brand-green/50 cursor-pointer transition-all duration-200" title="Artist Settings">
              <User className="h-4 w-4 text-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Rail */}
      <div className="md:hidden border-t border-white/10 bg-[#0A0A0A]/95 py-2 px-1 overflow-x-auto" id="nav-mobile-bar">
        <div className="flex justify-around items-center min-w-[500px]">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={`mob-${item.label}-${idx}`}
                id={`nav-mob-item-${idx}`}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center space-y-1 py-1 px-3 text-2xs transition-colors duration-150 ${
                  isActive && !item.targetId ? 'text-brand-cyan' : 'text-white/40 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-sans text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
