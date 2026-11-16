import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { Home, Compass, Users, Trophy, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, navigateToProfile } = useApp();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: Home, action: () => setActiveTab('dashboard') },
    { id: 'discover' as NavTab, label: 'Discover', icon: Compass, action: () => setActiveTab('discover') },
    { id: 'community' as NavTab, label: 'Community', icon: Users, action: () => setActiveTab('community') },
    { id: 'leaderboard' as NavTab, label: 'Rankings', icon: Trophy, action: () => setActiveTab('leaderboard') },
    { id: 'profile' as NavTab, label: 'Profile', icon: User, action: () => navigateToProfile(currentUser?.id) },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-[#1E293B] px-2 py-2 flex items-center justify-around">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive 
                ? 'text-sky-400 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-sky-400' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            {isActive && (
              <span className="w-1 h-1 bg-sky-400 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
