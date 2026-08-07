import React from 'react';
import { 
  Megaphone, 
  Calendar, 
  Trophy, 
  Users, 
  MessageSquare, 
  ArrowUpRight, 
  TrendingUp, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';

export default function DashboardView({
  user,
  announcements,
  events,
  hackathons,
  clubs,
  posts,
  onNavigate,
  onRegisterEvent,
  onJoinClub,
  searchQuery
}) {
  // Compute basic stats
  const activeEvents = events.filter(e => e.category === 'Upcoming');
  const recentPost = posts[0] || null;

  // Filter based on parent search queries
  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const filteredEvents = events.filter(evt =>
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner Card with dynamic glowing backgrounds */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/20 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
        
        {/* Absolute dynamic visual elements */}
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-purple-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Spring Term Active</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-wide leading-snug">
            Welcome, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user.name}</span>!
          </h2>

          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            Your centralized collegiate space is ready. You have <strong className="text-indigo-400">{announcements.filter(a => a.category === 'Important').length} important notices</strong> requiring inspection, and your active badge count is <strong className="text-indigo-400">{user.badgesCount} badges</strong>.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('ANNOUNCEMENTS')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md transition-colors cursor-pointer"
            >
              <span>Inspect Bulletins</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-col Area: Notices and Events */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Important Notices panel */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4.5 h-4.5 text-indigo-400" />
                <span>Notice Bulletin Board</span>
              </h3>
              <button 
                onClick={() => onNavigate('ANNOUNCEMENTS')} 
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>All Notices</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {filteredAnnouncements.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No notices matched your query.</p>
              ) : (
                filteredAnnouncements.map((ann) => (
                  <div 
                    key={ann.id}
                    className="p-3.5 rounded-2xl bg-[#151c2c]/30 border border-[#1f2937] hover:border-indigo-500/10 transition-colors flex items-start gap-3.5"
                  >
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                      ann.category === 'Important' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {ann.category}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white tracking-wide truncate">{ann.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 select-text">{ann.content}</p>
                      <span className="text-[10px] text-gray-500 block mt-1.5 font-medium">Issued by: {ann.issuer} • {ann.publishedAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Featured Upcoming Seminars Panel */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                <span>Upcoming Campus Events</span>
              </h3>
              <button 
                onClick={() => onNavigate('EVENTS')} 
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Browse All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredEvents.length === 0 ? (
                <div className="col-span-full text-center py-6 text-xs text-gray-500">No events matched your query.</div>
              ) : (
                filteredEvents.map((evt) => (
                  <div 
                    key={evt.id}
                    className="bg-[#151c2c]/20 border border-[#1f2937] rounded-2xl overflow-hidden hover:border-indigo-500/15 transition-all flex flex-col justify-between"
                  >
                    <div className="p-4 space-y-2">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">{evt.date}</span>
                      <h4 className="text-xs font-extrabold text-white leading-snug line-clamp-2 select-text">{evt.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-normal line-clamp-3 select-text">{evt.description}</p>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        id={`dashboard-rsvp-btn-${evt.id}`}
                        onClick={() => onRegisterEvent(evt.id)}
                        className={`w-full py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          evt.isRegistered 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {evt.isRegistered ? 'RSVP Confirmed ✓' : 'Register RSVP'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right 4-col Area: Student metrics, Club Highlights and Latest Feed posts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Metrics panels */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-[#1f2937]/50 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
              <span>Collegiate Dashboard Stats</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#151c2c]/40 border border-[#1f2937]/60 rounded-2xl">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Joined Clubs</span>
                <span className="text-xl font-bold text-white mt-1 block">{user.clubsCount}</span>
              </div>
              <div className="p-3 bg-[#151c2c]/40 border border-[#1f2937]/60 rounded-2xl">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">RSVP Counters</span>
                <span className="text-xl font-bold text-indigo-400 mt-1 block">{user.eventsJoinedCount}</span>
              </div>
              <div className="p-3 bg-[#151c2c]/40 border border-[#1f2937]/60 rounded-2xl">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Forum Posts</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">{user.postsCount}</span>
              </div>
              <div className="p-3 bg-[#151c2c]/40 border border-[#1f2937]/60 rounded-2xl">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Earned Badges</span>
                <span className="text-xl font-bold text-amber-400 mt-1 block">{user.badgesCount}</span>
              </div>
            </div>
          </div>

          {/* Featured Club highlight */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4.5 h-4.5 text-indigo-400" />
                <span>Suggested Student Chapters</span>
              </h3>
              <button 
                onClick={() => onNavigate('HACKATHONS')} 
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
              >
                Clubs List
              </button>
            </div>

            <div className="space-y-3">
              {clubs.slice(0, 2).map((club) => (
                <div key={club.id} className="p-3 rounded-2xl bg-[#151c2c]/20 border border-[#1f2937]/80 flex justify-between items-center gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{club.name}</h4>
                    <span className="text-[9px] text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
                      {club.category}
                    </span>
                  </div>

                  <button
                    id={`dashboard-join-${club.id}`}
                    onClick={() => onJoinClub(club.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      club.isJoined 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {club.isJoined ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent active post bubble */}
          {recentPost && (
            <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-[#1f2937]/50 flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
                <span>Trending Community Thread</span>
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={recentPost.userAvatar} 
                    alt={recentPost.userName} 
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#1f2937]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{recentPost.userName}</h4>
                    <span className="text-[9px] text-gray-500 font-medium">{recentPost.publishedAt}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 select-text">{recentPost.content}</p>
                
                <button
                  onClick={() => onNavigate('COMMUNITY_FEED')}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 pt-1 cursor-pointer"
                >
                  <span>View Discussion Feed</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
