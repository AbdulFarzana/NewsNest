import React, { useState, useEffect } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { motion, AnimatePresence } from 'motion/react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import LandingView from './components/Views/LandingView';
import LoginView from './components/Views/LoginView';
import DashboardView from './components/Views/DashboardView';
import CommunityFeedView from './components/Views/CommunityFeedView';
import AnnouncementsView from './components/Views/AnnouncementsView';
import EventsView from './components/Views/EventsView';
import HackathonsView from './components/Views/HackathonsView';
import ProfileView from './components/Views/ProfileView';
import SettingsView from './components/Views/SettingsView';

import {
  INITIAL_USER,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_HACKATHONS,
  INITIAL_CLUBS,
  INITIAL_POSTS
} from './data';

const API_BASE_URL = 'https://newsnest-74bb.onrender.com';

const VIEW_TO_PATH = {
  LANDING: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  COMMUNITY_FEED: '/community',
  ANNOUNCEMENTS: '/announcements',
  EVENTS: '/events',
  HACKATHONS: '/hackathons',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [user, setUser] = useState(INITIAL_USER);

  const [announcements, setAnnouncements] = useState(
    INITIAL_ANNOUNCEMENTS
  );

  const [events, setEvents] = useState(
    INITIAL_EVENTS
  );

  const [hackathons, setHackathons] = useState(
    INITIAL_HACKATHONS
  );

  const [clubs, setClubs] = useState(
    INITIAL_CLUBS
  );

  const [posts, setPosts] = useState(
    INITIAL_POSTS
  );

  const [clubPosts, setClubPosts] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // SETTINGS STATES
  // ==========================================

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('newsnest-theme') || 'dark';
  });

  const [showRecentlyLikedPosts, setShowRecentlyLikedPosts] = useState(() => {
    const savedValue = localStorage.getItem(
      'newsnest-show-liked-posts'
    );

    return savedValue === null
      ? true
      : savedValue === 'true';
  });

  // ==========================================
  // APPLY THEME
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      'newsnest-theme',
      theme
    );

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // ==========================================
  // SAVE LIKED POSTS VISIBILITY
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      'newsnest-show-liked-posts',
      showRecentlyLikedPosts.toString()
    );
  }, [showRecentlyLikedPosts]);

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/me`,
          {
            method: 'GET',
            credentials: 'include'
          }
        );

        const data = await response.json();

        console.log('Auth check:', data);

        if (response.ok && data.user) {
          setUser(prev => ({
            ...prev,
            ...data.user
          }));

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

      } catch (error) {
        console.error(
          'Authentication check error:',
          error
        );

        setIsLoggedIn(false);

      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthentication();

  }, []);

  // ==========================================
  // GET ACTIVE VIEW
  // ==========================================

  const getActiveView = () => {
    const path = location.pathname;

    if (path === '/') return 'LANDING';
    if (path === '/login') return 'LOGIN';
    if (path === '/dashboard') return 'DASHBOARD';
    if (path === '/community') return 'COMMUNITY_FEED';
    if (path === '/announcements') return 'ANNOUNCEMENTS';
    if (path === '/events') return 'EVENTS';
    if (path === '/hackathons') return 'HACKATHONS';
    if (path === '/profile') return 'PROFILE';
    if (path === '/settings') return 'SETTINGS';

    return 'LANDING';
  };

  const activeView = getActiveView();

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleViewChange = view => {
    const path = VIEW_TO_PATH[view];

    if (path) {
      setSearchQuery('');
      navigate(path);
    }
  };

  // ==========================================
  // FETCH ALL DATA
  // ==========================================

  const fetchAllData = async () => {
    try {
      const [
        announcementsResponse,
        eventsResponse,
        hackathonsResponse,
        clubsResponse,
        postsResponse,
        clubPostsResponse
      ] = await Promise.all([

        fetch(
          `${API_BASE_URL}/api/announcements`,
          {
            credentials: 'include'
          }
        )
          .then(r => r.json())
          .catch(() => null),

        fetch(
          `${API_BASE_URL}/api/events`,
          {
            credentials: 'include'
          }
        )
          .then(r => r.json())
          .catch(() => null),

        fetch(
          `${API_BASE_URL}/api/hackathons`,
          {
            credentials: 'include'
          }
        )
          .then(r => r.json())
          .catch(() => null),

        fetch(
          `${API_BASE_URL}/api/clubs`,
          {
            credentials: 'include'
          }
        )
          .then(r => r.json())
          .catch(() => null),

        fetch(
          `${API_BASE_URL}/api/posts`,
          {
            credentials: 'include'
          }
        )
          .then(r => r.json())
          .catch(() => null),

        fetch(
          `${API_BASE_URL}/api/clubs`,
          {
            credentials: 'include'
          }
        )
          .then(r => r.json())
          .catch(() => null)
      ]);

      if (
        announcementsResponse &&
        announcementsResponse.announcements
      ) {
        setAnnouncements(
          announcementsResponse.announcements
        );
      }

      if (
        eventsResponse &&
        eventsResponse.events
      ) {
        setEvents(
          eventsResponse.events
        );
      }

      if (
        hackathonsResponse &&
        hackathonsResponse.hackathons
      ) {
        setHackathons(
          hackathonsResponse.hackathons
        );
      }

      if (
        clubsResponse &&
        clubsResponse.clubs
      ) {
        setClubs(
          clubsResponse.clubs
        );
      }

      if (
        postsResponse &&
        postsResponse.posts
      ) {
        setPosts(
          postsResponse.posts
        );
      }

      if (
        clubPostsResponse &&
        clubPostsResponse.posts
      ) {
        setClubPosts(
          clubPostsResponse.posts
        );
      }

    } catch (error) {
      console.error(
        'Backend sync warning:',
        error
      );
    }
  };

  // ==========================================
  // FETCH DATA AFTER LOGIN
  // ==========================================

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  // ==========================================
  // CTRL + K SEARCH
  // ==========================================

  useEffect(() => {
    const handleKeyDown = e => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === 'k'
      ) {
        e.preventDefault();

        const searchInput =
          document.getElementById(
            'global-search'
          );

        if (searchInput) {
          searchInput.focus();
        }
      }

      if (e.key === 'Escape') {
        setSearchQuery('');
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };

  }, []);

  // ==========================================
  // UPDATE USER STATS
  // ==========================================

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const registeredEventsCount =
      events.filter(
        event => event.isRegistered
      ).length;

    const registeredHackathonsCount =
      hackathons.filter(
        hackathon => hackathon.isRegistered
      ).length;

    const joinedClubsCount =
      clubs.filter(
        club => club.isJoined
      ).length;

    setUser(prev => ({
      ...prev,

      eventsJoinedCount:
        registeredEventsCount +
        registeredHackathonsCount,

      clubsCount:
        joinedClubsCount
    }));

  }, [
    events,
    hackathons,
    clubs,
    isLoggedIn
  ]);

  // ==========================================
  // LOGIN SUCCESS
  // ==========================================

  const handleLoginSuccess = async userData => {
    if (userData) {
      setUser(prev => ({
        ...prev,
        ...userData
      }));
    }

    setIsLoggedIn(true);

    navigate('/dashboard');

    await fetchAllData();
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await fetch(
        `${API_BASE_URL}/api/auth/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );
    } catch (error) {
      console.error(
        'Logout error:',
        error
      );
    }

    setIsLoggedIn(false);
    setSearchQuery('');

    navigate('/');
  };

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your NewsNest account? This action cannot be undone.'
    );

    if (!confirmed) {
      return {
        success: false,
        cancelled: true
      };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/delete-account`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            'Failed to delete account'
        };
      }

      setIsLoggedIn(false);

      setUser(INITIAL_USER);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setEvents(INITIAL_EVENTS);
      setHackathons(INITIAL_HACKATHONS);
      setClubs(INITIAL_CLUBS);
      setPosts(INITIAL_POSTS);
      setClubPosts([]);
      setSearchQuery('');

      navigate('/');

      return {
        success: true,
        message:
          'Your account has been deleted successfully.'
      };

    } catch (error) {
      console.error(
        'Delete account error:',
        error
      );

      return {
        success: false,
        message:
          'Unable to connect to server'
      };
    }
  };

  // ==========================================
  // REGISTER EVENT
  // ==========================================

  const handleRegisterEvent = async id => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id
          ? {
            ...event,
            isRegistered:
              !event.isRegistered
          }
          : event
      )
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/events/${id}/rsvp`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (
        data.success &&
        data.events
      ) {
        setEvents(data.events);
      }

      if (data.user) {
        setUser(prev => ({
          ...prev,
          ...data.user
        }));
      }

    } catch (error) {
      console.error(
        'RSVP event error:',
        error
      );

      fetchAllData();
    }
  };

  // ==========================================
  // REGISTER HACKATHON
  // ==========================================

  const handleRegisterHackathon = async id => {
    setHackathons(prev =>
      prev.map(hackathon =>
        hackathon.id === id
          ? {
            ...hackathon,
            isRegistered:
              !hackathon.isRegistered
          }
          : hackathon
      )
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/hackathons/${id}/rsvp`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (
        data.success &&
        data.hackathons
      ) {
        setHackathons(data.hackathons);
      }

      if (data.user) {
        setUser(prev => ({
          ...prev,
          ...data.user
        }));
      }

    } catch (error) {
      console.error(
        'RSVP hackathon error:',
        error
      );

      fetchAllData();
    }
  };

  // ==========================================
  // JOIN CLUB
  // ==========================================

  const handleJoinClub = async id => {
    setClubs(prev =>
      prev.map(club =>
        club.id === id
          ? {
            ...club,
            isJoined:
              !club.isJoined
          }
          : club
      )
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${id}/join`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (
        data.success &&
        data.clubs
      ) {
        setClubs(data.clubs);
      }

      if (data.user) {
        setUser(prev => ({
          ...prev,
          ...data.user
        }));
      }

    } catch (error) {
      console.error(
        'Join club error:',
        error
      );

      fetchAllData();
    }
  };

  // ==========================================
  // CREATE CLUB POST
  // ==========================================

  const handleCreateClubPost = async newPost => {
    try {
      const formData = new FormData();

      formData.append(
        'club',
        newPost.club
      );

      formData.append(
        'type',
        newPost.type
      );

      formData.append(
        'title',
        newPost.title
      );

      formData.append(
        'description',
        newPost.description
      );

      formData.append(
        'venue',
        newPost.venue || ''
      );

      formData.append(
        'startDateTime',
        newPost.startDateTime || ''
      );

      formData.append(
        'endDateTime',
        newPost.endDateTime || ''
      );

      formData.append(
        'registrationDeadline',
        newPost.registrationDeadline || ''
      );

      formData.append(
        'registrationLink',
        newPost.registrationLink || ''
      );

      if (newPost.imageFile) {
        formData.append(
          'image',
          newPost.imageFile
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/clubs`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to create club post'
        );

        return false;
      }

      if (data.post) {
        setClubPosts(prev => [
          data.post,
          ...prev
        ]);

        return true;
      }

      return false;

    } catch (error) {
      console.error(
        'Create club post error:',
        error
      );

      alert(
        'Unable to connect to server'
      );

      return false;
    }
  };

  // ==========================================
  // DELETE CLUB POST
  // ==========================================

  const handleDeleteClubPost = async id => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to delete club post'
        );

        return;
      }

      setClubPosts(prev =>
        prev.filter(
          post =>
            post.id !== id &&
            post._id !== id
        )
      );

    } catch (error) {
      console.error(
        'Delete club post error:',
        error
      );

      alert(
        'Unable to connect to server'
      );
    }
  };

  // ==========================================
  // ADD COMMUNITY POST
  // ==========================================

  const handleAddPost = async newPost => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts`,
        {
          method: 'POST',
          credentials: 'include',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            content: newPost.content,
            category: newPost.category,
            clubName: newPost.clubName,
            images: newPost.images
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to create post'
        );

        return;
      }

      if (data.post) {
        setPosts(prev => [
          data.post,
          ...prev
        ]);
      }

    } catch (error) {
      console.error(
        'Add post error:',
        error
      );

      alert(
        'Unable to connect to server'
      );
    }
  };

  // ==========================================
  // LIKE POST
  // ==========================================

  const handleLikePost = async postId => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/like`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to update like');
        return;
      }

      setPosts(prev =>
        prev.map(post => {
          const currentPostId = post.id || post._id;

          if (currentPostId.toString() === postId.toString()) {
            return {
              ...post,
              likes: data.likes ?? 0,
              isLiked: data.isLiked
            };
          }

          return post;
        })
      );

    } catch (error) {
      console.error('Like error:', error);
      alert('Unable to connect to server');
    }
  };
  // ==========================================
  // ADD COMMENT
  // ==========================================

  const handleAddComment = async (
    postId,
    newCommentObj
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comment`,
        {
          method: 'POST',
          credentials: 'include',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            text:
              newCommentObj.content
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to add comment'
        );

        return;
      }

      if (data.post) {
        setPosts(prev =>
          prev.map(post =>
            post.id.toString() ===
              postId.toString()
              ? data.post
              : post
          )
        );
      }

    } catch (error) {
      console.error(
        'Comment error:',
        error
      );

      alert(
        'Unable to connect to server'
      );
    }
  };

  // ==========================================
  // DELETE POST
  // ==========================================

  const handleDeletePost = async postId => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to delete post'
        );

        return;
      }

      setPosts(prev =>
        prev.filter(
          post =>
            post.id.toString() !==
            postId.toString()
        )
      );

    } catch (error) {
      console.error(
        'Delete post error:',
        error
      );

      alert(
        'Unable to connect to server'
      );
    }
  };

  // ==========================================
  // DELETE COMMENT
  // ==========================================

  const handleDeleteComment = async (
    postId,
    commentId
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comment/${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to delete comment'
        );

        return;
      }

      setPosts(prev =>
        prev.map(post => {
          if (
            post.id.toString() !==
            postId.toString()
          ) {
            return post;
          }

          return {
            ...post,

            comments:
              (post.comments || []).filter(
                comment =>
                  comment.id.toString() !==
                  commentId.toString()
              )
          };
        })
      );

    } catch (error) {
      console.error(
        'Delete comment error:',
        error
      );

      alert(
        'Unable to connect to server'
      );
    }
  };

  // ==========================================
  // ADD ANNOUNCEMENT
  // ==========================================

  const handleAddAnnouncement = async newAnn => {
    try {
      const formData = new FormData();

      formData.append(
        'title',
        newAnn.title
      );

      formData.append(
        'content',
        newAnn.content
      );

      formData.append(
        'category',
        newAnn.category
      );

      formData.append(
        'link',
        newAnn.link || ''
      );

      if (newAnn.imageFile) {
        formData.append(
          'image',
          newAnn.imageFile
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/announcements`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to create announcement'
        );

        return;
      }

      if (data.announcement) {
        setAnnouncements(prev => [
          data.announcement,
          ...prev
        ]);
      }

    } catch (error) {
      console.error(
        'Add announcement error:',
        error
      );

      alert(
        'Unable to connect to server'
      );
    }
  };

  // ==========================================
  // DELETE ANNOUNCEMENT
  // ==========================================

  const handleDeleteAnnouncement = async id => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/announcements/${id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to delete announcement'
        );

        return;
      }

      setAnnouncements(prev =>
        prev.filter(
          announcement =>
            announcement.id !== id &&
            announcement._id !== id
        )
      );

    } catch (error) {
      console.error(
        'Delete announcement error:',
        error
      );

      alert(
        'Unable to connect to server'
      );
    }
  };

  // ==========================================
  // UPDATE USER PROFILE
  // ==========================================

  const handleUpdateUser = async (
    updatedUser,
    avatarFile
  ) => {
    try {
      const formData = new FormData();

      formData.append(
        'name',
        updatedUser.name || ''
      );

      formData.append(
        'phone',
        updatedUser.phone || ''
      );

      formData.append(
        'rollNumber',
        updatedUser.rollNumber || ''
      );

      formData.append(
        'location',
        updatedUser.location || ''
      );

      formData.append(
        'department',
        updatedUser.department || ''
      );

      formData.append(
        'year',
        updatedUser.year || ''
      );

      formData.append(
        'interestedClubs',
        JSON.stringify(
          updatedUser.interestedClubs || []
        )
      );

      if (avatarFile) {
        formData.append(
          'avatar',
          avatarFile
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/profile`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            'Failed to update profile'
        };
      }

      if (
        data.success &&
        data.user
      ) {
        setUser(prev => ({
          ...prev,
          ...data.user
        }));

        return {
          success: true,
          user: data.user
        };
      }

      return {
        success: false,
        message:
          'Failed to update profile'
      };

    } catch (error) {
      console.error(
        'Update profile error:',
        error
      );

      return {
        success: false,
        message:
          'Unable to connect to server'
      };
    }
  };
  // ==========================================
  // RECENTLY LIKED POSTS
  // ==========================================

  const likedPosts = posts
    .filter(post => post.isLiked === true)
    .sort((a, b) => {
      const dateA = new Date(
        a.updatedAt || a.createdAt || 0
      );

      const dateB = new Date(
        b.updatedAt || b.createdAt || 0
      );

      return dateB - dateA;
    });
  // ==========================================
  // REGISTERED EVENTS
  // ==========================================

  const registeredEvents = [
    ...events.filter(
      event => event.isRegistered
    ),

    ...hackathons
      .filter(
        hackathon =>
          hackathon.isRegistered
      )
      .map(hackathon => ({
        id: hackathon.id,
        title: hackathon.title,
        description:
          hackathon.description,
        date: hackathon.date,
        time: hackathon.type,
        location: hackathon.scope,
        category:
          hackathon.category,
        isRegistered:
          hackathon.isRegistered,

        imagePlaceholderColor:
          'from-amber-600 to-yellow-600'
      }))
  ];

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  const LoadingScreen = () => {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>

          <p>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  };

  // ==========================================
  // PROTECTED LAYOUT
  // ==========================================

  const ProtectedLayout = ({
    children
  }) => {
    if (authLoading) {
      return <LoadingScreen />;
    }

    if (!isLoggedIn) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

    return (
      <div
        className={
          theme === 'dark'
            ? 'flex bg-[#0a0f1d] min-h-screen text-gray-100'
            : 'flex bg-gray-100 min-h-screen text-gray-900'
        }
      >
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          theme={theme}
        />

        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
          <Header
            user={user}
            activeView={activeView}
            onViewChange={handleViewChange}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            theme={theme}
          />

          <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{
                  opacity: 0,
                  x: 8
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -8
                }}
                transition={{
                  duration: 0.2
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    );
  };

  // ==========================================
  // ROUTES
  // ==========================================

  return (
    <Routes>

      <Route
        path="/"
        element={
          authLoading ? (
            <LoadingScreen />
          ) : (
            <LandingView
              onNavigate={handleViewChange}
            />
          )
        }
      />

      <Route
        path="/login"
        element={
          authLoading ? (
            <LoadingScreen />
          ) : (
            <LoginView
              onLoginSuccess={
                handleLoginSuccess
              }
              onNavigateBack={() =>
                navigate('/')
              }
            />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <DashboardView
              user={user}
              announcements={announcements}
              events={events}
              hackathons={hackathons}
              clubs={clubs}
              posts={posts}
              onNavigate={handleViewChange}
              onRegisterEvent={handleRegisterEvent}
              onJoinClub={handleJoinClub}
              searchQuery={searchQuery}
            />
          </ProtectedLayout>
        }
      />

      <Route
        path="/community"
        element={
          <ProtectedLayout>
            <CommunityFeedView
              user={user}
              posts={posts}
              onAddPost={handleAddPost}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onDeletePost={handleDeletePost}
              onDeleteComment={handleDeleteComment}
              searchQuery={searchQuery}
              showRecentlyLikedPosts={
                showRecentlyLikedPosts
              }
            />
          </ProtectedLayout>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedLayout>
            <AnnouncementsView
              currentUser={user}
              announcements={announcements}
              onAddAnnouncement={
                handleAddAnnouncement
              }
              onDeleteAnnouncement={
                handleDeleteAnnouncement
              }
              searchQuery={searchQuery}
            />
          </ProtectedLayout>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedLayout>
            <EventsView
              events={events}
              onRegisterEvent={
                handleRegisterEvent
              }
              searchQuery={searchQuery}
            />
          </ProtectedLayout>
        }
      />

      <Route
        path="/hackathons"
        element={
          <ProtectedLayout>
            <HackathonsView
              currentUser={user}
              clubPosts={clubPosts}
              onCreateClubPost={
                handleCreateClubPost
              }
              onDeleteClubPost={
                handleDeleteClubPost
              }
              searchQuery={searchQuery}
              hackathons={hackathons}
              clubs={clubs}
              onRegisterHackathon={
                handleRegisterHackathon
              }
              onJoinClub={handleJoinClub}
            />
          </ProtectedLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <ProfileView
              user={user}
              onUpdateUser={handleUpdateUser}
              registeredEvents={
                registeredEvents
              }
            />
          </ProtectedLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <SettingsView
              theme={theme}
              onThemeChange={setTheme}
              likedPosts={likedPosts}
              onNavigate={handleViewChange}
              onDeleteAccount={handleDeleteAccount}
            />
          </ProtectedLayout>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}
