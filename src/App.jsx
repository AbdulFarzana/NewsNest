import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// View Components
import LandingView from './components/Views/LandingView';
import LoginView from './components/Views/LoginView';
import DashboardView from './components/Views/DashboardView';
import CommunityFeedView from './components/Views/CommunityFeedView';
import AnnouncementsView from './components/Views/AnnouncementsView';
import EventsView from './components/Views/EventsView';
import HackathonsView from './components/Views/HackathonsView';
import ProfileView from './components/Views/ProfileView';
import SettingsView from './components/Views/SettingsView';

// Fallback Mock Data
import { 
  INITIAL_USER, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_EVENTS, 
  INITIAL_HACKATHONS, 
  INITIAL_CLUBS, 
  INITIAL_POSTS 
} from './data';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('LANDING');

  // Shared application state engine
  const [user, setUser] = useState(INITIAL_USER);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [hackathons, setHackathons] = useState(INITIAL_HACKATHONS);
  const [clubs, setClubs] = useState(INITIAL_CLUBS);
  const [posts, setPosts] = useState(INITIAL_POSTS);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial data from backend APIs
  const fetchAllData = async () => {
    try {
      const [uRes, aRes, eRes, hRes, cRes, pRes] = await Promise.all([
        fetch('/api/auth/me').then(r => r.json()).catch(() => null),
        fetch('/api/announcements').then(r => r.json()).catch(() => null),
        fetch('/api/events').then(r => r.json()).catch(() => null),
        fetch('/api/hackathons').then(r => r.json()).catch(() => null),
        fetch('/api/clubs').then(r => r.json()).catch(() => null),
        fetch('/api/posts').then(r => r.json()).catch(() => null)
      ]);

      if (uRes?.success && uRes.user) setUser(uRes.user);
      if (aRes?.success && aRes.announcements) setAnnouncements(aRes.announcements);
      if (eRes?.success && eRes.events) setEvents(eRes.events);
      if (hRes?.success && hRes.hackathons) setHackathons(hRes.hackathons);
      if (cRes?.success && cRes.clubs) setClubs(cRes.clubs);
      if (pRes?.success && pRes.posts) setPosts(pRes.posts);
    } catch (err) {
      console.log('Backend sync warning, using local state engine');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle Ctrl+K shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state stats when events, clubs or posts change
  useEffect(() => {
    const registeredEventsCount = events.filter(e => e.isRegistered).length;
    const registeredHackathonsCount = hackathons.filter(h => h.isRegistered).length;
    const joinedClubsCount = clubs.filter(c => c.isJoined).length;

    setUser(prev => ({
      ...prev,
      eventsJoinedCount: registeredEventsCount + registeredHackathonsCount,
      clubsCount: joinedClubsCount
    }));
  }, [events, hackathons, clubs]);

  // Auth Operations
  const handleLoginSuccess = (userData) => {
    if (userData && typeof userData === 'object') {
      setUser(prev => ({ ...prev, ...userData }));
    }
    setIsLoggedIn(true);
    setActiveView('DASHBOARD');
    fetchAllData();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('LANDING');
    setSearchQuery('');
  };

  // State Updates with Backend Persistence
  const handleRegisterEvent = async (id) => {
    // Optimistic UI update
    setEvents(prev => prev.map(evt => 
      evt.id === id ? { ...evt, isRegistered: !evt.isRegistered } : evt
    ));

    try {
      const res = await fetch(`/api/events/${id}/rsvp`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.events) {
        setEvents(data.events);
        if (data.user) setUser(data.user);
      }
    } catch (err) {
      console.log('RSVP event local fallback');
    }
  };

  const handleRegisterHackathon = async (id) => {
    // Optimistic UI update
    setHackathons(prev => prev.map(hack => 
      hack.id === id ? { ...hack, isRegistered: !hack.isRegistered } : hack
    ));

    try {
      const res = await fetch(`/api/hackathons/${id}/rsvp`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.hackathons) {
        setHackathons(data.hackathons);
        if (data.user) setUser(data.user);
      }
    } catch (err) {
      console.log('RSVP hackathon local fallback');
    }
  };

  const handleJoinClub = async (id) => {
    // Optimistic UI update
    setClubs(prev => prev.map(club => 
      club.id === id ? { ...club, isJoined: !club.isJoined } : club
    ));

    try {
      const res = await fetch(`/api/clubs/${id}/join`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.clubs) {
        setClubs(data.clubs);
        if (data.user) setUser(data.user);
      }
    } catch (err) {
      console.log('Join club local fallback');
    }
  };

  const handleAddPost = async (newPost) => {
    // Optimistic UI update
    setPosts(prev => [newPost, ...prev]);
    setUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost.content, category: newPost.category })
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.log('Add post local fallback');
    }
  };

  const handleLikePost = async (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked;
        return {
          ...post,
          isLiked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.log('Like post local fallback');
    }
  };

  const handleAddComment = async (postId, newCommentObj) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newCommentObj]
        };
      }
      return post;
    }));

    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newCommentObj.text })
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.log('Comment local fallback');
    }
  };

  const handleAddAnnouncement = async (newAnn) => {
    setAnnouncements(prev => [newAnn, ...prev]);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn)
      });
      const data = await res.json();
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.log('Announcement local fallback');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));

    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.log('Delete announcement local fallback');
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    setUser(updatedUser);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.log('Update profile local fallback');
    }
  };

  const handleResetData = () => {
    setUser(INITIAL_USER);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setEvents(INITIAL_EVENTS);
    setHackathons(INITIAL_HACKATHONS);
    setClubs(INITIAL_CLUBS);
    setPosts(INITIAL_POSTS);
    setSearchQuery('');
  };

  // Render proper screen context
  const renderActiveView = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return (
          <DashboardView
            user={user}
            announcements={announcements}
            events={events}
            hackathons={hackathons}
            clubs={clubs}
            posts={posts}
            onNavigate={setActiveView}
            onRegisterEvent={handleRegisterEvent}
            onJoinClub={handleJoinClub}
            searchQuery={searchQuery}
          />
        );
      case 'COMMUNITY_FEED':
        return (
          <CommunityFeedView
            user={user}
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            searchQuery={searchQuery}
          />
        );
      case 'ANNOUNCEMENTS':
        return (
          <AnnouncementsView
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            searchQuery={searchQuery}
          />
        );
      case 'EVENTS':
        return (
          <EventsView
            events={events}
            onRegisterEvent={handleRegisterEvent}
            searchQuery={searchQuery}
          />
        );
      case 'HACKATHONS':
        return (
          <HackathonsView
            hackathons={hackathons}
            clubs={clubs}
            onRegisterHackathon={handleRegisterHackathon}
            onJoinClub={handleJoinClub}
            searchQuery={searchQuery}
          />
        );
      case 'PROFILE':
        return (
          <ProfileView
            user={user}
            onUpdateUser={handleUpdateUser}
            joinedClubs={clubs.filter(c => c.isJoined)}
            registeredEvents={[
              ...events.filter(e => e.isRegistered),
              ...hackathons.filter(h => h.isRegistered).map(h => ({
                id: h.id,
                title: h.title,
                description: h.description,
                date: h.date,
                time: h.type,
                location: h.scope,
                category: h.category,
                isRegistered: h.isRegistered,
                imagePlaceholderColor: "from-amber-600 to-yellow-600"
              }))
            ]}
          />
        );
      case 'SETTINGS':
        return <SettingsView onResetData={handleResetData} />;
      default:
        return (
          <DashboardView
            user={user}
            announcements={announcements}
            events={events}
            hackathons={hackathons}
            clubs={clubs}
            posts={posts}
            onNavigate={setActiveView}
            onRegisterEvent={handleRegisterEvent}
            onJoinClub={handleJoinClub}
            searchQuery={searchQuery}
          />
        );
    }
  };

  // Public Landing / Login wrappers
  if (!isLoggedIn) {
    if (activeView === 'LOGIN') {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="login-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onNavigateBack={() => setActiveView('LANDING')}
            />
          </motion.div>
        </AnimatePresence>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LandingView onNavigate={setActiveView} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex bg-[#0a0f1d] min-h-screen text-gray-100">
      {/* Navigation Sidebar panel */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Right panel section */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Header
          user={user}
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Inner View content wrapper */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
