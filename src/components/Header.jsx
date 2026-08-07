import React, { useState } from 'react';
import { Search, Bell, Menu, User, Settings, LogOut, Check } from 'lucide-react';

export default function Header({ 
  user, 
  activeView, 
  onViewChange, 
  onLogout, 
  isLoggedIn,
  searchQuery,
  onSearchChange
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, text: "Mid Sem Timetable Released", time: "2h ago", unread: true, link: "ANNOUNCEMENTS" },
    { id: 2, text: "TCS Placement Drive ends soon!", time: "1d ago", unread: true, link: "ANNOUNCEMENTS" },
    { id: 3, text: "CodeSprint registration confirmed", time: "2d ago", unread: false, link: "EVENTS" },
    { id: 4, text: "New post from Sarah Khan in community", time: "3d ago", unread: false, link: "COMMUNITY_FEED" },
  ];

  if (!isLoggedIn) return null;

  return (
    <header className="sticky top-0 bg-[#0a0f1d]/85 backdrop-blur-md border-b border-[#1f2937] px-6 py-4 flex items-center justify-between z-40 select-none">
      {/* Search Input Section */}
      <div className="flex-1 max-w-lg relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search news, events, people, clubs..."
          className="w-full pl-10 pr-12 py-2.5 bg-[#111827] border border-[#1f2937] rounded-xl text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
        />
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-800 rounded border border-gray-700">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Action Controls & Profile info */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            id="notification-bell"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 rounded-xl bg-[#111827] border border-[#1f2937] text-gray-300 hover:text-white hover:bg-[#1f2937] transition-all relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl p-4 text-sm z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f2937] mb-2">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-xs text-indigo-400 cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      onViewChange(notif.link);
                      setShowNotifications(false);
                    }}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      notif.unread ? 'bg-[#1f2937]/50 hover:bg-[#1f2937]' : 'hover:bg-[#111827]/80'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-xs ${notif.unread ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {notif.text}
                      </p>
                      {notif.unread && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1" />}
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-1">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-[#1f2937] hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            id="profile-dropdown-trigger"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-[#111827]/50 border border-[#1f2937] hover:border-indigo-500/40 transition-all cursor-pointer text-left"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block text-xs">
              <p className="font-semibold text-white leading-tight flex items-center gap-1">
                {user.name}
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">{user.role}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl p-2.5 text-sm z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-3.5 py-2.5 border-b border-[#1f2937] mb-2">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="font-semibold text-white truncate">{user.email}</p>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onViewChange('PROFILE');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#1f2937] transition-all"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    onViewChange('SETTINGS');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#1f2937] transition-all"
                >
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Settings</span>
                </button>
                <div className="h-px bg-[#1f2937] my-1" />
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
