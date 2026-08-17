import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Image,
  X,
  MoreHorizontal,
  Users,
  Plus
} from 'lucide-react';

const CommunityFeedView = ({
  user,
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
  onDeletePost,
  onDeleteComment,
  searchQuery
}) => {

  const [postContent, setPostContent] = useState('');
  const [category, setCategory] = useState('General Discussion');
  const [clubName, setClubName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // CREATE POST
  // =====================================================

  const handleCreatePost = async (e) => {

    e.preventDefault();

    if (!postContent.trim()) {
      alert('Please enter something to post.');
      return;
    }

    setSubmitting(true);

    try {

      await onAddPost({
        content: postContent.trim(),
        category,
        clubName: clubName.trim(),
        images: imageUrl.trim()
          ? [imageUrl.trim()]
          : []
      });

      setPostContent('');
      setCategory('General Discussion');
      setClubName('');
      setImageUrl('');
      setShowImageInput(false);
      setShowCreatePost(false);

    } catch (error) {

      console.error(
        'Create post error:',
        error
      );

    } finally {

      setSubmitting(false);

    }
  };

  // =====================================================
  // COMMENT INPUT
  // =====================================================

  const handleCommentChange = (
    postId,
    value
  ) => {

    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));

  };

  // =====================================================
  // ADD COMMENT
  // =====================================================

  const handleSubmitComment = async (
    postId
  ) => {

    const text =
      commentInputs[postId]?.trim();

    if (!text) {
      return;
    }

    try {

      await onAddComment(
        postId,
        {
          content: text
        }
      );

      setCommentInputs(prev => ({
        ...prev,
        [postId]: ''
      }));

    } catch (error) {

      console.error(
        'Comment error:',
        error
      );

    }
  };

  // =====================================================
  // ENTER KEY FOR COMMENT
  // =====================================================

  const handleCommentKeyDown = (
    e,
    postId
  ) => {

    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleSubmitComment(postId);

    }

  };

  // =====================================================
  // TOGGLE COMMENTS
  // =====================================================

  const toggleComments = (
    postId
  ) => {

    setExpandedComments(prev => ({
      ...prev,
      [postId]:
        !prev[postId]
    }));

  };

  // =====================================================
  // DELETE POST
  // =====================================================

  const handleDeletePost = async (
    postId
  ) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this post?'
      );

    if (!confirmed) {
      return;
    }

    await onDeletePost(postId);

  };

  // =====================================================
  // DELETE COMMENT
  // =====================================================

  const handleDeleteComment = async (
    postId,
    commentId
  ) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this comment?'
      );

    if (!confirmed) {
      return;
    }

    await onDeleteComment(
      postId,
      commentId
    );

  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return '';
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return '';

    }

    return parsedDate.toLocaleString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }
    );

  };

  // =====================================================
  // FILTER POSTS
  // =====================================================

  const filteredPosts =
    (posts || []).filter(post => {

      if (!searchQuery?.trim()) {
        return true;
      }

      const query =
        searchQuery
          .toLowerCase()
          .trim();

      return (
        post.content
          ?.toLowerCase()
          .includes(query) ||

        post.userName
          ?.toLowerCase()
          .includes(query) ||

        post.category
          ?.toLowerCase()
          .includes(query) ||

        post.clubName
          ?.toLowerCase()
          .includes(query)
      );

    });

  // =====================================================
  // USER ID
  // =====================================================

  const currentUserId =
    user?.id ||
    user?._id;

  // =====================================================
  // CHECK POST OWNER
  // =====================================================

  const isPostOwner = (
    post
  ) => {

    if (
      !currentUserId ||
      !post?.user
    ) {

      return false;

    }

    return (
      post.user.toString() ===
      currentUserId.toString()
    );

  };

  // =====================================================
  // CHECK COMMENT OWNER
  // =====================================================

  const isCommentOwner = (
    comment
  ) => {

    if (
      !currentUserId ||
      !comment?.user
    ) {

      return false;

    }

    return (
      comment.user.toString() ===
      currentUserId.toString()
    );

  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (
    name
  ) => {

    if (!name) {
      return 'U';
    }

    return name
      .split(' ')
      .map(word =>
        word.charAt(0)
      )
      .join('')
      .substring(0, 2)
      .toUpperCase();

  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">

              <Users
                size={22}
                className="text-indigo-400"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-white">
                Community Feed
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Connect, share and discuss with your campus community.
              </p>

            </div>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreatePost(
              !showCreatePost
            )
          }
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
        >

          {showCreatePost ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}

          {showCreatePost
            ? 'Close'
            : 'Create Post'}

        </button>

      </div>

      {/* =================================================
          CREATE POST
      ================================================= */}

      {showCreatePost && (

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">

              {getInitials(
                user?.name
              )}

            </div>

            <div>

              <p className="font-semibold text-white">
                {user?.name || 'User'}
              </p>

              <p className="text-xs text-gray-500">
                {user?.role || 'Student'}
              </p>

            </div>

          </div>

          <form
            onSubmit={
              handleCreatePost
            }
            className="space-y-4"
          >

            {/* CONTENT */}

            <textarea
              value={postContent}
              onChange={e =>
                setPostContent(
                  e.target.value
                )
              }
              placeholder="What's happening on campus?"
              rows={5}
              className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-indigo-500"
            />

            {/* CATEGORY */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={e =>
                    setCategory(
                      e.target.value
                    )
                  }
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >

                  <option>
                    General Discussion
                  </option>

                  <option>
                    Academics
                  </option>

                  <option>
                    Events
                  </option>

                  <option>
                    Placements
                  </option>

                  <option>
                    Clubs
                  </option>

                  <option>
                    Technology
                  </option>

                  <option>
                    Achievements
                  </option>

                </select>

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Club Name
                </label>

                <input
                  type="text"
                  value={clubName}
                  onChange={e =>
                    setClubName(
                      e.target.value
                    )
                  }
                  placeholder="Optional"
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />

              </div>

            </div>

            {/* IMAGE */}

            {showImageInput && (

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={e =>
                    setImageUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />

              </div>

            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowImageInput(
                    !showImageInput
                  )
                }
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
              >

                <Image size={18} />

                {showImageInput
                  ? 'Remove image'
                  : 'Add image'}

              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !postContent.trim()
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
              >

                <Send size={17} />

                {submitting
                  ? 'Publishing...'
                  : 'Publish Post'}

              </button>

            </div>

          </form>

        </div>

      )}

      {/* =================================================
          POSTS
      ================================================= */}

      <div className="space-y-5">

        {filteredPosts.length === 0 && (

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-10 text-center">

            <Users
              size={40}
              className="mx-auto text-gray-600 mb-4"
            />

            <h3 className="text-lg font-semibold text-white">
              No posts found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Be the first person to start a discussion.
            </p>

          </div>

        )}

        {filteredPosts.map(post => (

          <article
            key={post.id}
            className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-lg"
          >

            {/* =================================================
                POST HEADER
            ================================================= */}

            <div className="p-5">

              <div className="flex items-start justify-between gap-3">

                <div className="flex items-center gap-3">

                  {post.userAvatar ? (

                    <img
                      src={post.userAvatar}
                      alt={
                        post.userName ||
                        'User'
                      }
                      className="w-11 h-11 rounded-full object-cover border border-gray-700"
                    />

                  ) : (

                    <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">

                      {getInitials(
                        post.userName
                      )}

                    </div>

                  )}

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="font-semibold text-white">
                        {post.userName ||
                          'Unknown User'}
                      </h3>

                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">

                      <span>
                        {post.userRole ||
                          'Student'}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {formatDate(
                          post.publishedAt
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                {/* DELETE POST */}

                {isPostOwner(post) && (

                  <button
                    type="button"
                    onClick={() =>
                      handleDeletePost(
                        post.id
                      )
                    }
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete post"
                  >

                    <Trash2
                      size={18}
                    />

                  </button>

                )}

              </div>

              {/* =================================================
                  CATEGORY / CLUB
              ================================================= */}

              <div className="flex flex-wrap gap-2 mt-4">

                {post.category && (

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {post.category}
                  </span>

                )}

                {post.clubName && (

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {post.clubName}
                  </span>

                )}

              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <p className="mt-4 text-gray-200 leading-7 whitespace-pre-wrap break-words">
                {post.content}
              </p>

              {/* =================================================
                  IMAGES
              ================================================= */}

              {post.images &&
                post.images.length > 0 && (

                  <div className="mt-4 space-y-3">

                    {post.images.map(
                      (image, index) => (

                        <img
                          key={`${post.id}-${index}`}
                          src={image}
                          alt="Post attachment"
                          className="w-full max-h-[500px] object-cover rounded-xl border border-gray-800"
                          onError={e => {
                            e.currentTarget.style.display =
                              'none';
                          }}
                        />

                      )
                    )}

                  </div>

                )}

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-800">

                <button
                  type="button"
                  onClick={() =>
                    onLikePost(
                      post.id
                    )
                  }
                  className={`inline-flex items-center gap-2 text-sm transition ${post.isLiked
                    ? 'text-pink-400'
                    : 'text-gray-400 hover:text-pink-400'
                    }`}
                >

                  <Heart
                    size={19}
                    fill={
                      post.isLiked
                        ? 'currentColor'
                        : 'none'
                    }
                  />

                  <span>
                    {post.likes || 0}
                  </span>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleComments(
                      post.id
                    )
                  }
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition"
                >

                  <MessageCircle
                    size={19}
                  />

                  <span>
                    {post.comments?.length ||
                      0}
                  </span>

                  <span className="hidden sm:inline">
                    Comments
                  </span>

                </button>

              </div>

            </div>

            {/* =================================================
                COMMENTS
            ================================================= */}

            {expandedComments[
              post.id
            ] && (

                <div className="border-t border-gray-800 bg-[#0d1422]">

                  {/* COMMENT LIST */}

                  {post.comments &&
                    post.comments.length > 0 && (

                      <div className="p-5 space-y-4">

                        {post.comments.map(
                          comment => (

                            <div
                              key={
                                comment.id
                              }
                              className="flex gap-3"
                            >

                              <div className="w-9 h-9 shrink-0 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">

                                {getInitials(
                                  comment.userName
                                )}

                              </div>

                              <div className="flex-1 min-w-0">

                                <div className="bg-[#111827] rounded-xl px-4 py-3">

                                  <div className="flex items-start justify-between gap-2">

                                    <div>

                                      <p className="text-sm font-semibold text-white">
                                        {comment.userName ||
                                          'User'}
                                      </p>

                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {comment.userRole ||
                                          'Student'}
                                      </p>

                                    </div>

                                    {isCommentOwner(
                                      comment
                                    ) && (

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteComment(
                                              post.id,
                                              comment.id
                                            )
                                          }
                                          className="text-gray-600 hover:text-red-400 transition"
                                          title="Delete comment"
                                        >

                                          <Trash2
                                            size={15}
                                          />

                                        </button>

                                      )}

                                  </div>

                                  <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap break-words">
                                    {comment.content}
                                  </p>

                                </div>

                                <p className="text-[11px] text-gray-600 mt-1 ml-2">
                                  {formatDate(
                                    comment.publishedAt
                                  )}
                                </p>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  {/* NO COMMENTS */}

                  {(!post.comments ||
                    post.comments.length === 0) && (

                      <div className="px-5 pt-5 text-sm text-gray-500">
                        No comments yet. Start the conversation.
                      </div>

                    )}

                  {/* COMMENT INPUT */}

                  <div className="p-5">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">

                        {getInitials(
                          user?.name
                        )}

                      </div>

                      <div className="flex-1 relative">

                        <input
                          type="text"
                          value={
                            commentInputs[
                            post.id
                            ] || ''
                          }
                          onChange={e =>
                            handleCommentChange(
                              post.id,
                              e.target.value
                            )
                          }
                          onKeyDown={e =>
                            handleCommentKeyDown(
                              e,
                              post.id
                            )
                          }
                          placeholder="Write a comment..."
                          className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleSubmitComment(
                              post.id
                            )
                          }
                          disabled={
                            !commentInputs[
                              post.id
                            ]?.trim()
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-indigo-400 hover:bg-indigo-500/10 disabled:text-gray-600 disabled:cursor-not-allowed transition"
                          title="Send comment"
                        >

                          <Send
                            size={17}
                          />

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )}

          </article>

        ))}

      </div>

    </div>
  );
};

export default CommunityFeedView;