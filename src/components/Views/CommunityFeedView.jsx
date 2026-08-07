import React, { useState } from 'react';
import { MessageSquare, Heart, Send, Sparkles, PlusCircle, Globe, ChevronDown, ChevronUp, Image } from 'lucide-react';

export default function CommunityFeedView({
  user,
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
  searchQuery
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [showCompose, setShowCompose] = useState(false);

  // Compose post states
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [clubNameInput, setClubNameInput] = useState('');

  // Comment input per-post state map
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const imagesArray = imageUrlInput.trim() ? [imageUrlInput.trim()] : undefined;

    const newPost = {
      id: `post-${Date.now()}`,
      userName: user.name,
      userRole: user.role,
      userAvatar: user.avatarUrl,
      content: newPostContent,
      publishedAt: "Just now",
      likes: 0,
      isLiked: false,
      clubName: clubNameInput.trim() || undefined,
      images: imagesArray,
      comments: []
    };

    onAddPost(newPost);
    setNewPostContent('');
    setImageUrlInput('');
    setClubNameInput('');
    setShowCompose(false);
  };

  const handleCreateComment = (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      userName: user.name,
      userRole: user.role,
      content: text,
      publishedAt: "Just now"
    };

    onAddComment(postId, newComment);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Filter based on parent header search and tab filter
  const filteredPosts = posts.filter(post => {
    // Search matching content or creator
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.clubName && post.clubName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Tab categories filter
    if (activeTab === 'Clubs') {
      return !!post.clubName;
    } else if (activeTab === 'My Posts') {
      return post.userName === user.name;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* View Header with Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5.5 h-5.5 text-indigo-400" />
            <span>Collegiate Discussions & Forums</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Converse with peers, ask questions, post achievements, and interact with official student chapters.</p>
        </div>

        <button
          id="toggle-post-composer"
          onClick={() => setShowCompose(!showCompose)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showCompose ? 'Cancel Post' : 'Compose Thread'}</span>
        </button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#1f2937]"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">{user.name}</h4>
              <p className="text-[10px] text-gray-400 leading-none mt-1">Posting publicly to campus feed</p>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3.5">
            <textarea
              required
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind? Share announcements, seek project team members, or ask a question..."
              className="w-full bg-[#151c2c]/40 border border-[#1f2937] rounded-2xl p-4 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 min-h-[110px] resize-none leading-relaxed"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 block">Optional image asset URL</label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... (Image URL)"
                  className="w-full bg-[#151c2c]/40 border border-[#1f2937] rounded-xl px-3.5 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 block">Optional Club name tag</label>
                <input
                  type="text"
                  value={clubNameInput}
                  onChange={(e) => setClubNameInput(e.target.value)}
                  placeholder="e.g. Coding Club / Robotics Society"
                  className="w-full bg-[#151c2c]/40 border border-[#1f2937] rounded-xl px-3.5 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white bg-transparent transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                id="feed-post-submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 cursor-pointer transition-colors"
              >
                Share Thread
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Tab selector */}
      <div className="flex items-center justify-between border-b border-[#1f2937]/50 pb-2 select-none">
        <div className="flex gap-2">
          {['All', 'Clubs', 'My Posts'].map(tab => (
            <button
              key={tab}
              id={`feed-tab-${tab.toLowerCase().replace(' ', '-')}`}
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
        <span className="text-[10px] text-gray-500 font-mono">Viewing {filteredPosts.length} discussions</span>
      </div>

      {/* Discussion List */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-3xl p-5 text-gray-500 text-xs">
            No active discussion threads matching selected tags.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6 hover:border-[#1f2937]/80 transition-all shadow-sm space-y-4"
            >
              {/* Creator details header */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.userAvatar} 
                    alt={post.userName} 
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/5"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-white tracking-wide">{post.userName}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{post.userRole}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-[10px] text-gray-500 font-medium">
                  <span>{post.publishedAt}</span>
                  {post.clubName && (
                    <span className="bg-[#151c2c] border border-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider">
                      {post.clubName}
                    </span>
                  )}
                </div>
              </div>

              {/* Thread Core Content */}
              <div className="space-y-3.5 select-text">
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional Attached Images with multi grid options */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-3.5 mt-3 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.images.map((img, index) => (
                      <div key={index} className="rounded-2xl overflow-hidden border border-[#1f2937]/50 max-h-72 bg-slate-950/20">
                        <img 
                          src={img} 
                          alt="Attached media file" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive bottom bar buttons */}
              <div className="flex items-center gap-6 border-y border-[#1f2937]/45 py-3 text-xs">
                
                {/* Likes button */}
                <button
                  id={`feed-like-${post.id}`}
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-2 font-bold cursor-pointer transition-colors ${
                    post.isLiked ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-400' : ''}`} />
                  <span>{post.likes} Likes</span>
                </button>

                {/* Toggle Comments collapse button */}
                <button
                  id={`feed-comment-toggle-${post.id}`}
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white font-bold cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments ? post.comments.length : 0} Comments</span>
                  {expandedComments[post.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expanded Comments section panel */}
              {expandedComments[post.id] && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                  
                  {/* Comments lists */}
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {post.comments && post.comments.length === 0 ? (
                      <p className="text-[11px] text-gray-500 italic">No comments posted yet. Be the first!</p>
                    ) : (
                      post.comments?.map((comment) => (
                        <div 
                          key={comment.id}
                          className="p-3 bg-[#151c2c]/20 border border-[#1f2937]/65 rounded-2xl space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-3 text-[10px]">
                            <p className="font-bold text-white tracking-wide">{comment.userName} • <span className="text-gray-500 font-medium">{comment.userRole}</span></p>
                            <span className="text-gray-500 font-medium">{comment.publishedAt}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 select-text leading-relaxed">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply comment Form */}
                  <form 
                    onSubmit={(e) => handleCreateComment(post.id, e)}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      required
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a public comment reply..."
                      className="flex-1 bg-[#151c2c]/40 border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      id={`feed-comment-submit-${post.id}`}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Post Reply"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Community help note */}
      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Please adhere to the <strong>Academic Honor Code</strong> when interacting in public discussions. Keep conversations supportive, polite, and constructive.
        </p>
      </div>

    </div>
  );
}
