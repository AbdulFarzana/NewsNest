import React, { useEffect, useRef, useState } from 'react';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Check,
  Edit2,
  ShieldAlert,
  Camera,
  X,
  Building2,
  GraduationCap,
  Users,
  Loader2
} from 'lucide-react';

const CLUB_OPTIONS = [
  {
    id: 'coding',
    name: 'Coding Club',
    category: 'Technical'
  },
  {
    id: 'design',
    name: 'Design Club',
    category: 'Arts & Creative'
  },
  {
    id: 'ai',
    name: 'AI & ML Club',
    category: 'Technology'
  },
  {
    id: 'robotics',
    name: 'Robotics Club',
    category: 'Technical'
  },
  {
    id: 'sports',
    name: 'Sports Club',
    category: 'Sports'
  },
  {
    id: 'literary',
    name: 'Literary Club',
    category: 'Cultural'
  },
  {
    id: 'music',
    name: 'Music Club',
    category: 'Cultural'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship Club',
    category: 'Business'
  }
];

export default function ProfileView({
  user,
  onUpdateUser
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editRoll, setEditRoll] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editYear, setEditYear] = useState('');

  const [selectedClubs, setSelectedClubs] = useState([]);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditLocation(user?.location || '');
    setEditRoll(user?.rollNumber || '');
    setEditDepartment(user?.department || '');
    setEditYear(user?.year || '');

    setAvatarPreview(user?.avatar || '');

    setSelectedClubs(
      Array.isArray(user?.interestedClubs)
        ? user.interestedClubs
        : []
    );
  }, [user]);

  const getAvatar = () => {
    if (avatarPreview) {
      return avatarPreview;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || 'User'
    )}&background=4f46e5&color=ffffff&bold=true`;
  };

  const handleEdit = () => {
    setMessage('');
    setError('');

    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditLocation(user?.location || '');
    setEditRoll(user?.rollNumber || '');
    setEditDepartment(user?.department || '');
    setEditYear(user?.year || '');

    setAvatarPreview(user?.avatar || '');
    setAvatarFile(null);

    setSelectedClubs(
      Array.isArray(user?.interestedClubs)
        ? user.interestedClubs
        : []
    );

    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditLocation(user?.location || '');
    setEditRoll(user?.rollNumber || '');
    setEditDepartment(user?.department || '');
    setEditYear(user?.year || '');

    setAvatarPreview(user?.avatar || '');
    setAvatarFile(null);

    setSelectedClubs(
      Array.isArray(user?.interestedClubs)
        ? user.interestedClubs
        : []
    );

    setMessage('');
    setError('');

    setIsEditing(false);
  };

  const toggleClub = club => {
    const alreadySelected = selectedClubs.some(
      selectedClub => selectedClub.id === club.id
    );

    if (alreadySelected) {
      setSelectedClubs(
        selectedClubs.filter(
          selectedClub => selectedClub.id !== club.id
        )
      );
    } else {
      setSelectedClubs([
        ...selectedClubs,
        {
          id: club.id,
          name: club.name,
          category: club.category
        }
      ]);
    }
  };

  const handleAvatarChange = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Profile image must be less than 5 MB.'
      );
      return;
    }

    setError('');

    setAvatarFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setMessage('');
    setError('');

    if (!editName.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    const updatedUser = {
      name: editName.trim(),
      phone: editPhone.trim(),
      rollNumber: editRoll.trim(),
      location: editLocation.trim(),
      department: editDepartment.trim(),
      year: editYear.trim(),
      interestedClubs: selectedClubs
    };

    try {
      setLoading(true);

      const result = await onUpdateUser(
        updatedUser,
        avatarFile
      );

      if (!result || !result.success) {
        setError(
          result?.message ||
          'Failed to update profile.'
        );
        return;
      }

      if (result.user) {
        setAvatarPreview(
          result.user.avatar || ''
        );

        setSelectedClubs(
          Array.isArray(result.user.interestedClubs)
            ? result.user.interestedClubs
            : selectedClubs
        );
      }

      setAvatarFile(null);

      setMessage(
        'Profile updated successfully!'
      );

      setIsEditing(false);

    } catch (err) {
      console.error(
        'Profile update error:',
        err
      );

      setError(
        'Unable to update profile.'
      );

    } finally {
      setLoading(false);
    }
  };

  const clubsCount = selectedClubs.length;

  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">

          <User className="w-5 h-5 text-indigo-400" />

          <span>
            My Student Profile
          </span>

        </h2>

        <p className="text-xs text-gray-400 mt-1">
          Manage your profile information and select your interested clubs.
        </p>

      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-xs flex items-center gap-2">

          <Check className="w-4 h-4" />

          {message}

        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-xs">

          {error}

        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-7 bg-[#111827] border border-[#1f2937] rounded-3xl overflow-hidden shadow-xl">

          <div className="h-28 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 relative">

            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-3 right-4">

              <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/35 text-indigo-400 font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                ACTIVE STUDENT PROFILE
              </span>

            </div>

          </div>

          <div className="px-6 pb-6 relative">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">

              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">

                <div className="relative">

                  <img
                    src={getAvatar()}
                    alt={user?.name || 'User'}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#111827] bg-[#111827] shadow-xl"
                  />

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 border-2 border-[#111827] flex items-center justify-center cursor-pointer transition-all"
                    >

                      <Camera className="w-4 h-4 text-white" />

                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />

                </div>

                <div className="space-y-1">

                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={e =>
                        setEditName(e.target.value)
                      }
                      placeholder="Enter your name"
                      className="bg-[#151c2c] border border-indigo-500/40 rounded-xl px-3 py-1.5 text-sm text-white font-bold w-full max-w-[240px] outline-none"
                    />
                  ) : (
                    <h3 className="text-lg font-extrabold text-white tracking-wide">
                      {user?.name || 'Student'}
                    </h3>
                  )}

                  <p className="text-xs text-indigo-400 font-semibold capitalize">
                    {user?.role || 'student'}
                  </p>

                  <p className="text-[10px] text-gray-500 font-medium">
                    {user?.email || 'No email available'}
                  </p>

                </div>

              </div>

              <div className="shrink-0 flex gap-2">

                {isEditing ? (
                  <>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-3 py-2 bg-[#151c2c] hover:bg-[#1c2638] text-gray-300 border border-[#1f2937] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                    >

                      <X className="w-4 h-4" />

                      Cancel

                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-60"
                    >

                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}

                      <span>
                        {loading
                          ? 'Saving...'
                          : 'Save Changes'}
                      </span>

                    </button>

                  </>
                ) : (
                  <button
                    id="profile-edit-btn"
                    onClick={handleEdit}
                    className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >

                    <Edit2 className="w-3.5 h-3.5" />

                    <span>
                      Edit Profile
                    </span>

                  </button>
                )}

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#1f2937]/50 pt-5">

              <ProfileField
                icon={
                  <User className="w-4 h-4 text-indigo-400 shrink-0" />
                }
                label="Roll Number"
                value={editRoll}
                displayValue={user?.rollNumber}
                isEditing={isEditing}
                onChange={setEditRoll}
              />

              <div className="flex items-center gap-3 p-3 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/40 text-xs">

                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />

                <div className="flex-1">

                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">
                    Email Address
                  </span>

                  <span className="text-gray-200 font-semibold truncate block mt-1">
                    {user?.email || 'Not available'}
                  </span>

                </div>

              </div>

              <ProfileField
                icon={
                  <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                }
                label="Phone Number"
                value={editPhone}
                displayValue={user?.phone}
                isEditing={isEditing}
                onChange={setEditPhone}
              />

              <ProfileField
                icon={
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                }
                label="Location"
                value={editLocation}
                displayValue={user?.location}
                isEditing={isEditing}
                onChange={setEditLocation}
              />

              <ProfileField
                icon={
                  <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                }
                label="Department"
                value={editDepartment}
                displayValue={user?.department}
                placeholder="Example: CSE"
                isEditing={isEditing}
                onChange={setEditDepartment}
              />

              <ProfileField
                icon={
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                }
                label="Year"
                value={editYear}
                displayValue={user?.year}
                placeholder="Example: 4th Year"
                isEditing={isEditing}
                onChange={setEditYear}
              />

            </div>

            {isEditing && (

              <div className="border-t border-[#1f2937]/50 pt-5 mt-5">

                <div className="flex items-center gap-2 mb-4">

                  <Users className="w-4 h-4 text-emerald-400" />

                  <div>

                    <h3 className="text-sm font-bold text-white">
                      Interested Clubs
                    </h3>

                    <p className="text-[10px] text-gray-500">
                      Select the clubs you are interested in.
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {CLUB_OPTIONS.map(club => {

                    const isSelected =
                      selectedClubs.some(
                        selectedClub =>
                          selectedClub.id === club.id
                      );

                    return (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() =>
                          toggleClub(club)
                        }
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                          ? 'bg-indigo-500/15 border-indigo-500/60'
                          : 'bg-[#151c2c]/30 border-[#1f2937]/50 hover:border-indigo-500/30'
                          }`}
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <p className="text-xs font-bold text-white">
                              {club.name}
                            </p>

                            <p className="text-[9px] text-gray-500 mt-1">
                              {club.category}
                            </p>

                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected
                              ? 'bg-indigo-600 border-indigo-500'
                              : 'border-gray-600'
                              }`}
                          >

                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}

                          </div>

                        </div>

                      </button>
                    );
                  })}

                </div>

              </div>

            )}

            <div className="border-t border-[#1f2937]/50 pt-5 mt-5 text-center">

              <div className="max-w-xs mx-auto p-4 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/30">

                <Users className="w-5 h-5 text-emerald-400 mx-auto mb-2" />

                <span className="text-xl font-extrabold text-emerald-400 block">
                  {clubsCount}
                </span>

                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block mt-1">
                  Interested Clubs
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="lg:col-span-5 space-y-4">

          <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-sm space-y-3">

            <h3 className="text-sm font-bold text-white pb-2 border-b border-[#1f2937]/50 flex items-center gap-2">

              <Sparkles className="w-4 h-4 text-indigo-400" />

              <span>
                My Interested Clubs ({clubsCount})
              </span>

            </h3>

            {clubsCount === 0 ? (

              <p className="text-xs text-gray-500 text-center py-4">
                You haven't selected any clubs yet.
              </p>

            ) : (

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">

                {selectedClubs.map(club => (

                  <div
                    key={club.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-[#151c2c]/30 border border-[#1f2937]/40"
                  >

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">

                        <Users className="w-4 h-4 text-indigo-400" />

                      </div>

                      <span className="text-xs text-white font-semibold">
                        {club.name}
                      </span>

                    </div>

                    <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full font-bold">
                      {club.category}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2.5">

            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />

            <p className="text-[10px] text-gray-500 leading-relaxed">
              Your profile information and club preferences are securely saved
              to your NewsNest account. You can update them anytime.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  displayValue,
  placeholder,
  isEditing,
  onChange
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#151c2c]/30 rounded-xl border border-[#1f2937]/40 text-xs">

      {icon}

      <div className="flex-1">

        <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">
          {label}
        </span>

        {isEditing ? (

          <input
            type="text"
            value={value}
            onChange={e =>
              onChange(e.target.value)
            }
            placeholder={placeholder}
            className="mt-1 bg-[#111827] border border-indigo-500/30 rounded px-2 py-1 text-white w-full text-xs outline-none"
          />

        ) : (

          <span className="text-gray-200 font-semibold">
            {displayValue || 'Not added'}
          </span>

        )}

      </div>

    </div>
  );
}