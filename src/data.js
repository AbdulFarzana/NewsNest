export const INITIAL_USER = {
  name: "Farzana Khan",
  role: "CSE - 3rd Year",
  age: 20,
  rollNumber: "21CS10048",
  email: "farzana.khan@college.edu",
  phone: "+91 98765 43210",
  location: "Vijayawada, India",
  joinedDate: "August 2023",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  postsCount: 48,
  eventsJoinedCount: 24,
  clubsCount: 5,
  badgesCount: 12,
};

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Mid Sem Timetable Released",
    content: "The Mid Semester Examination timetable has been released. Please check the exam section to view the dates, session slots, and room allocations for each subject.",
    category: "Important",
    publishedAt: "2h ago",
    issuer: "Exam Section"
  },
  {
    id: "ann-2",
    title: "Placement Drive by TCS",
    content: "TCS is visiting our campus for placements. Registration is mandatory on the NextStep portal. Check eligibility criteria and preparation guidelines in the attached PDF.",
    category: "Important",
    publishedAt: "1d ago",
    issuer: "Training & Placement Cell"
  },
  {
    id: "ann-3",
    title: "Holiday Notice",
    content: "College will remain closed on 15th August on account of Independence Day. Regular classes will resume from August 16th following the normal schedule.",
    category: "General",
    publishedAt: "2d ago",
    issuer: "Administration"
  },
  {
    id: "ann-4",
    title: "Library Timing Updated",
    content: "The Central Library will be open till 8 PM from this week on all working days to assist students with their mid-semester preparation and project work.",
    category: "Info",
    publishedAt: "3d ago",
    issuer: "Library"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "evt-1",
    title: "AI & ML Workshop",
    description: "Learn the basics of Artificial Intelligence & Machine Learning with practical hands-on projects, standard algorithms, and python frameworks.",
    date: "Tomorrow",
    time: "10:00 AM",
    location: "Seminar Hall",
    category: "Upcoming",
    isRegistered: false,
    imagePlaceholderColor: "from-indigo-600 to-purple-600"
  },
  {
    id: "evt-2",
    title: "CodeSprint Hackathon",
    description: "Build, innovate, compete, and win exciting prizes in this 24-hour rapid development sprint. Teams of 2-4 members are welcome.",
    date: "10 to 12 May 2024",
    time: "09:00 AM",
    location: "Online",
    category: "Upcoming",
    isRegistered: true,
    imagePlaceholderColor: "from-blue-600 to-indigo-600"
  },
  {
    id: "evt-3",
    title: "Design Thinking Bootcamp",
    description: "Enhance your problem-solving skills, learn empathy mapping, fast prototyping, and test structures directly under industrial design mentors.",
    date: "15 May 2024",
    time: "11:00 AM",
    location: "Design Lab",
    category: "Upcoming",
    isRegistered: false,
    imagePlaceholderColor: "from-purple-600 to-pink-600"
  }
];

export const INITIAL_HACKATHONS = [
  {
    id: "hack-1",
    title: "CodeFest 2.0",
    description: "Build digital solutions for tomorrow's complex community challenges. Open to all engineering departments.",
    prizePool: "₹1,00,000",
    date: "25 May 2024",
    type: "Online",
    scope: "National",
    category: "Upcoming",
    isRegistered: false
  },
  {
    id: "hack-2",
    title: "Hack IT 2024",
    description: "A premium state-level offline hackathon focused on cybersecurity solutions and robust distributed structures.",
    prizePool: "₹2,50,000",
    date: "30 June 2024",
    type: "Offline",
    scope: "National",
    category: "Upcoming",
    isRegistered: false
  },
  {
    id: "hack-3",
    title: "Smart India Hackathon 2024",
    description: "World's biggest innovation challenge targeting real-world institutional problems launched by the central ministry.",
    prizePool: "Government Grants",
    date: "20 July 2024",
    type: "Online",
    scope: "National",
    category: "Upcoming",
    isRegistered: false
  }
];

export const INITIAL_CLUBS = [
  {
    id: "club-1",
    name: "Coding Club",
    membersCount: "1.2k Members",
    isJoined: true,
    category: "Technical",
    icon: "Code"
  },
  {
    id: "club-2",
    name: "Robotics Club",
    membersCount: "900 Members",
    isJoined: false,
    category: "Technical",
    icon: "Cpu"
  },
  {
    id: "club-3",
    name: "Design Club",
    membersCount: "870 Members",
    isJoined: true,
    category: "Arts & Creative",
    icon: "Palette"
  },
  {
    id: "club-4",
    name: "Photography Club",
    membersCount: "760 Members",
    isJoined: false,
    category: "Media",
    icon: "Camera"
  },
  {
    id: "club-5",
    name: "Music & Drama Society",
    membersCount: "520 Members",
    isJoined: false,
    category: "Arts & Creative",
    icon: "Music"
  }
];

export const INITIAL_POSTS = [
  {
    id: "post-1",
    userName: "Sarah Khan",
    userRole: "CSE - 1st Year",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    content: "Anyone interested in a Flutter workshop this weekend? 🚀 We'll be building a cross-platform mobile app from scratch, covering basic state management and responsive widgets! Let me know in the comments if you want to join!",
    publishedAt: "1h ago",
    likes: 23,
    isLiked: false,
    comments: [
      {
        id: "c-1",
        userName: "Farzana Khan",
        userRole: "CSE - 3rd Year",
        content: "Definitely interested! Let me know if you need any help with arranging speakers or mentoring beginners.",
        publishedAt: "45m ago"
      },
      {
        id: "c-2",
        userName: "Aman Gupta",
        userRole: "ECE - 2nd Year",
        content: "Count me in! I've been wanting to learn Flutter for a long time.",
        publishedAt: "30m ago"
      }
    ]
  },
  {
    id: "post-2",
    userName: "Tech Enthusiasts Club",
    userRole: "Official Student Chapter",
    userAvatar: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=150",
    content: "Our club conducted a highly successful Web Development Session yesterday! 🌐 Over 120 students built and deployed their first responsive single page application. Thank you all for joining and showing incredible energy! Check out some glimpses from the lab below! 🙌✨",
    publishedAt: "4h ago",
    likes: 46,
    isLiked: true,
    clubName: "Coding Club",
    images: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400"
    ],
    comments: [
      {
        id: "c-3",
        userName: "Abdul Farzana",
        userRole: "CSE - 3rd Year",
        content: "Our team secured 2nd place in Smart India Hackathon 2024! So proud of the team! 🏆🔥",
        publishedAt: "3h ago"
      }
    ]
  }
];
