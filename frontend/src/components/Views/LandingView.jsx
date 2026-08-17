import React from 'react';
import { 
  Users, 
  CalendarDays, 
  Award, 
  UserCheck, 
  Newspaper, 
  Compass, 
  Sparkles, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function LandingView({ onNavigate }) {
  const stats = [
    { label: 'Clubs', count: '10+', icon: Users, color: 'text-indigo-400' },
    { label: 'Events', count: '50+', icon: CalendarDays, color: 'text-emerald-400' },
    { label: 'Hackathons', count: '100+', icon: Award, color: 'text-amber-400' },
    { label: 'Students', count: '5000+', icon: UserCheck, color: 'text-pink-400' },
  ];

  const features = [
    {
      title: "Campus News",
      desc: "Stay updated with the latest happenings, policy updates, and important announcements instantly.",
      icon: Newspaper,
      gradient: "from-blue-500/10 to-indigo-500/5",
      borderColor: "group-hover:border-blue-500/30",
      iconColor: "text-blue-400"
    },
    {
      title: "Events & Workshops",
      desc: "Discover and participate in exciting guest lectures, technical workshops, and cultural events.",
      icon: Compass,
      gradient: "from-emerald-500/10 to-teal-500/5",
      borderColor: "group-hover:border-emerald-500/30",
      iconColor: "text-emerald-400"
    },
    {
      title: "Hackathons",
      desc: "Compete in collegiate hackathons, form squads, and showcase your engineering talent to win prizes.",
      icon: Award,
      gradient: "from-amber-500/10 to-yellow-500/5",
      borderColor: "group-hover:border-amber-500/30",
      iconColor: "text-amber-400"
    },
    {
      title: "Clubs & Communities",
      desc: "Connect with students sharing similar passions in coding, robotics, arts, photography, or music.",
      icon: Users,
      gradient: "from-pink-500/10 to-purple-500/5",
      borderColor: "group-hover:border-pink-500/30",
      iconColor: "text-pink-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col selection:bg-indigo-500/30">
      {/* Header */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-[#1f2937]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">NewsNest</h1>
            <p className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">Campus Hub</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#hero" className="hover:text-white transition-colors">Home</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stats" className="hover:text-white transition-colors">Statistics</a>
          <a href="#footer" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <button 
          id="landing-get-started"
          onClick={() => onNavigate('LOGIN')}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-95"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section id="hero" className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Call-to-action */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing All-In-One Campus Hub</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stay Updated.<br />
            Stay Connected.<br />
            Stay <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Ahead.</span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
            NewsNest is your definitive campus portal. Discover official notices, participate in state-level hackathons, connect with passion clubs, and network with your collegiate peers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="landing-join-now"
              onClick={() => onNavigate('LOGIN')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-600/35 hover:shadow-indigo-600/50 flex items-center gap-2 group cursor-pointer"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="landing-explore"
              onClick={() => onNavigate('LOGIN')}
              className="px-8 py-4 bg-[#111827] hover:bg-[#1f2937] text-gray-300 hover:text-white font-semibold rounded-xl text-sm border border-[#1f2937] transition-all duration-200"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Right Illustration Column */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl filter blur-3xl opacity-30 -z-10" />
          <div className="w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden border border-[#1f2937] shadow-2xl relative group">
            {/* Dark Starry Campus Overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800" 
              alt="Campus Building" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Visual labels overlay inside the image */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2">
              <span className="text-[10px] bg-indigo-500 text-white font-bold tracking-widest uppercase px-2.5 py-1 rounded-full w-fit">
                VJIT CAMPUS
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide">Connecting 5000+ Students Every Day</h3>
              <p className="text-xs text-gray-300">Experience a unified campus environment like never before.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="bg-[#111827]/40 border-y border-[#1f2937]/50 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center p-4">
                  <div className={`p-3 rounded-2xl bg-[#111827] border border-[#1f2937] ${stat.color} mb-3 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{stat.count}</span>
                  <span className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wider">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 md:py-24">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Everything You Need, In One Place</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Say goodbye to messy WhatsApp groups and delayed email forwards. Get standard real-time access to everything campus has to offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i}
                className={`group p-6 rounded-2xl bg-[#111827] border border-[#1f2937] transition-all duration-300 hover:-translate-y-1 hover:bg-[#111827]/80 hover:border-indigo-500/30 flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center ${feature.iconColor} mb-4`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 tracking-wide">{feature.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#1f2937]/50 flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 cursor-pointer">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-[#060a13] border-t border-[#1f2937]/50 py-10 mt-auto text-center text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold text-white">NewsNest</span>
            <span className="text-gray-600">|</span>
            <span>All-In-One Campus Hub</span>
          </div>
          <p>© 2026 NewsNest College Portal. Designed for seamless academic and extra-curricular growth.</p>
        </div>
      </footer>
    </div>
  );
}
