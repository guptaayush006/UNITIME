import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { TrendingUp, Clock, Target, Award, BarChart3, PieChart, Users } from "lucide-react";
// IMPORT CALENDAR
import GoogleCalendar from "./GoogleCalendar";

export default function Analytics({ isDark, userType = 'student' }) {
  const [metrics, setMetrics] = useState({ totalHours: '0h', productive: '0%', streak: '0', sessions: '0' });
  const [weeklyData, setWeeklyData] = useState([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  useEffect(() => {
    if (!auth.currentUser) return;
    const analyticsRef = doc(db, "analytics", auth.currentUser.uid);
    const unsubMetrics = onSnapshot(analyticsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMetrics({
          totalHours: data.totalHours || '0h', productive: data.productivityScore || '0%',
          streak: data.streak || '0', sessions: data.totalSessions || '0'
        });
        setWeeklyData(data.weeklyProgress || []);
        setSubjectBreakdown(data.subjectBreakdown || []);
      }
    });
    const achvQuery = query(collection(db, "achievements"), where("userId", "==", auth.currentUser.uid));
    const unsubAchv = onSnapshot(achvQuery, (snapshot) => {
      setAchievements(snapshot.docs.map(d => d.data()));
      setLoading(false);
    });
    return () => { unsubMetrics(); unsubAchv(); };
  }, [userType]);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading real-time analytics...</div>;

  return (
    <div className="space-y-6 min-h-screen">
      <div>
        <h1 className={`text-3xl font-bold ${textClass}`}>Analytics</h1>
        <p className={`mt-2 ${mutedTextClass}`}>{userType === 'teacher' ? 'Track performance' : 'Track your academic progress'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard icon={userType === 'teacher' ? <Users /> : <Clock />} value={metrics.totalHours} label={userType === 'teacher' ? 'Teaching Hours' : 'This Week'} color="text-blue-500" {...{cardClass, textClass, mutedTextClass}} />
        <MetricCard icon={<Target />} value={metrics.productive} label={userType === 'teacher' ? 'Avg Attendance' : 'Productive'} color="text-green-500" {...{cardClass, textClass, mutedTextClass}} />
        <MetricCard icon={<TrendingUp />} value={metrics.streak} label={userType === 'teacher' ? 'Week Streak' : 'Day Streak'} color="text-purple-500" {...{cardClass, textClass, mutedTextClass}} />
        <MetricCard icon={<Award />} value={metrics.sessions} label={userType === 'teacher' ? 'Classes' : 'Sessions'} color="text-yellow-500" {...{cardClass, textClass, mutedTextClass}} />
      </div>

      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}><BarChart3 className="w-5 h-5 text-blue-500" /> {userType === 'teacher' ? 'Weekly Class Attendance' : 'Weekly Study Hours'}</h2>
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-12 text-sm font-medium ${textClass}`}>{day.day}</div>
              <div className="flex-1"><div className={`h-6 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden`}><div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${day.value}%` }}></div></div></div>
              <div className={`w-16 text-sm text-right ${textClass}`}>{userType === 'teacher' ? `${day.value}%` : `${day.hours}h`}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}><PieChart className="w-5 h-5 text-green-500" /> {userType === 'teacher' ? 'Subject Performance' : 'Subject Breakdown'}</h2>
        <div className="space-y-4">
          {subjectBreakdown.map((subject, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1"><span className={`font-medium ${textClass}`}>{subject.subject}</span><span className={`text-sm ${mutedTextClass}`}>{userType === 'teacher' ? `${subject.students} students` : `${subject.hours}h`}</span></div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}><div className={`h-full rounded-full ${subject.color} transition-all duration-500`} style={{ width: `${subject.percentage}%` }}></div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}><Award className="w-5 h-5 text-yellow-500" /> Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex items-start gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className="text-2xl">{achievement.icon}</span>
              <div><h3 className={`font-semibold ${textClass}`}>{achievement.title}</h3><p className={`text-sm ${mutedTextClass}`}>{achievement.description}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* --- GOOGLE CALENDAR ADDED HERE --- */}
      <div className="mt-8">
         <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Your Schedule</h2>
         <GoogleCalendar isDark={isDark} />
      </div>
    </div>
  );
}

function MetricCard({ icon, value, label, color, cardClass, textClass, mutedTextClass }) {
  return (
    <div className={`p-6 rounded-xl border ${cardClass}`}>
      <div className="flex items-center gap-3">
        <div className={color}>{React.cloneElement(icon, { size: 32 })}</div>
        <div><p className={`text-2xl font-bold ${textClass}`}>{value}</p><p className={`text-sm ${mutedTextClass}`}>{label}</p></div>
      </div>
    </div>
  );
}