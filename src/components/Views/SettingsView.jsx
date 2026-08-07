import React, { useState } from 'react';
import { Settings, Bell, Shield, RotateCcw, Monitor, RefreshCw, Cpu, HardDrive } from 'lucide-react';

export default function SettingsView({ onResetData }) {
  const [notifyAnnouncements, setNotifyAnnouncements] = useState(true);
  const [notifyEvents, setNotifyEvents] = useState(true);
  const [notifyComments, setNotifyComments] = useState(false);
  const [anonymousStats, setAnonymousStats] = useState(true);

  const handleReset = () => {
    onResetData();
    alert("NewsNest storage state has been re-indexed to factory mockup defaults successfully! Check dashboard counts.");
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-indigo-400" />
          <span>Portal System Settings</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">Configure user alert parameters, customize client telemetry, and reset local database caches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left column Settings panel options */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Notifications config section */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-[#1f2937]/50 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-indigo-400" />
              <span>Notification Dispatch Parameters</span>
            </h3>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Bulletin Board Announcements</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Dispatches notifications whenever official collegiate administrative bulletins are published.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyAnnouncements} 
                  onChange={() => setNotifyAnnouncements(!notifyAnnouncements)}
                  className="w-4 h-4 rounded bg-[#151c2c] border-gray-700 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-[#1f2937]/40 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Upcoming Events & Workshops</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Sends reminders 24 hours prior to registered RSVP workshops starting.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyEvents} 
                  onChange={() => setNotifyEvents(!notifyEvents)}
                  className="w-4 h-4 rounded bg-[#151c2c] border-gray-700 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-[#1f2937]/40 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Peer Replies & Comments</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Sends notification push sounds whenever a classmate comments on your forum threads.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyComments} 
                  onChange={() => setNotifyComments(!notifyComments)}
                  className="w-4 h-4 rounded bg-[#151c2c] border-gray-700 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings panel */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-[#1f2937]/50 flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-indigo-400" />
              <span>Privacy & Anonymous Telemetry</span>
            </h3>

            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">Share Usage Statistics</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Helps the IT division analyze query loads to optimize server indexing speeds.</p>
              </div>
              <input 
                type="checkbox" 
                checked={anonymousStats} 
                onChange={() => setAnonymousStats(!anonymousStats)}
                className="w-4 h-4 rounded bg-[#151c2c] border-gray-700 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
              />
            </div>
          </div>

          {/* Dangerous Zone Settings panel */}
          <div className="bg-[#111827] border border-red-500/10 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-red-400 pb-2 border-b border-red-500/10 flex items-center gap-2">
              <RotateCcw className="w-4.5 h-4.5 text-red-400" />
              <span>Danger Zone Operations</span>
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-md">
                <h4 className="text-xs font-bold text-white">Factory State Hard Reset</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Clears all custom composed feed discussions, resets event RSVPs, reinstates default student name and roles.</p>
              </div>
              <button
                id="settings-reset-data"
                onClick={handleReset}
                className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
              >
                Reset Database
              </button>
            </div>
          </div>

        </div>

        {/* Right column system details */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 pb-2 border-b border-[#1f2937]/50 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-indigo-400" />
              <span>System Metadata</span>
            </h3>

            <div className="space-y-3.5 text-[11px] text-gray-400 font-mono">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-gray-500" /> Client Engine</span>
                <span className="text-white">Vite/React 19</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#1f2937]/50 pt-3">
                <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-gray-500" /> Storage Index</span>
                <span className="text-white">Local Memory</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#1f2937]/50 pt-3">
                <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-gray-500" /> Sync Rate</span>
                <span className="text-white">Immediate</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
