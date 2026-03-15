import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Play, TrendingUp, ChevronDown, 
  ChevronUp, User, Zap, CheckCircle 
} from "lucide-react";
import { db, auth } from "../firebase";
import { doc, onSnapshot, collection, query, where, limit } from "firebase/firestore";

const UnifiedDashboard = ({ isDark }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [primaryActivity, setPrimaryActivity] = useState({ title: "Loading...", reason: "Syncing with AI..." });
  const [alternatives, setAlternatives] = useState([]);
  const [metrics, setMetrics] = useState({ productive: 0, gaps: 0, streak: 0 });
  const [showMetrics, setShowMetrics] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [startedActivity, setStartedActivity] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubSchedule = onSnapshot(doc(db, "schedules", auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) setTimeRemaining(docSnap.data().availableSeconds || 0);
    });
    const unsubActivities = onSnapshot(query(collection(db, "activities"), where("userId", "==", auth.currentUser.uid), limit(3)), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (docs.length > 0) { setPrimaryActivity(docs[0]); setAlternatives(docs.slice(1)); }
    });
    const unsubMetrics = onSnapshot(doc(db, "analytics", auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) setMetrics(docSnap.data());
    });
    return () => { unsubSchedule(); unsubActivities(); unsubMetrics(); };
  }, []);

  useEffect(() => {
    if (startedActivity || timeRemaining <= 0) return;
    const timer = setInterval(() => setTimeRemaining(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [startedActivity, timeRemaining]);

  const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const theme = isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const card = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";

  return (
    <div className={`transition-colors min-h-screen ${theme}`}>
      <header className={`sticky top-0 z-50 border-b ${isDark ? "bg-gray-900/80 border-white/10" : "bg-white border-gray-200"} backdrop-blur`}>
        <div className="flex justify-between items-center px-6 py-4">
          <div><h1 className="text-xl font-bold">UniTime</h1><p className="text-sm opacity-70">Live Schedule</p></div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}>🔥 {metrics.streak} day streak</span>
            <button onClick={() => navigate('/profile')} className="p-2 rounded-lg hover:bg-black/10 border border-gray-300 dark:border-gray-600"><User /></button>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 space-y-8 max-w-5xl mx-auto">
        <div className={`p-6 rounded-2xl border shadow-sm ${card}`}>
          <div className="flex justify-between items-center">
            <div><p className="text-sm opacity-70">Free Time Available</p><h2 className="text-4xl font-bold mt-1">{formatTime(timeRemaining)}</h2><p className="text-sm opacity-70 mt-1">Real-time optimization active</p></div>
            <Clock className="w-10 h-10 opacity-70" />
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${card}`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> AI Recommended</h3>
          <h4 className="text-2xl font-bold">{primaryActivity.title}</h4>
          <p className="opacity-70 mt-1">{primaryActivity.reason}</p>
          <button onClick={() => { setStartedActivity("primary"); setIsStarting(true); setTimeout(() => setIsStarting(false), 1200); }} className={`mt-5 w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2 ${isDark ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            {isStarting ? "Starting..." : startedActivity === "primary" ? <><CheckCircle /> Started</> : <><Play /> Start Now</>}
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-3 opacity-70">Other options</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {alternatives.map(a => (
              <div key={a.id} className={`p-5 rounded-xl border ${card}`}>
                <h4 className="font-bold">{a.title}</h4><p className="text-sm opacity-70 mt-1">{a.reason}</p>
                <button onClick={() => setStartedActivity(a.id)} className="mt-3 text-sm font-semibold text-blue-500">{startedActivity === a.id ? "Started" : "Start →"}</button>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border ${card}`}>
          <button onClick={() => setShowMetrics(!showMetrics)} className="w-full px-6 py-4 flex justify-between items-center">
            <span className="flex items-center gap-2 font-semibold"><TrendingUp /> Weekly Progress</span>{showMetrics ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showMetrics && (
            <div className="px-6 pb-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
              <div><p className="text-3xl font-bold">{metrics.productive}%</p><p className="text-sm opacity-70">Productive time</p></div>
              <div><p className="text-3xl font-bold">{metrics.gaps}</p><p className="text-sm opacity-70">Gaps closed</p></div>
              <div><p className="text-3xl font-bold">{metrics.streak}</p><p className="text-sm opacity-70">Day streak</p></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default UnifiedDashboard;