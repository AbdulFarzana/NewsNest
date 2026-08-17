import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';

export default function EventsView({
  events,
  onRegisterEvent,
  searchQuery
}) {
  const [activeTab, setActiveTab] = useState('All');

  // Filter based on category tabs and search query
  const filteredEvents = events.filter((evt) => {
    // Tab filter logic
    if (activeTab === 'Registered') {
      if (!evt.isRegistered) return false;
    } else if (activeTab === 'Upcoming') {
      if (evt.category !== 'Upcoming') return false;
    } else if (activeTab === 'Past') {
      if (evt.category !== 'Past') return false;
    }

    // Search query logic
    const query = searchQuery.toLowerCase();
    return (
      evt.title.toLowerCase().includes(query) ||
      evt.description.toLowerCase().includes(query) ||
      evt.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5.5 h-5.5 text-indigo-400" />
            <span>Campus Events & Workshops</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Discover, RSVP, and participate in academic and extracurricular university activities.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#1f2937]/50 pb-2">
        <div className="flex gap-2 overflow-x-auto">
          {['All', 'Upcoming', 'Registered', 'Past'].map((tab) => (
            <button
              key={tab}
              id={`events-tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' 
                  : 'bg-transparent border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Found {filteredEvents.length} events</span>
      </div>

      {/* Events Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-3xl p-5 text-gray-500 text-xs col-span-full">
            No events found matching current filter or search criteria.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div 
              key={evt.id}
              className="bg-[#111827] border border-[#1f2937] rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all shadow-md flex flex-col justify-between group"
            >
              {/* Event Header Banner with dynamic gradients */}
              <div className={`h-36 bg-gradient-to-tr ${evt.imagePlaceholderColor} p-5 flex flex-col justify-between relative`}>
                <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-slate-950/35 transition-all" />
                
                {/* Meta Labels */}
                <div className="z-10 flex justify-between items-start">
                  <span className="text-[9px] bg-slate-950/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {evt.date}
                  </span>
                  {evt.isRegistered && (
                    <span className="text-[9px] bg-emerald-500 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-500/25">
                      ✓ RSVP Confirmed
                    </span>
                  )}
                </div>

                <h3 className="z-10 text-sm md:text-base font-extrabold text-white tracking-wide leading-snug drop-shadow-md select-text">
                  {evt.title}
                </h3>
              </div>

              {/* Event Details Panel */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed min-h-[48px] select-text">
                  {evt.description}
                </p>

                {/* Date & Location list */}
                <div className="flex flex-col gap-2 text-xs text-gray-400 border-y border-[#1f2937]/50 py-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Time: <strong className="text-gray-300 font-medium">{evt.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Venue: <strong className="text-gray-300 font-medium">{evt.location}</strong></span>
                  </div>
                </div>

                {/* RSVP Trigger Button */}
                <button
                  id={`events-rsvp-${evt.id}`}
                  onClick={() => onRegisterEvent(evt.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    evt.isRegistered 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15'
                  }`}
                >
                  {evt.isRegistered ? 'RSVP Confirmed ✓' : 'Register / RSVP'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event notice banner */}
      <div className="p-4 rounded-2xl bg-[#151c2c]/40 border border-[#1f2937] flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="text-[11px] text-gray-400 leading-relaxed">
          <strong>Need to register on behalf of a student group?</strong> Connect with the respective club coordinator under the <strong className="text-indigo-400">Hackathons & Clubs</strong> directory.
        </p>
      </div>
    </div>
  );
}
