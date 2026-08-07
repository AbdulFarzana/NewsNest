import React, { useState } from 'react';
import { Trophy, Users, Award, Cpu, Code, Palette, Camera, Music, Compass } from 'lucide-react';

export default function HackathonsView({
  hackathons,
  clubs,
  onRegisterHackathon,
  onJoinClub,
  searchQuery
}) {
  const [hackathonFilter, setHackathonFilter] = useState('All');
  const [selectedHackathonDetails, setSelectedHackathonDetails] = useState(null);

  // Helper to map icon name to Lucide components
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Code': return Code;
      case 'Cpu': return Cpu;
      case 'Palette': return Palette;
      case 'Camera': return Camera;
      case 'Music': return Music;
      default: return Compass;
    }
  };

  // Filter hackathons
  const filteredHackathons = hackathons.filter(hack => {
    // Tab filter
    if (hackathonFilter === 'Online' && hack.type !== 'Online') return false;
    if (hackathonFilter === 'Offline' && hack.type !== 'Offline') return false;
    if (hackathonFilter === 'Upcoming' && hack.category !== 'Upcoming') return false;
    if (hackathonFilter === 'National' && hack.scope !== 'National') return false;
    if (hackathonFilter === 'International' && hack.scope !== 'International') return false;

    // Search query
    const query = searchQuery.toLowerCase();
    return (
      hack.title.toLowerCase().includes(query) ||
      hack.description.toLowerCase().includes(query) ||
      hack.prizePool.toLowerCase().includes(query)
    );
  });

  // Filter clubs
  const filteredClubs = clubs.filter(club => {
    const query = searchQuery.toLowerCase();
    return (
      club.name.toLowerCase().includes(query) ||
      club.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Page intro header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Trophy className="w-5.5 h-5.5 text-indigo-400" />
          <span>Hackathons & Student Clubs</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">Form squads for upcoming sprints and join community chapters representing coding, robotics, and design.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Hackathons Directory */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-4">
            
            {/* Subsection header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-indigo-400" />
                <span>Collegiate Hackathons</span>
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">Found {filteredHackathons.length}</span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 select-none">
              {['All', 'Upcoming', 'Online', 'Offline', 'National', 'International'].map(pill => (
                <button
                  key={pill}
                  id={`hackathon-pill-${pill.toLowerCase()}`}
                  onClick={() => setHackathonFilter(pill)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border shrink-0 transition-all cursor-pointer ${
                    hackathonFilter === pill
                      ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                      : 'bg-[#151c2c]/40 border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Hackathons list */}
            <div className="space-y-3.5">
              {filteredHackathons.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-500">
                  No hackathons match the selected tags or search query.
                </div>
              ) : (
                filteredHackathons.map((hack) => (
                  <div 
                    key={hack.id}
                    className="p-4 rounded-2xl bg-[#151c2c]/30 border border-[#1f2937] hover:border-indigo-500/10 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-white tracking-wide">{hack.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{hack.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold bg-[#111827] border border-[#1f2937] text-gray-400 px-2 py-0.5 rounded-lg font-mono">
                          {hack.type}
                        </span>
                        <span className="text-[9px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg">
                          {hack.scope}
                        </span>
                      </div>
                    </div>

                    {/* Meta information row */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#1f2937]/40 gap-3">
                      <div className="text-[11px] text-gray-400 space-x-4">
                        <span>Prize Pool: <strong className="text-amber-400 font-bold">{hack.prizePool}</strong></span>
                        <span className="text-gray-600">|</span>
                        <span>Date: <strong className="text-white font-medium">{hack.date}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedHackathonDetails(selectedHackathonDetails === hack.id ? null : hack.id)}
                          className="px-3 py-1.5 bg-[#111827] border border-[#1f2937] hover:border-indigo-500/20 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                        
                        <button
                          id={`hackathon-rsvp-${hack.id}`}
                          onClick={() => onRegisterHackathon(hack.id)}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                            hack.isRegistered 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                          }`}
                        >
                          {hack.isRegistered ? 'Registered ✓' : 'Register'}
                        </button>
                      </div>
                    </div>

                    {/* Expanded details container */}
                    {selectedHackathonDetails === hack.id && (
                      <div className="p-3 bg-[#111827]/80 rounded-xl border border-indigo-500/10 text-xs text-gray-400 space-y-2 animate-in fade-in duration-150">
                        <p className="font-semibold text-white">Guidelines & Rules:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                          <li>Requires valid college ID during registration verification.</li>
                          <li>Teams can have up to 4 members with cross-departmental participants.</li>
                          <li>Code commits must be pushed regularly to the official server branch.</li>
                          <li>Mentors from leading industrial entities will be hosting consultation panels.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: All Clubs Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-4">
            
            {/* Subsection header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-indigo-400" />
                <span>All Student Clubs</span>
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">Total {filteredClubs.length}</span>
            </div>

            {/* Clubs listing cards */}
            <div className="space-y-3">
              {filteredClubs.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500">
                  No clubs match your query.
                </div>
              ) : (
                filteredClubs.map((club) => {
                  const IconComp = getIconComponent(club.icon);
                  return (
                    <div 
                      key={club.id}
                      className="p-3.5 rounded-2xl bg-[#151c2c]/30 border border-[#1f2937] hover:border-indigo-500/15 transition-all space-y-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white tracking-wide">{club.name}</h4>
                            <span className="text-[9px] bg-indigo-500/5 text-indigo-400 font-bold px-2 py-0.5 rounded-md">
                              {club.category}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-500 font-bold shrink-0">{club.membersCount}</span>
                      </div>

                      {/* Join Action button */}
                      <button
                        id={`club-directory-join-${club.id}`}
                        onClick={() => onJoinClub(club.id)}
                        className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                          club.isJoined
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-sm'
                        }`}
                      >
                        {club.isJoined ? 'Joined ✓' : 'Join Chapter'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Simple promotional disclaimer */}
            <div className="p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-[10px] text-gray-500 text-center leading-relaxed">
              Want to start a new academic or recreational student club chapter? Formulate a proposal and present it to the Dean of Student Affairs.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
