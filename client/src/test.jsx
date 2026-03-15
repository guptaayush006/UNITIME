// import React, { useState } from "react"
// import {
//   Calendar,
//   Clock,
//   Brain,
//   Users,
//   TrendingUp,
//   Target,
//   Award,
//   Bell,
//   BookOpen,
//   Zap,
//   Activity,
//   Coffee,
//   Code,
//   Book,
//   Video,
//   Star,
//   ChevronRight,
//   Menu,
//   X
// } from "lucide-react"
// import Dashboard from "./components/Dashboard"
// import UnifiedDashboard from "./components/UnifiedDashboard"
// import Analytics from "./components/Analytics"
// import Profile from "./components/Profile"

// const AdaptiveStudentPlatform = ({ userRole, onLogout }) => {
//   const [currentView, setCurrentView] = useState("dashboard")
//   const [studentProfile, setStudentProfile] = useState({
//     name: "Alex Chen",
//     major: "Computer Science",
//     year: "Junior",
//     gpa: 3.7,
//     learningStyle: "Visual",
//     goals: [
//       "Master Machine Learning",
//       "Improve Data Structures",
//       "Build Portfolio"
//     ]
//   })

//   const [timeGaps, setTimeGaps] = useState([
//     {
//       id: 1,
//       start: "10:00 AM",
//       end: "11:30 AM",
//       duration: 90,
//       type: "predicted",
//       reason: "Historical cancellation pattern",
//       confidence: 85
//     },
//     {
//       id: 2,
//       start: "2:00 PM",
//       end: "2:45 PM",
//       duration: 45,
//       type: "scheduled",
//       reason: "Break between classes",
//       confidence: 100
//     },
//     {
//       id: 3,
//       start: "4:30 PM",
//       end: "6:00 PM",
//       duration: 90,
//       type: "available",
//       reason: "Free time slot",
//       confidence: 100
//     }
//   ])

//   const [recommendations, setRecommendations] = useState([
//     {
//       id: 1,
//       title: "Neural Networks Fundamentals",
//       type: "course",
//       duration: 45,
//       difficulty: "Intermediate",
//       relevance: 95,
//       provider: "Google Cloud Skills Boost",
//       description: "Learn the basics of neural networks and deep learning",
//       skills: ["Machine Learning", "Python", "TensorFlow"],
//       icon: "brain",
//       progress: 60
//     },
//     {
//       id: 2,
//       title: "Data Structures Study Group",
//       type: "collaboration",
//       duration: 60,
//       difficulty: "All Levels",
//       relevance: 88,
//       participants: 4,
//       description: "Join peers reviewing tree and graph algorithms",
//       skills: ["Data Structures", "Algorithms"],
//       icon: "users",
//       location: "Library Study Room 3B"
//     },
//     {
//       id: 3,
//       title: "React Component Patterns",
//       type: "micro-learning",
//       duration: 15,
//       difficulty: "Intermediate",
//       relevance: 82,
//       provider: "Interactive Tutorial",
//       description: "Quick dive into advanced React patterns",
//       skills: ["React", "Frontend Development"],
//       icon: "code"
//     },
//     {
//       id: 4,
//       title: "Mindful Break Session",
//       type: "wellness",
//       duration: 10,
//       difficulty: "Beginner",
//       relevance: 75,
//       description: "Guided meditation to recharge between classes",
//       skills: ["Wellness", "Focus"],
//       icon: "coffee"
//     }
//   ])

//   const [achievements, setAchievements] = useState([
//     {
//       id: 1,
//       title: "7-Day Streak",
//       icon: "award",
//       unlocked: true,
//       date: "Today"
//     },
//     {
//       id: 2,
//       title: "Early Adopter",
//       icon: "star",
//       unlocked: true,
//       date: "3 days ago"
//     },
//     {
//       id: 3,
//       title: "10 Hours Optimized",
//       icon: "clock",
//       unlocked: true,
//       date: "1 week ago"
//     },
//     {
//       id: 4,
//       title: "Collaboration Master",
//       icon: "users",
//       unlocked: false,
//       progress: 60
//     }
//   ])

//   const [analytics, setAnalytics] = useState({
//     weeklyHoursOptimized: 12.5,
//     productivityScore: 87,
//     skillsLearned: 8,
//     streakDays: 7,
//     weeklyTrend: [65, 72, 78, 85, 83, 89, 87]
//   })

//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: "Time Gap Detected",
//       message: "You have 90 minutes available at 10:00 AM",
//       time: "5 min ago",
//       type: "gap",
//       read: false
//     },
//     {
//       id: 2,
//       title: "New Recommendation",
//       message: "Perfect course match for your ML goal",
//       time: "15 min ago",
//       type: "recommendation",
//       read: false
//     },
//     {
//       id: 3,
//       title: "Study Group Forming",
//       message: "3 peers available for Data Structures review",
//       time: "1 hour ago",
//       type: "collaboration",
//       read: true
//     }
//   ])

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   const getIcon = iconName => {
//     const icons = {
//       brain: Brain,
//       users: Users,
//       code: Code,
//       coffee: Coffee,
//       book: Book,
//       video: Video,
//       award: Award,
//       star: Star,
//       clock: Clock
//     }
//     const IconComponent = icons[iconName] || BookOpen
//     return <IconComponent className="w-5 h-5" />
//   }

//   const getDifficultyColor = difficulty => {
//     const colors = {
//       Beginner: "bg-green-100 text-green-700",
//       Intermediate: "bg-blue-100 text-blue-700",
//       Advanced: "bg-purple-100 text-purple-700",
//       "All Levels": "bg-gray-100 text-gray-700"
//     }
//     return colors[difficulty] || "bg-gray-100 text-gray-700"
//   }

//   const getTypeColor = type => {
//     const colors = {
//       course: "bg-indigo-500",
//       collaboration: "bg-pink-500",
//       "micro-learning": "bg-amber-500",
//       wellness: "bg-emerald-500"
//     }
//     return colors[type] || "bg-gray-500"
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
//                 <Brain className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   TimeWise
//                 </h1>
//                 <p className="text-xs text-gray-500">
//                   Adaptive Learning Platform
//                 </p>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center gap-6">
//               <button
//                 onClick={() => setCurrentView("dashboard")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   currentView === "dashboard"
//                     ? "bg-indigo-50 text-indigo-600"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <Calendar className="w-4 h-4" />
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => setCurrentView("analytics")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   currentView === "analytics"
//                     ? "bg-indigo-50 text-indigo-600"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 Analytics
//               </button>
//               <button
//                 onClick={() => setCurrentView("profile")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   currentView === "profile"
//                     ? "bg-indigo-50 text-indigo-600"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <Target className="w-4 h-4" />
//                 Profile
//               </button>
//             </nav>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={onLogout}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
//               >
//                 Logout
//               </button>
//               <div className="relative">
//                 <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                   <Bell className="w-5 h-5" />
//                   <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                 </button>
//               </div>

//               <button
//                 className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 {mobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {mobileMenuOpen && (
//             <div className="md:hidden py-4 border-t border-gray-200">
//               <nav className="flex flex-col gap-2">
//                 <button
//                   onClick={() => {
//                     setCurrentView("dashboard")
//                     setMobileMenuOpen(false)
//                   }}
//                   className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${
//                     currentView === "dashboard"
//                       ? "bg-indigo-50 text-indigo-600"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   <Calendar className="w-4 h-4" />
//                   Dashboard
//                 </button>
//                 <button
//                   onClick={() => {
//                     setCurrentView("analytics")
//                     setMobileMenuOpen(false)
//                   }}
//                   className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${
//                     currentView === "analytics"
//                       ? "bg-indigo-50 text-indigo-600"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   <TrendingUp className="w-4 h-4" />
//                   Analytics
//                 </button>
//                 <button
//                   onClick={() => {
//                     setCurrentView("profile")
//                     setMobileMenuOpen(false)
//                   }}
//                   className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${
//                     currentView === "profile"
//                       ? "bg-indigo-50 text-indigo-600"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   <Target className="w-4 h-4" />
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => {
//                     onLogout();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
//                 >
//                   Logout
//                 </button>
//               </nav>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {currentView === "dashboard" && <UnifiedDashboard />}
//         {currentView === "analytics" && <Analytics analytics={analytics} studentProfile={studentProfile} />}
//         {currentView === "profile" && <Profile studentProfile={studentProfile} analytics={analytics} />}
//       </main>

//       {/* Floating Action Button */}
//       <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110">
//         <Zap className="w-6 h-6" />
//       </button>
//     </div>
//   )
// }

// export default AdaptiveStudentPlatform
