import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Megaphone, 
  Calendar, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ activeView, onViewChange, onLogout, isLoggedIn }) {
  const menuItems = [
    { view: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'COMMUNITY_FEED', label: 'Community Feed', icon: MessageSquare },
    { view: 'ANNOUNCEMENTS', label: 'Announcements', icon: Megaphone },
    { view: 'EVENTS', label: 'Events', icon: Calendar },
    { view: 'HACKATHONS', label: 'Hackathons & Clubs', icon: Trophy },
    { view: 'PROFILE', label: 'Profile', icon: User },
    { view: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#111827] border-r border-[#1f2937] text-gray-300 h-screen sticky top-0 shrink-0 select-none">
        {/* Logo Section */}
        <div className="p-6 border-b border-[#1f2937] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">NewsNest</h1>
            <p className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Campus Hub</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                id={`sidebar-item-${item.view.toLowerCase()}`}
                onClick={() => onViewChange(item.view)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border-l-4 border-indigo-500 shadow-sm' 
                    : 'hover:bg-[#1f2937]/50 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-indigo-400'
                }`} />
                <span>{item.label}</span>
                
                {/* Subtle indicator dot */}
                {isActive && (
                  <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer/Logout Section */}
        <div className="p-4 border-t border-[#1f2937]">
          <button
            id="sidebar-logout"
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1f2937] z-50 px-2 py-1.5 flex justify-around items-center">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              id={`mobile-nav-${item.view.toLowerCase()}`}
              onClick={() => onViewChange(item.view)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] scale-90">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => onViewChange('PROFILE')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            activeView === 'PROFILE' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] scale-90">Profile</span>
        </button>
      </nav>
    </>
  );
}
