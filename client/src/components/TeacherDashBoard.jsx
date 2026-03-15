import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Ensure this path is correct
import { doc, onSnapshot, collection, updateDoc, query, where } from "firebase/firestore";
import {
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  CheckCircle
} from "lucide-react";

const TeacherDashboard = ({ isDark }) => {
  // --- REAL-TIME STATES ---
  const [classCancelled, setClassCancelled] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [gapInsights, setGapInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Listen for Today's Class Status (Real-time)
    // Assuming a document exists for the current class/session
    const classRef = doc(db, "classes", "today_os_session"); 
    const unsubClass = onSnapshot(classRef, (docSnap) => {
      if (docSnap.exists()) {
        setClassCancelled(docSnap.data().isCancelled);
      }
    });

    // 2. Listen for Assignments
    const unsubAssignments = onSnapshot(collection(db, "assignments"), (snapshot) => {
      setAssignments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Listen for AI-Detected Learning Gaps
    const unsubGaps = onSnapshot(collection(db, "learningGaps"), (snapshot) => {
      setGapInsights(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => {
      unsubClass();
      unsubAssignments();
      unsubGaps();
    };
  }, []);

  // --- DATABASE ACTIONS ---
  const handleToggleCancel = async () => {
    try {
      const classRef = doc(db, "classes", "today_os_session");
      await updateDoc(classRef, {
        isCancelled: !classCancelled,
        cancelledAt: !classCancelled ? new Date() : null
      });
      // This update will trigger the onSnapshot in Student dashboards instantly
    } catch (error) {
      console.error("Error updating class status:", error);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Syncing Faculty Dashboard...</div>;

  return (
    <div className={`transition-colors ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <main className="px-6 py-8 space-y-8 max-w-5xl mx-auto">
        
        {/* Class Control */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Today's Class</h2>
              <p className="text-sm text-gray-400">Operating Systems — 2:30 PM</p>
            </div>

            <button
              onClick={handleToggleCancel}
              className={`px-4 py-2 text-white rounded-lg font-semibold transition-colors ${
                classCancelled ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {classCancelled ? "Undo Cancel" : "Cancel Class"}
            </button>
          </div>

          {classCancelled && (
            <div className="mt-4 flex items-start gap-3 text-sm animate-bounce">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <p className="text-gray-400">
                Class cancelled. AI is now recommending productive activities to all students.
              </p>
            </div>
          )}
        </div>

        {/* Assignments Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" /> Assignments
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {assignments.map((a) => (
              <div key={a.id} className={`p-5 rounded-xl border ${isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}`}>
                <h3 className="font-bold text-lg mb-1">{a.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{a.subject}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>{a.submissions}/{a.total} submissions</span>
                  <CheckCircle className={`w-5 h-5 ${a.submissions === a.total ? "text-green-500" : "text-gray-400"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Learning Gaps Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> AI Detected Learning Gaps
          </h2>
          <div className="space-y-3">
            {gapInsights.map((gap) => (
              <div key={gap.id} className={`p-5 rounded-xl border ${isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{gap.topic}</h3>
                    <p className="text-sm text-gray-400">{gap.affectedStudents} students affected</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded ${
                    gap.severity === "high" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {gap.severity?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 pt-6">
          You manage learning. UniTime handles optimization.
        </p>
      </main>
    </div>
  );
};

export default TeacherDashboard;