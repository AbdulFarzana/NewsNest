import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, Sparkles, Check, Edit2, ShieldAlert } from 'lucide-react';

export default function ProfileView({
  user,
  onUpdateUser,
  joinedClubs,
  registeredEvents
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editLocation, setEditLocation] = useState(user.location);
  const [editRoll, setEditRoll] = useState(user.rollNumber);
  const [editAge, setEditAge] = useState(user.age);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: editName,
      role: editRole,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      rollNumber: editRoll,
      age: Number(editAge) || user.age,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-5.5 h-5.5 text-indigo-400" />
          <span>My Student Profile</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">Manage collegiate registry records, view credentials, track joined clubs, and update details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Profile Card Section */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1f2937] rounded-3xl overflow-hidden shadow-xl">
          
          {/* Header background banner decorative block */}
          <div className="h-28 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 relative">
            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 right-4 flex gap-1 select-none">
              <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/35 text-indigo-400 font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                ACTIVE DIGITAL ID
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 relative">
            {/* Center avatar overlay with offset */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#111827] bg-[#111827] shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-[#151c2c] border border-indigo-500/40 rounded-xl px-2.5 py-1 text-sm text-white font-bold max-w-[200px]"
                    />
                  ) : (
                    <h3 className="text-lg font-extrabold text-white tracking-wide">{user.name}</h3>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="bg-[#151c2c] border border-[#1f2937] rounded-xl px-2 py-0.5 text-xs text-gray-300 block max-w-[200px]"
                    />
                  ) : (
                    <p className="text-xs text-indigo-400 font-semibold">{user.role}</p>
                  )}
                  <p className="text-[10px] text-gray-500 font-medium">Joined: {user.joinedDate} • {isEditing ? (
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(Number(e.target.value))}
                      className="bg-[#151c2c] border border-[#1f2937] rounded px-1.5 w-12 text-[10px] text-white"
                    />
                  ) : `${user.age} Years Old`}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                ) : (
                  <button
                    id="profile-edit-btn"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Structured Registry Parameters List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#1f2937]/50 pt-5">
              
              <div className="flex items-center gap-3 p-3 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/40 text-xs">
                <User className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Roll Number</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editRoll}
                      onChange={(e) => setEditRoll(e.target.value)}
                      className="bg-[#111827] border border-indigo-500/30 rounded px-2 py-0.5 text-white w-full text-xs"
                    />
                  ) : (
                    <span className="text-gray-200 font-semibold">{user.rollNumber}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/40 text-xs">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Email Address</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="bg-[#111827] border border-indigo-500/30 rounded px-2 py-0.5 text-white w-full text-xs"
                    />
                  ) : (
                    <span className="text-gray-200 font-semibold truncate block max-w-[180px]">{user.email}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/40 text-xs">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Phone Number</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="bg-[#111827] border border-indigo-500/30 rounded px-2 py-0.5 text-white w-full text-xs"
                    />
                  ) : (
                    <span className="text-gray-200 font-semibold">{user.phone}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/40 text-xs">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Location / Origin</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="bg-[#111827] border border-indigo-500/30 rounded px-2 py-0.5 text-white w-full text-xs"
                    />
                  ) : (
                    <span className="text-gray-200 font-semibold">{user.location}</span>
                  )}
                </div>
              </div>

            </div>

            {/* Metric counters blocks */}
            <div className="grid grid-cols-4 gap-2 border-t border-[#1f2937]/50 pt-5 mt-5 text-center">
              <div className="p-2 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/30">
                <span className="text-base md:text-xl font-extrabold text-white block">{user.postsCount}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block mt-0.5">Posts</span>
              </div>
              <div className="p-2 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/30">
                <span className="text-base md:text-xl font-extrabold text-indigo-400 block">{user.eventsJoinedCount}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block mt-0.5">RSVPs</span>
              </div>
              <div className="p-2 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/30">
                <span className="text-base md:text-xl font-extrabold text-emerald-400 block">{user.clubsCount}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block mt-0.5">Clubs</span>
              </div>
              <div className="p-2 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/30">
                <span className="text-base md:text-xl font-extrabold text-amber-400 block">{user.badgesCount}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block mt-0.5">Badges</span>
              </div>
            </div>

          </div>

        </div>

        {/* Side Panel: Joined Clubs & RSVPs Trackers */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Joined Clubs */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-[#1f2937]/50 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
              <span>My Joined Chapters ({joinedClubs.length})</span>
            </h3>

            {joinedClubs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">You haven't joined any clubs yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {joinedClubs.map(club => (
                  <div key={club.id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#151c2c]/30 border border-[#1f2937]/40">
                    <span className="text-xs text-white font-semibold">{club.name}</span>
                    <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-bold">
                      {club.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmed Seminars / Workshops */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-[#1f2937]/50 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-indigo-400" />
              <span>Registered RSVPs ({registeredEvents.length})</span>
            </h3>

            {registeredEvents.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No confirmed RSVPs yet. Browse events to register.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {registeredEvents.map(evt => (
                  <div key={evt.id} className="p-2.5 rounded-xl bg-[#151c2c]/30 border border-[#1f2937]/40 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white font-semibold truncate max-w-[180px]">{evt.title}</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full font-bold">
                        {evt.date}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">Venue: {evt.location} • {evt.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Administrative Security Note */}
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Official university digital identification records are updated dynamically. If any academic major or graduation year mismatch appears, please raise an administrative ticket at registry.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
