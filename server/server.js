// In-memory / persistent database store for NewsNest backend

export const db = {
  user: {
    id: "usr_101",
    name: "Farzana Khan",
    rollNumber: "21CS10048",
    email: "farzana.k@college.edu",
    phone: "+91 98765 43210",
    location: "Computer Science Dept, Block B",
    role: "Computer Science Undergraduate (3rd Year)",
    age: 21,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    joinedDate: "August 2023",
    postsCount: 3,
    eventsJoinedCount: 4,
    clubsCount: 2,
    badgesCount: 5
  },

  registeredUsers: [
    {
      id: "usr_101",
      email: "farzana.k@college.edu",
      rollNumber: "21CS10048",
      password: "password123",
      name: "Farzana Khan",
      role: "Computer Science Undergraduate (3rd Year)"
    }
  ],

  announcements: [
    {
      id: "ann-1",
      title: "End Semester Examination Schedule & Guidelines Released",
      description: "The official timetable for Spring 2026 terminal evaluations has been published by the Academic Affairs Controller. Ensure hall ticket clearances by May 10th.",
      date: "May 2, 2026",
      category: "Academic",
      author: "Dean of Academic Affairs",
      priority: "High",
      isPinned: true
    },
    {
      id: "ann-2",
      title: "Campus Wi-Fi Infrastructure Maintenance Window",
      description: "High-speed optical fiber backbone upgrade scheduled for Block A, B, and Central Library between 11 PM to 4 AM tonight. Intermittent downtime expected.",
      date: "May 1, 2026",
      category: "Infrastructure",
      author: "IT Infrastructure Services",
      priority: "Medium",
      isPinned: false
    },
    {
      id: "ann-3",
      title: "Annual Student Innovation Challenge 2026 Grants",
      description: "Submit multi-disciplinary project proposals for seed funding up to ₹2,00,000. Priority domains include Robotics, AI in Healthcare, and Sustainable Tech.",
      date: "Apr 28, 2026",
      category: "Research",
      author: "Incubation & Startup Cell",
      priority: "High",
      isPinned: false
    }
  ],

  events: [
    {
      id: "evt-1",
      title: "AI & Machine Learning Tech Symposium 2026",
      description: "Keynote talks, live AI model showcases, and research panel discussions with industrial researchers.",
      date: "May 15, 2026",
      time: "10:00 AM - 04:30 PM",
      location: "Main University Auditorium",
      category: "Upcoming",
      isRegistered: true,
      imagePlaceholderColor: "from-indigo-600 to-blue-600"
    },
    {
      id: "evt-2",
      title: "UI/UX Design Masterclass: Crafting Accessible Systems",
      description: "Hands-on design sprint workshop focusing on modern typography, design tokens, and user research.",
      date: "May 18, 2026",
      time: "02:00 PM - 05:00 PM",
      location: "Design Studio - Hall 4B",
      category: "Upcoming",
      isRegistered: false,
      imagePlaceholderColor: "from-purple-600 to-pink-600"
    },
    {
      id: "evt-3",
      title: "Robotics & Automation Society Expo",
      description: "Demonstration of autonomous rover prototypes, drone navigation algorithms, and robotic arms.",
      date: "May 22, 2026",
      time: "09:30 AM - 01:00 PM",
      location: "Mechanical Engineering Pavilion",
      category: "Upcoming",
      isRegistered: true,
      imagePlaceholderColor: "from-emerald-600 to-teal-600"
    }
  ],

  hackathons: [
    {
      id: "hack-1",
      title: "HackCampus '26: 36-Hour National Collegiate Sprint",
      description: "Build cutting-edge solutions for climate action, smart education, and healthcare access.",
      prizePool: "₹3,50,000",
      date: "May 29 - May 31, 2026",
      type: "Offline",
      scope: "National",
      category: "Upcoming",
      isRegistered: true
    },
    {
      id: "hack-2",
      title: "Global Open Source DevHack 2026",
      description: "Contribute to developer tools, public goods, and accessible Web infrastructure.",
      prizePool: "$5,000 USD",
      date: "June 10 - June 12, 2026",
      type: "Online",
      scope: "International",
      category: "Upcoming",
      isRegistered: false
    }
  ],

  clubs: [
    {
      id: "club-1",
      name: "Developers & Competitive Coding Club",
      category: "Technology",
      membersCount: "1,240 Members",
      icon: "Code",
      isJoined: true
    },
    {
      id: "club-2",
      name: "Robotics & Embedded Systems Guild",
      category: "Hardware",
      membersCount: "820 Members",
      icon: "Cpu",
      isJoined: true
    },
    {
      id: "club-3",
      name: "Design & Product Innovation Society",
      category: "Creative Arts",
      membersCount: "650 Members",
      icon: "Palette",
      isJoined: false
    },
    {
      id: "club-4",
      name: "Shutterbugs Photography Collective",
      category: "Media",
      membersCount: "410 Members",
      icon: "Camera",
      isJoined: false
    }
  ],

  posts: [
    {
      id: "post-1",
      author: {
        name: "Arjun Verma",
        rollNumber: "22EC10012",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
        role: "Electronics Dept • 2nd Year"
      },
      content: "Just finalized our autonomous obstacle-avoidance bot prototype for the upcoming Robotics Expo! Massive shoutout to the Robotics Guild mentors for helping debug our LIDAR sensor communication pipeline over SPI.",
      timestamp: "2 hours ago",
      category: "Project Showcase",
      likes: 34,
      isLiked: true,
      comments: [
        {
          id: "c1",
          author: "Farzana Khan",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          text: "Awesome work Arjun! What microcontroller are you guys using for LIDAR parsing?",
          timestamp: "1 hour ago"
        },
        {
          id: "c2",
          author: "Arjun Verma",
          avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
          text: "We're using an ESP32 for high throughput wireless telemetry paired with an STM32 processing core!",
          timestamp: "45 mins ago"
        }
      ]
    },
    {
      id: "post-2",
      author: {
        name: "Priya Sharma",
        rollNumber: "21CS10090",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        role: "Computer Science Dept • 3rd Year"
      },
      content: "Looking for 2 teammates (preferable frontend/React + Tailwind devs or UI designers) for HackCampus '26! Drop a comment if interested in building a smart campus sustainability dashboard.",
      timestamp: "5 hours ago",
      category: "Teammate Search",
      likes: 19,
      isLiked: false,
      comments: [
        {
          id: "c3",
          author: "Rohan Das",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
          text: "Interested! Sent you a message on Discord.",
          timestamp: "3 hours ago"
        }
      ]
    }
  ]
};
