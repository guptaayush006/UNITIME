import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  BookOpen, Award, Target, Users 
} from "lucide-react";

export default function Profile({ isDark, userType = 'student' }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen to the specific user document in Firestore
    const userRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading profile...</div>;
  if (!user) return <div className="p-10 text-center">No profile found. Please update your settings.</div>;

  // Map backend data to display (providing defaults for missing fields)
  const displayData = {
    name: user.name || "User",
    email: user.email || auth.currentUser.email,
    phone: user.phone || "Not provided",
    location: user.location || "Not provided",
    joinDate: user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "Recently",
    major: user.major || user.department || "General Studies",
    year: user.year || user.position || "N/A",
    gpa: user.gpa || user.experience || "N/A",
    students: user.students || 0,
    courses: user.courses || user.subjects || [],
    achievements: user.achievements || [],
    goals: user.goals || []
  };

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}>
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${textClass}`}>{displayData.name}</h1>
          <p className={`text-lg ${mutedTextClass}`}>
            {userType === 'teacher' ? `${displayData.year} • ${displayData.major}` : `${displayData.major} • ${displayData.year}`}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <InfoItem icon={<Mail />} label="Email" value={displayData.email} {...{mutedTextClass, textClass}} />
          <InfoItem icon={<Phone />} label="Phone" value={displayData.phone} {...{mutedTextClass, textClass}} />
          <InfoItem icon={<MapPin />} label="Location" value={displayData.location} {...{mutedTextClass, textClass}} />
          <InfoItem icon={<Calendar />} label="Joined" value={displayData.joinDate} {...{mutedTextClass, textClass}} />
        </div>
      </div>

      {/* Stats Section */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
          {userType === 'teacher' ? 'Professional Information' : 'Academic Information'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <StatItem value={displayData.gpa} label={userType === 'teacher' ? 'Experience' : 'GPA'} {...{textClass, mutedTextClass}} />
          <StatItem value={userType === 'teacher' ? displayData.students : displayData.year} label={userType === 'teacher' ? 'Students' : 'Year'} {...{textClass, mutedTextClass}} />
          <StatItem value={displayData.major} label={userType === 'teacher' ? 'Department' : 'Major'} {...{textClass, mutedTextClass}} />
        </div>

        <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>
          {userType === 'teacher' ? 'Current Subjects' : 'Current Courses'}
        </h3>
        <div className="space-y-3">
          {displayData.courses.map((item, index) => (
            <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                {userType === 'teacher' ? <Users className="text-blue-500" /> : <BookOpen className="text-blue-500" />}
                <div>
                  <p className={`font-medium ${textClass}`}>{item.code}</p>
                  <p className={`text-sm ${mutedTextClass}`}>{item.name}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-sm font-medium ${userType === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {userType === 'teacher' ? `${item.students} students` : item.grade}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements & Goals */}
      <ListSection title="Achievements" icon={<Award className="text-yellow-500" />} items={displayData.achievements} {...{cardClass, textClass, isDark}} />
      <ListSection title={userType === 'teacher' ? 'Professional Goals' : 'Academic Goals'} icon={<Target className="text-green-500" />} items={displayData.goals} {...{cardClass, textClass, isDark}} />
    </div>
  );
}

// Internal Sub-components
function InfoItem({ icon, label, value, mutedTextClass, textClass }) {
  return (
    <div className="flex items-center gap-3">
      {React.cloneElement(icon, { className: "w-5 h-5 text-blue-500" })}
      <div>
        <p className={`text-sm ${mutedTextClass}`}>{label}</p>
        <p className={textClass}>{value}</p>
      </div>
    </div>
  );
}

function StatItem({ value, label, textClass, mutedTextClass }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
      <p className={`text-sm ${mutedTextClass}`}>{label}</p>
    </div>
  );
}

function ListSection({ title, icon, items, cardClass, textClass, isDark }) {
  return (
    <div className={`p-6 rounded-xl border ${cardClass}`}>
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>{icon} {title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            {icon}
            <p className={textClass}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}