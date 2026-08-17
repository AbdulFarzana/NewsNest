import React, { useState } from 'react';
import { Megaphone, PlusCircle, Info, Trash2 } from 'lucide-react';

export default function AnnouncementsView({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  searchQuery
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAdminForm, setShowAdminForm] = useState(false);
  
  // Admin form inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [issuer, setIssuer] = useState('Department Board');

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn = {
      id: `ann-${Date.now()}`,
      title,
      content,
      category,
      publishedAt: "Just now",
      issuer: issuer || "Department Board"
    };

    onAddAnnouncement(newAnn);
    setTitle('');
    setContent('');
    setCategory('General');
    setShowAdminForm(false);
  };

  // Filter based on selected category AND header search query
  const filtered = announcements.filter((ann) => {
    const matchesCategory = 
      activeCategory === 'All' || 
      ann.category === activeCategory || 
      (activeCategory === 'General' && ann.category === 'Info');

    const matchesSearch = 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.issuer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* View Header with Admin Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-5.5 h-5.5 text-indigo-400" />
            <span>Official College Announcements</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Check administrative releases, academic schedules, and department bulletins.</p>
        </div>

        <button
          id="toggle-ann-form"
          onClick={() => setShowAdminForm(!showAdminForm)}
          className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAdminForm ? 'Cancel Notice' : 'Post New Notice'}</span>
        </button>
      </div>

      {/* Admin New Notice Form */}
      {showAdminForm && (
        <div className="bg-[#111827] border border-indigo-500/20 rounded-3xl p-5 shadow-xl animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-white mb-4">Post Official Announcement Notice (Admin Mode)</h3>
          
          <form onSubmit={handleCreateAnnouncement} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-semibold text-gray-300 block">Notice Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. End Semester Exam Registration Deadline Extended"
                className="w-full bg-[#151c2c]/50 border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-300 block">Priority / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#151c2c]/50 border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="Important">Important (High Priority Red)</option>
                <option value="General">General (Medium Priority Blue)</option>
                <option value="Info">Info (Low Priority Grey)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-300 block">Issuing Authority</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Dean Academics / Administration"
                className="w-full bg-[#151c2c]/50 border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-semibold text-gray-300 block">Notice Details (Body Content)</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the complete announcement text details..."
                className="w-full bg-[#151c2c]/50 border border-[#1f2937] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
              />
            </div>

            <div className="md:col-span-2 pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdminForm(false)}
                className="px-4 py-2 bg-transparent text-gray-400 text-xs hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-colors"
              >
                Publish Notice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Tabs & Total Indicator */}
      <div className="flex items-center justify-between border-b border-[#1f2937]/50 pb-2">
        <div className="flex gap-2">
          {['All', 'Important', 'General'].map((cat) => (
            <button
              key={cat}
              id={`ann-cat-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' 
                  : 'bg-transparent border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Found {filtered.length} listings</span>
      </div>

      {/* Announcements List Layout */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-3xl p-5 text-gray-500 text-xs">
            No active notices match selected criteria.
          </div>
        ) : (
          filtered.map((ann) => (
            <div 
              key={ann.id}
              className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6 hover:border-indigo-500/10 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937]/50 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    ann.category === 'Important'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : ann.category === 'Info'
                        ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {ann.category}
                  </span>
                  
                  <span className="text-[11px] text-gray-500 font-medium">Published {ann.publishedAt}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-300 font-semibold px-2.5 py-1 bg-[#151c2c] border border-[#1f2937] rounded-xl">
                    Issued By: {ann.issuer}
                  </span>
                  {/* Option to delete simulated mock notices */}
                  {ann.id.startsWith('ann-') && ann.id !== 'ann-1' && ann.id !== 'ann-2' && (
                    <button
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="p-1 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                  {ann.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed whitespace-pre-line select-text">
                  {ann.content}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-[#151c2c]/30 rounded-xl p-2.5 w-fit border border-[#1f2937]/50">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Under normal procedures, this represents a certified notification authorized by {ann.issuer}.</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
