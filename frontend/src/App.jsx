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

const API_BASE_URL = 'http://localhost:5000';

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

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // =====================================================
  // APPLICATION STATE
  // =====================================================

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

  const [searchQuery, setSearchQuery] = useState('');

  // =====================================================
  // CHECK AUTHENTICATION
  // =====================================================

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

  // =====================================================
  // CURRENT VIEW
  // =====================================================

  const getActiveView = () => {

    const path = location.pathname;

    if (path === '/') {
      return 'LANDING';
    }

    if (path === '/login') {
      return 'LOGIN';
    }

    if (path === '/dashboard') {
      return 'DASHBOARD';
    }

    if (path === '/community') {
      return 'COMMUNITY_FEED';
    }

    if (path === '/announcements') {
      return 'ANNOUNCEMENTS';
    }

    if (path === '/events') {
      return 'EVENTS';
    }

    if (path === '/hackathons') {
      return 'HACKATHONS';
    }

    if (path === '/profile') {
      return 'PROFILE';
    }

    if (path === '/settings') {
      return 'SETTINGS';
    }

    return 'LANDING';
  };

  const activeView = getActiveView();

  // =====================================================
  // CHANGE VIEW
  // =====================================================

  const handleViewChange = view => {

    const path = VIEW_TO_PATH[view];

    if (path) {
      navigate(path);
    }

  };

  // =====================================================
  // FETCH ALL DATA
  // =====================================================

  const fetchAllData = async () => {

    try {

      const [
        announcementsResponse,
        eventsResponse,
        hackathonsResponse,
        clubsResponse,
        postsResponse
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
          .catch(() => null)

      ]);

      if (
        announcementsResponse &&
        announcementsResponse.success &&
        announcementsResponse.announcements
      ) {

        setAnnouncements(
          announcementsResponse.announcements
        );

      }

      if (
        eventsResponse &&
        eventsResponse.success &&
        eventsResponse.events
      ) {

        setEvents(
          eventsResponse.events
        );

      }

      if (
        hackathonsResponse &&
        hackathonsResponse.success &&
        hackathonsResponse.hackathons
      ) {

        setHackathons(
          hackathonsResponse.hackathons
        );

      }

      if (
        clubsResponse &&
        clubsResponse.success &&
        clubsResponse.clubs
      ) {

        setClubs(
          clubsResponse.clubs
        );

      }

      if (
        postsResponse &&
        postsResponse.success &&
        postsResponse.posts
      ) {

        setPosts(
          postsResponse.posts
        );

      }

    } catch (error) {

      console.error(
        'Backend sync warning:',
        error
      );

    }

  };

  // =====================================================
  // FETCH DATA AFTER LOGIN
  // =====================================================

  useEffect(() => {

    if (isLoggedIn) {
      fetchAllData();
    }

  }, [isLoggedIn]);

  // =====================================================
  // CTRL + K SEARCH
  // =====================================================

  useEffect(() => {

    const handleKeyDown = e => {

      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === 'k'
      ) {

        e.preventDefault();

        const searchInput =
          document.querySelector(
            'input[type="text"]'
          );

        if (searchInput) {
          searchInput.focus();
        }

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

  // =====================================================
  // UPDATE USER STATS
  // =====================================================

  useEffect(() => {

    if (!isLoggedIn) {
      return;
    }

    const registeredEventsCount =
      events.filter(
        e => e.isRegistered
      ).length;

    const registeredHackathonsCount =
      hackathons.filter(
        h => h.isRegistered
      ).length;

    const joinedClubsCount =
      clubs.filter(
        c => c.isJoined
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

  // =====================================================
  // LOGIN SUCCESS
  // =====================================================

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

  // =====================================================
  // LOGOUT
  // =====================================================

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

  // =====================================================
  // REGISTER EVENT
  // =====================================================

  const handleRegisterEvent = async id => {

    setEvents(prev =>
      prev.map(evt =>
        evt.id === id
          ? {
            ...evt,
            isRegistered:
              !evt.isRegistered
          }
          : evt
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

      const data =
        await response.json();

      if (
        data.success &&
        data.events
      ) {

        setEvents(
          data.events
        );

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

    }

  };

  // =====================================================
  // REGISTER HACKATHON
  // =====================================================

  const handleRegisterHackathon = async id => {

    setHackathons(prev =>
      prev.map(hack =>
        hack.id === id
          ? {
            ...hack,
            isRegistered:
              !hack.isRegistered
          }
          : hack
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

      const data =
        await response.json();

      if (
        data.success &&
        data.hackathons
      ) {

        setHackathons(
          data.hackathons
        );

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

    }

  };

  // =====================================================
  // JOIN CLUB
  // =====================================================

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

      const data =
        await response.json();

      if (
        data.success &&
        data.clubs
      ) {

        setClubs(
          data.clubs
        );

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

    }

  };

  // =====================================================
  // ADD POST
  // =====================================================

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
            content:
              newPost.content,

            category:
              newPost.category,

            clubName:
              newPost.clubName,

            images:
              newPost.images
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          'Failed to create post'
        );

        return;

      }

      if (
        data.success &&
        data.post
      ) {

        setPosts(prev => [
          data.post,
          ...prev
        ]);

        setUser(prev => ({
          ...prev,

          postsCount:
            (prev.postsCount || 0) + 1
        }));

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

  // =====================================================
  // LIKE POST
  // =====================================================

  const handleLikePost = async postId => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/like`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          'Failed to update like'
        );

        return;

      }

      setPosts(prev =>
        prev.map(post =>
          post.id.toString() ===
            postId.toString()
            ? {
              ...post,

              likes:
                data.likes,

              isLiked:
                data.isLiked
            }
            : post
        )
      );

    } catch (error) {

      console.error(
        'Like error:',
        error
      );

      alert(
        'Unable to connect to server'
      );

    }

  };

  // =====================================================
  // ADD COMMENT
  // =====================================================

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

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          'Failed to add comment'
        );

        return;

      }

      if (
        data.success &&
        data.post
      ) {

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

  // =====================================================
  // DELETE POST
  // =====================================================

  const handleDeletePost = async postId => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data =
        await response.json();

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

      setUser(prev => ({
        ...prev,

        postsCount:
          Math.max(
            0,
            (prev.postsCount || 0) - 1
          )
      }));

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

  // =====================================================
  // DELETE COMMENT
  // =====================================================

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

      const data =
        await response.json();

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

  // =====================================================
  // ADD ANNOUNCEMENT
  // =====================================================

  const handleAddAnnouncement = async newAnn => {

    setAnnouncements(prev => [
      newAnn,
      ...prev
    ]);

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/announcements`,
        {
          method: 'POST',
          credentials: 'include',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(newAnn)
        }
      );

      const data =
        await response.json();

      if (
        data.success &&
        data.announcements
      ) {

        setAnnouncements(
          data.announcements
        );

      }

    } catch (error) {

      console.error(
        'Announcement error:',
        error
      );

    }

  };

  // =====================================================
  // DELETE ANNOUNCEMENT
  // =====================================================

  const handleDeleteAnnouncement = async id => {

    setAnnouncements(prev =>
      prev.filter(
        ann => ann.id !== id
      )
    );

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/announcements/${id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data =
        await response.json();

      if (
        data.success &&
        data.announcements
      ) {

        setAnnouncements(
          data.announcements
        );

      }

    } catch (error) {

      console.error(
        'Delete announcement error:',
        error
      );

    }

  };

  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdateUser = async updatedUser => {

    setUser(updatedUser);

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/auth/profile`,
        {
          method: 'PUT',
          credentials: 'include',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(updatedUser)
        }
      );

      const data =
        await response.json();

      if (
        data.success &&
        data.user
      ) {

        setUser(data.user);

      }

    } catch (error) {

      console.error(
        'Update profile error:',
        error
      );

    }

  };

  // =====================================================
  // RESET DATA
  // =====================================================

  const handleResetData = () => {

    setUser(
      INITIAL_USER
    );

    setAnnouncements(
      INITIAL_ANNOUNCEMENTS
    );

    setEvents(
      INITIAL_EVENTS
    );

    setHackathons(
      INITIAL_HACKATHONS
    );

    setClubs(
      INITIAL_CLUBS
    );

    setPosts(
      INITIAL_POSTS
    );

    setSearchQuery('');

  };

  // =====================================================
  // REGISTERED EVENTS
  // =====================================================

  const registeredEvents = [

    ...events.filter(
      e => e.isRegistered
    ),

    ...hackathons
      .filter(
        h => h.isRegistered
      )
      .map(h => ({

        id:
          h.id,

        title:
          h.title,

        description:
          h.description,

        date:
          h.date,

        time:
          h.type,

        location:
          h.scope,

        category:
          h.category,

        isRegistered:
          h.isRegistered,

        imagePlaceholderColor:
          'from-amber-600 to-yellow-600'

      }))

  ];

  // =====================================================
  // LOADING SCREEN
  // =====================================================

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

  // =====================================================
  // PROTECTED LAYOUT
  // =====================================================

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

      <div className="flex bg-[#0a0f1d] min-h-screen text-gray-100">

        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
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

  // =====================================================
  // ROUTES
  // =====================================================

  return (

    <Routes>

      {/* =================================================
          LANDING PAGE

          IMPORTANT FIX:
          NEVER automatically navigate to dashboard here.
      ================================================= */}

      <Route
        path="/"
        element={

          authLoading ? (

            <LoadingScreen />

          ) : (

            <AnimatePresence mode="wait">

              <motion.div
                key="landing"
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                exit={{
                  opacity: 0
                }}
                transition={{
                  duration: 0.4
                }}
              >

                <LandingView
                  onNavigate={
                    handleViewChange
                  }
                />

              </motion.div>

            </AnimatePresence>

          )

        }
      />

      {/* =================================================
          LOGIN PAGE
      ================================================= */}

      <Route
        path="/login"
        element={

          authLoading ? (

            <LoadingScreen />

          ) : (

            <AnimatePresence mode="wait">

              <motion.div
                key="login"
                initial={{
                  opacity: 0,
                  y: 15
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -15
                }}
                transition={{
                  duration: 0.3
                }}
              >

                <LoginView
                  onLoginSuccess={
                    handleLoginSuccess
                  }

                  onNavigateBack={() =>
                    navigate('/')
                  }
                />

              </motion.div>

            </AnimatePresence>

          )

        }
      />

      {/* =================================================
          DASHBOARD
      ================================================= */}

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
              onNavigate={
                handleViewChange
              }
              onRegisterEvent={
                handleRegisterEvent
              }
              onJoinClub={
                handleJoinClub
              }
              searchQuery={
                searchQuery
              }
            />

          </ProtectedLayout>

        }
      />

      {/* =================================================
          COMMUNITY
      ================================================= */}

      <Route
        path="/community"
        element={

          <ProtectedLayout>

            <CommunityFeedView
              user={user}
              posts={posts}
              onAddPost={
                handleAddPost
              }
              onLikePost={
                handleLikePost
              }
              onAddComment={
                handleAddComment
              }
              onDeletePost={
                handleDeletePost
              }
              onDeleteComment={
                handleDeleteComment
              }
              searchQuery={
                searchQuery
              }
            />

          </ProtectedLayout>

        }
      />

      {/* =================================================
          ANNOUNCEMENTS
      ================================================= */}

      <Route
        path="/announcements"
        element={

          <ProtectedLayout>

            <AnnouncementsView
              announcements={
                announcements
              }
              onAddAnnouncement={
                handleAddAnnouncement
              }
              onDeleteAnnouncement={
                handleDeleteAnnouncement
              }
              searchQuery={
                searchQuery
              }
            />

          </ProtectedLayout>

        }
      />

      {/* =================================================
          EVENTS
      ================================================= */}

      <Route
        path="/events"
        element={

          <ProtectedLayout>

            <EventsView
              events={
                events
              }
              onRegisterEvent={
                handleRegisterEvent
              }
              searchQuery={
                searchQuery
              }
            />

          </ProtectedLayout>

        }
      />

      {/* =================================================
          HACKATHONS
      ================================================= */}

      <Route
        path="/hackathons"
        element={

          <ProtectedLayout>

            <HackathonsView
              hackathons={
                hackathons
              }
              clubs={
                clubs
              }
              onRegisterHackathon={
                handleRegisterHackathon
              }
              onJoinClub={
                handleJoinClub
              }
              searchQuery={
                searchQuery
              }
            />

          </ProtectedLayout>

        }
      />

      {/* =================================================
          PROFILE
      ================================================= */}

      <Route
        path="/profile"
        element={

          <ProtectedLayout>

            <ProfileView
              user={
                user
              }
              onUpdateUser={
                handleUpdateUser
              }
              joinedClubs={
                clubs.filter(
                  c => c.isJoined
                )
              }
              registeredEvents={
                registeredEvents
              }
            />

          </ProtectedLayout>

        }
      />

      {/* =================================================
          SETTINGS
      ================================================= */}

      <Route
        path="/settings"
        element={

          <ProtectedLayout>

            <SettingsView
              onResetData={
                handleResetData
              }
            />

          </ProtectedLayout>

        }
      />

      {/* =================================================
          UNKNOWN ROUTE
      ================================================= */}

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