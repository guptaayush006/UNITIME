import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { 
  Calendar, Upload, Clock, MapPin, X, ChevronDown, 
  ChevronUp, FileText, Brain, Loader2 
} from "lucide-react";
import GoogleCalendar from "./GoogleCalendar";

const Timetable = ({ isDark }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTimetable, setShowTimetable] = useState(true);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  
  // AI State
  const [analyzing, setAnalyzing] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "timetable"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingClasses(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const removeFile = () => setSelectedFile(null);

  const analyzeSchedule = async () => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      
      formData.append("availableTime", "60");
      // Add more specific student data if you have it
      formData.append("studentData", JSON.stringify({ goal: "Exam Preparation" }));

      // NEW:
// If VITE_API_URL is set (in production), use it. Otherwise use localhost.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const response = await fetch(`${API_URL}/api/analyze`, {
  method: "POST",
  // ... rest of your code
        body: formData,
      });

      const data = await response.json();
      setAiPlan(data);
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Analysis failed. Ensure backend is running!");
    } finally {
      setAnalyzing(false);
    }
  };

  const theme = isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const card = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen transition-colors ${theme}`}>
      <header className={`sticky top-0 z-50 border-b ${isDark ? "bg-gray-900/80 border-white/10" : "bg-white border-gray-200"} backdrop-blur`}>
        <div className="flex justify-between items-center px-6 py-4">
          <div><h1 className="text-xl font-bold">UniTime</h1><p className="text-sm opacity-70">Dynamic Timetable</p></div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        
        <div className={`rounded-xl border ${card}`}>
          <button onClick={() => setShowTimetable(!showTimetable)} className="w-full px-6 py-4 flex justify-between items-center">
            <span className="flex items-center gap-2 font-semibold"><Calendar /> Class Schedule</span>{showTimetable ? <ChevronUp /> : <ChevronDown />}
          </button>

          {showTimetable && (
            <div className="px-6 pb-6 space-y-6">
              
              {/* File Selection Area */}
              <div className={`p-4 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                <div className="text-center">
                  <Upload className={`mx-auto h-8 w-8 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className="text-sm font-medium mb-2">Upload Timetable (PDF/Image)</p>
                  
                  {!selectedFile ? (
                    <label className="inline-flex items-center px-4 py-2 rounded-lg cursor-pointer font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all">
                      <Upload className="w-4 h-4 mr-2" /> Select File 
                      <input 
                        type="file" 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="flex items-center text-sm font-medium text-blue-500">
                        <FileText className="w-4 h-4 mr-1" /> {selectedFile.name}
                      </span>
                      <button onClick={removeFile} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis Section */}
              <div className={`p-4 rounded-xl border ${isDark ? "bg-indigo-900/20 border-indigo-700" : "bg-indigo-50 border-indigo-200"}`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Brain className="text-indigo-500" /> AI Optimizer
                    </h3>
                    <p className="text-sm opacity-70">Analyze uploaded schedule & optimize free time.</p>
                  </div>
                  <button 
                    onClick={analyzeSchedule}
                    disabled={analyzing || !selectedFile}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? <Loader2 className="animate-spin" /> : <Brain size={18} />}
                    {analyzing ? "Analyzing..." : "Analyze File"}
                  </button>
                </div>

                {/* --- FIXED DARK MODE FOR AI RESULTS --- */}
                {aiPlan && (
                  <div className={`mt-6 animate-in fade-in slide-in-from-top-2 p-6 rounded-xl shadow-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-100'}`}>
                    {/* Header */}
                    <div className={`flex items-center gap-3 mb-4 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                        <Brain className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Recommended Session</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Based on your schedule</p>
                      </div>
                    </div>

                    {/* Primary Task */}
                    <div className="mb-6">
                      <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {aiPlan.primaryTask}
                      </h4>
                      <p className={`leading-relaxed p-4 rounded-lg ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                        {aiPlan.reason || aiPlan.primaryReason}
                      </p>
                    </div>

                    {/* Alternatives */}
                    {aiPlan.alternatives && aiPlan.alternatives.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wider opacity-70 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Alternative Options
                        </h4>
                        <div className="grid gap-3 md:grid-cols-2">
                          {aiPlan.alternatives.map((alt, i) => (
                            <div key={i} className={`p-4 rounded-lg border transition-colors cursor-pointer group ${isDark ? 'border-gray-700 hover:border-indigo-700' : 'border-gray-200 hover:border-indigo-300'}`}>
                              <div className={`font-bold transition-colors ${isDark ? 'text-gray-200 group-hover:text-indigo-400' : 'text-gray-800 group-hover:text-indigo-600'}`}>
                                {alt.task}
                              </div>
                              <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {alt.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* --- END FIXED SECTION --- */}
              </div>

              {/* Weekly Attendance (Read Only) */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Weekly Attendance Tracking</h4>
                <div className="space-y-2">
                  {loadingClasses ? (<div className="text-center py-4 opacity-50">Loading classes...</div>) : classes.length > 0 ? classes.map((cls) => (
                    <div key={cls.id} className={`p-3 rounded-lg border ${cls.attended ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200' : isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${cls.attended ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-medium">{cls.subject}</span>
                          </div>
                          <div className="text-sm opacity-70 mt-1">{cls.day} • {cls.time}</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm opacity-70"><MapPin className="w-4 h-4" /> {cls.room}</div>
                      </div>
                    </div>
                  )) : (<p className="text-center py-4 opacity-50">No classes scheduled in database.</p>)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
           <GoogleCalendar isDark={isDark} />
        </div>
      </main>
    </div>
  );
};
export default Timetable;