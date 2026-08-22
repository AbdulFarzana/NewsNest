import React, { useState } from 'react';

import {
  Bell,
  User,
  Settings,
  LogOut
} from 'lucide-react';

export default function Header({
  user,
  onViewChange,
  onLogout,
  isLoggedIn,
  theme = 'dark'
}) {

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        text: 'Mid Sem Timetable Released',
        time: '2h ago',
        unread: true,
        link: 'ANNOUNCEMENTS'
      },
      {
        id: 2,
        text: 'TCS Placement Drive ends soon!',
        time: '1d ago',
        unread: true,
        link: 'ANNOUNCEMENTS'
      },
      {
        id: 3,
        text: 'CodeSprint registration confirmed',
        time: '2d ago',
        unread: false,
        link: 'EVENTS'
      },
      {
        id: 4,
        text: 'New post in the community feed',
        time: '3d ago',
        unread: false,
        link: 'COMMUNITY_FEED'
      }
    ]);

  if (!isLoggedIn) {
    return null;
  }

  const isDark = theme === 'dark';

  const avatar =
    user?.avatar ||
    user?.avatarUrl ||
    user?.profileImage ||
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(user?.name || 'User') +
    '&background=6366f1&color=fff';

  const hasUnreadNotifications =
    notifications.some(
      notification => notification.unread
    );

  const handleNotificationClick = notification => {

    setNotifications(prev =>
      prev.map(item =>
        item.id === notification.id
          ? {
            ...item,
            unread: false
          }
          : item
      )
    );

    setShowNotifications(false);

    if (notification.link) {
      onViewChange(notification.link);
    }

  };

  const handleMarkAllRead = () => {

    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        unread: false
      }))
    );

  };

  return (

    <header
      className={`sticky top-0 backdrop-blur-md border-b px-6 py-4 flex items-center justify-end z-[100] select-none transition-colors ${isDark
        ? 'bg-[#0a0f1d]/95 border-[#1f2937]'
        : 'bg-white/95 border-gray-200'
        }`}
    >

      <div className="flex items-center gap-4">

        {/* NOTIFICATIONS */}

        <div className="relative">

          <button
            type="button"

            onClick={() => {

              setShowNotifications(prev => !prev);

              setShowProfileMenu(false);

            }}

            className={`p-2.5 rounded-xl border transition-all relative cursor-pointer ${isDark
              ? 'bg-[#111827] border-[#1f2937] text-gray-300 hover:text-white hover:bg-[#1f2937]'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >

            <Bell className="w-5 h-5" />

            {hasUnreadNotifications && (

              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />

                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </>

            )}

          </button>


          {showNotifications && (

            <div
              className={`absolute right-0 top-full mt-3 w-80 border rounded-2xl shadow-2xl p-4 text-sm z-[200] ${isDark
                ? 'bg-[#111827] border-[#1f2937]'
                : 'bg-white border-gray-200'
                }`}
            >

              <div
                className={`flex items-center justify-between pb-3 mb-2 border-b ${isDark
                  ? 'border-[#1f2937]'
                  : 'border-gray-200'
                  }`}
              >

                <span
                  className={`font-semibold ${isDark
                    ? 'text-white'
                    : 'text-gray-900'
                    }`}
                >
                  Notifications
                </span>

                <div className="flex items-center gap-3">

                  {hasUnreadNotifications && (

                    <button
                      type="button"

                      onClick={handleMarkAllRead}

                      className="text-xs text-indigo-500 hover:text-indigo-400 cursor-pointer"
                    >
                      Mark all read
                    </button>

                  )}

                  <button
                    type="button"

                    onClick={() =>
                      setShowNotifications(false)
                    }

                    className="text-xs text-indigo-500 hover:text-indigo-400 cursor-pointer"
                  >
                    Close
                  </button>

                </div>

              </div>


              <div className="space-y-2 max-h-72 overflow-y-auto">

                {notifications.map(notif => (

                  <button
                    type="button"

                    key={notif.id}

                    onClick={() =>
                      handleNotificationClick(notif)
                    }

                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer ${notif.unread
                      ? isDark
                        ? 'bg-[#1f2937]/50 hover:bg-[#1f2937]'
                        : 'bg-indigo-50 hover:bg-indigo-100'
                      : isDark
                        ? 'hover:bg-[#1f2937]/50'
                        : 'hover:bg-gray-100'
                      }`}
                  >

                    <div className="flex justify-between items-start gap-2">

                      <p
                        className={`text-xs ${notif.unread
                          ? isDark
                            ? 'text-white font-medium'
                            : 'text-gray-900 font-medium'
                          : isDark
                            ? 'text-gray-400'
                            : 'text-gray-500'
                          }`}
                      >
                        {notif.text}
                      </p>

                      {notif.unread && (

                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1" />

                      )}

                    </div>

                    <span
                      className={`text-[10px] block mt-1 ${isDark
                        ? 'text-gray-500'
                        : 'text-gray-400'
                        }`}
                    >
                      {notif.time}
                    </span>

                  </button>

                ))}

              </div>

            </div>

          )}

        </div>


        {/* DIVIDER */}

        <div
          className={`h-6 w-px hidden sm:block ${isDark
            ? 'bg-[#1f2937]'
            : 'bg-gray-200'
            }`}
        />


        {/* PROFILE MENU */}

        <div className="relative">

          <button
            type="button"

            onClick={() => {

              setShowProfileMenu(prev => !prev);

              setShowNotifications(false);

            }}

            className={`flex items-center gap-3 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer text-left ${isDark
              ? 'bg-[#111827]/50 border-[#1f2937] hover:border-indigo-500/40'
              : 'bg-white border-gray-200 hover:border-indigo-400'
              }`}
          >

            <img
              src={avatar}

              alt={user?.name || 'User'}

              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"

              referrerPolicy="no-referrer"
            />

            <div className="hidden sm:block text-xs">

              <p
                className={`font-semibold leading-tight flex items-center gap-1 ${isDark
                  ? 'text-white'
                  : 'text-gray-900'
                  }`}
              >

                {user?.name || 'User'}

                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />

              </p>

              <p
                className={`text-[10px] leading-none mt-0.5 ${isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
                  }`}
              >

                {user?.role || 'Student'}

              </p>

            </div>

          </button>


          {showProfileMenu && (

            <div
              className={`absolute right-0 top-full mt-3 w-56 border rounded-2xl shadow-2xl p-2.5 text-sm z-[200] ${isDark
                ? 'bg-[#111827] border-[#1f2937]'
                : 'bg-white border-gray-200'
                }`}
            >

              <div
                className={`px-3.5 py-2.5 mb-2 border-b ${isDark
                  ? 'border-[#1f2937]'
                  : 'border-gray-200'
                  }`}
              >

                <p
                  className={`text-xs ${isDark
                    ? 'text-gray-400'
                    : 'text-gray-500'
                    }`}
                >
                  Signed in as
                </p>

                <p
                  className={`font-semibold truncate ${isDark
                    ? 'text-white'
                    : 'text-gray-900'
                    }`}
                >
                  {user?.email}
                </p>

              </div>


              <div className="space-y-0.5">

                <button
                  type="button"

                  onClick={() => {

                    onViewChange('PROFILE');

                    setShowProfileMenu(false);

                  }}

                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark
                    ? 'text-gray-300 hover:text-white hover:bg-[#1f2937]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >

                  <User className="w-4 h-4 text-indigo-500" />

                  <span>My Profile</span>

                </button>


                <button
                  type="button"

                  onClick={() => {

                    onViewChange('SETTINGS');

                    setShowProfileMenu(false);

                  }}

                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark
                    ? 'text-gray-300 hover:text-white hover:bg-[#1f2937]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >

                  <Settings className="w-4 h-4 text-indigo-500" />

                  <span>Settings</span>

                </button>


                <div
                  className={`h-px my-1 ${isDark
                    ? 'bg-[#1f2937]'
                    : 'bg-gray-200'
                    }`}
                />


                <button
                  type="button"

                  onClick={() => {

                    onLogout();

                    setShowProfileMenu(false);

                  }}

                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
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