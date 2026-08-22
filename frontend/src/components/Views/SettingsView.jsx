import React, { useState } from 'react';

import {
  Moon,
  Sun,
  Trash2,
  Info,
  Heart,
  FileText,
  ChevronRight,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';

export default function SettingsView({
  theme,
  onThemeChange,
  likedPosts = [],
  onNavigate,
  onDeleteAccount
}) {

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showTerms, setShowTerms] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const handleDeleteAccount = async () => {

    setDeleting(true);

    const result =
      await onDeleteAccount();

    setDeleting(false);

    if (result.success) {
      setShowDeleteModal(false);
    } else if (!result.cancelled) {
      alert(
        result.message ||
        'Failed to delete account'
      );
    }

  };

  const getPostAuthor = post => {

    if (post.userName) {
      return post.userName;
    }

    if (post.author?.name) {
      return post.author.name;
    }

    if (post.user?.name) {
      return post.user.name;
    }

    if (post.user?.username) {
      return post.user.username;
    }

    return 'Student';

  };

  const getPostDate = post => {

    const date =
      post.updatedAt ||
      post.createdAt ||
      post.publishedAt;

    if (!date) {
      return 'Recently';
    }

    try {
      return new Date(date).toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      );
    } catch (error) {
      return 'Recently';
    }

  };

  return (

    <div className="max-w-5xl mx-auto space-y-6">

      {/* PAGE HEADER */}

      <div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Settings
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Manage your preferences, account and
          NewsNest information.
        </p>

      </div>


      {/* APPEARANCE */}

      <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">

            {theme === 'dark' ? (

              <Moon className="w-5 h-5 text-indigo-400" />

            ) : (

              <Sun className="w-5 h-5 text-amber-400" />

            )}

          </div>

          <div>

            <h2 className="text-base font-bold text-white">
              Appearance
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Choose your preferred NewsNest theme.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


          {/* DARK MODE */}

          <button
            onClick={() => onThemeChange('dark')}
            className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer ${theme === 'dark'
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-[#1f2937] bg-[#151c2c]/30 hover:border-gray-600'
              }`}
          >

            {theme === 'dark' && (

              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">

                <Check className="w-3.5 h-3.5 text-white" />

              </div>

            )}

            <Moon className="w-6 h-6 text-indigo-400 mb-3" />

            <h3 className="text-sm font-bold text-white">
              Dark Mode
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Dark interface for comfortable viewing.
            </p>

          </button>


          {/* LIGHT MODE */}

          <button
            onClick={() => onThemeChange('light')}
            className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer ${theme === 'light'
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-[#1f2937] bg-[#151c2c]/30 hover:border-gray-600'
              }`}
          >

            {theme === 'light' && (

              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">

                <Check className="w-3.5 h-3.5 text-white" />

              </div>

            )}

            <Sun className="w-6 h-6 text-amber-400 mb-3" />

            <h3 className="text-sm font-bold text-white">
              Light Mode
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Bright and clean interface.
            </p>

          </button>

        </div>

      </div>


      {/* RECENTLY LIKED POSTS */}

      <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">

              <Heart className="w-5 h-5 text-pink-400" />

            </div>

            <div>

              <h2 className="text-base font-bold text-white">
                Recently Liked Posts
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Posts you recently liked in the community.
              </p>

            </div>

          </div>


          <button
            onClick={() =>
              onNavigate('COMMUNITY_FEED')
            }
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >

            Community

            <ChevronRight className="w-4 h-4" />

          </button>

        </div>


        {likedPosts.length === 0 ? (

          <div className="py-8 text-center">

            <Heart className="w-8 h-8 text-gray-600 mx-auto mb-3" />

            <p className="text-sm text-gray-400">
              No liked posts yet
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Posts you like will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {likedPosts
              .slice(0, 5)
              .map(post => (

                <div
                  key={
                    post._id ||
                    post.id
                  }
                  className="p-4 rounded-2xl bg-[#151c2c]/40 border border-[#1f2937]"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <div className="flex items-center gap-2 mb-2">

                        <span className="text-xs font-bold text-white">

                          {getPostAuthor(post)}

                        </span>

                        <span className="text-[10px] text-gray-500">

                          {getPostDate(post)}

                        </span>

                      </div>


                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">

                        {post.content}

                      </p>

                    </div>


                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0" />

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>


      {/* ABOUT */}

      <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

            <Info className="w-5 h-5 text-blue-400" />

          </div>

          <div>

            <h2 className="text-base font-bold text-white">
              About NewsNest
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Your centralized college communication platform.
            </p>

          </div>

        </div>


        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">

          <p>

            <span className="font-semibold text-white">
              NewsNest
            </span>{' '}

            is a centralized campus hub designed to help
            students stay connected with announcements,
            events, hackathons, clubs and community
            discussions.

          </p>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div className="p-4 rounded-2xl bg-[#151c2c]/40 border border-[#1f2937]">

              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Platform
              </span>

              <p className="text-sm font-bold text-white mt-2">
                Campus Hub
              </p>

            </div>


            <div className="p-4 rounded-2xl bg-[#151c2c]/40 border border-[#1f2937]">

              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Frontend
              </span>

              <p className="text-sm font-bold text-white mt-2">
                React
              </p>

            </div>


            <div className="p-4 rounded-2xl bg-[#151c2c]/40 border border-[#1f2937]">

              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Backend
              </span>

              <p className="text-sm font-bold text-white mt-2">
                Node & MongoDB
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* TERMS */}

      <div className="bg-[#111827] border border-[#1f2937] rounded-3xl overflow-hidden">

        <button
          onClick={() =>
            setShowTerms(!showTerms)
          }
          className="w-full p-5 md:p-6 flex items-center justify-between hover:bg-[#151c2c]/30 transition-colors cursor-pointer"
        >

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

              <FileText className="w-5 h-5 text-emerald-400" />

            </div>

            <div className="text-left">

              <h2 className="text-base font-bold text-white">
                Terms & Conditions
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Read the guidelines for using NewsNest.
              </p>

            </div>

          </div>


          <ChevronRight
            className={`w-5 h-5 text-gray-400 transition-transform ${showTerms
              ? 'rotate-90'
              : ''
              }`}
          />

        </button>


        {showTerms && (

          <div className="px-5 md:px-6 pb-6 border-t border-[#1f2937]">

            <div className="pt-5 space-y-4 text-xs text-gray-400 leading-relaxed">

              <div>

                <h3 className="text-sm font-bold text-white mb-1">
                  1. Responsible Usage
                </h3>

                <p>
                  Users must use NewsNest responsibly and
                  should not post harmful, abusive, misleading
                  or inappropriate content.
                </p>

              </div>


              <div>

                <h3 className="text-sm font-bold text-white mb-1">
                  2. Account Security
                </h3>

                <p>
                  Users are responsible for maintaining the
                  security of their account and login
                  credentials.
                </p>

              </div>


              <div>

                <h3 className="text-sm font-bold text-white mb-1">
                  3. Community Content
                </h3>

                <p>
                  Community posts should follow college and
                  platform guidelines. Inappropriate content
                  may be removed.
                </p>

              </div>


              <div>

                <h3 className="text-sm font-bold text-white mb-1">
                  4. Account Deletion
                </h3>

                <p>
                  Users can permanently delete their account.
                  Once deleted, account information cannot
                  be recovered.
                </p>

              </div>

            </div>

          </div>

        )}

      </div>


      {/* DELETE ACCOUNT */}

      <div className="bg-red-500/[0.03] border border-red-500/20 rounded-3xl p-5 md:p-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

          <div className="flex gap-3">

            <div className="w-10 h-10 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center">

              <AlertTriangle className="w-5 h-5 text-red-400" />

            </div>

            <div>

              <h2 className="text-base font-bold text-red-400">
                Delete Account
              </h2>

              <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">

                Permanently delete your NewsNest account and
                remove your account data from our database.
                This action cannot be undone.

              </p>

            </div>

          </div>


          <button
            onClick={() =>
              setShowDeleteModal(true)
            }
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >

            <Trash2 className="w-4 h-4" />

            Delete Account

          </button>

        </div>

      </div>


      {/* DELETE MODAL */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-[#111827] border border-red-500/30 rounded-3xl p-6 shadow-2xl">

            <div className="flex justify-between items-start mb-5">

              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">

                <AlertTriangle className="w-6 h-6 text-red-400" />

              </div>


              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="text-gray-400 hover:text-white cursor-pointer"
              >

                <X className="w-5 h-5" />

              </button>

            </div>


            <h2 className="text-lg font-bold text-white">
              Delete your account?
            </h2>


            <p className="text-sm text-gray-400 mt-2 leading-relaxed">

              Your account will be permanently removed from
              NewsNest. This action cannot be undone.

            </p>


            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-[#1f2937] hover:bg-[#273244] text-sm font-semibold text-white transition-colors cursor-pointer"
              >

                Cancel

              </button>


              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
              >

                {deleting
                  ? 'Deleting...'
                  : 'Yes, Delete'}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}