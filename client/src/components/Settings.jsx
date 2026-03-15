import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Ensure this path is correct
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Bell, Moon, Sun, Clock, Shield, Save, Users, BookOpen } from "lucide-react";

export default function Settings({ isDark, setIsDark, userType = 'student' }) {
  // --- REAL-TIME STATES ---
  const [settings, setSettings] = useState({
    notifications: {
      reminders: true,
      deadlines: true,
      reports: false
    },
    focus: {
      sessionDuration: userType === 'teacher' ? "60" : "25",
      breakDuration: "5",
      autoStart: true
    },
    privacy: {
      shareUsage: false,
      hideActivities: true
    }
  });
  const [loading, setLoading] = useState(true);

  const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  // 1. Fetch existing settings from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const settingsRef = doc(db, "settings", auth.currentUser.uid);
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Handle Save to Firestore
  const handleSave = async () => {
    try {
      const settingsRef = doc(db, "settings", auth.currentUser.uid);
      await updateDoc(settingsRef, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  // Helper to update nested state
  const updateNestedSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Syncing preferences...</div>;

  return (
    <div className="space-y-6 min-h-screen">
      <div>
        <h1 className={`text-3xl font-bold ${textClass}`}>Settings</h1>
        <p className={`mt-2 ${mutedTextClass}`}>Customize your UniTime experience</p>
      </div>

      {/* Notifications */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          <Bell className="w-5 h-5 text-blue-500" /> Notifications
        </h2>
        <div className="space-y-4">
          <ToggleItem 
            label={userType === 'teacher' ? 'Class Reminders' : 'Study Reminders'}
            sublabel={userType === 'teacher' ? 'Get notified before class starts' : 'Get notified when it\'s time to study'}
            checked={settings.notifications.reminders}
            onChange={(val) => updateNestedSetting('notifications', 'reminders', val)}
            {...{textClass, mutedTextClass}}
          />
          <ToggleItem 
            label={userType === 'teacher' ? 'Assignment Deadlines' : 'Break Reminders'}
            sublabel={userType === 'teacher' ? 'Remind me of upcoming deadlines' : 'Remind me to take breaks'}
            checked={settings.notifications.deadlines}
            onChange={(val) => updateNestedSetting('notifications', 'deadlines', val)}
            {...{textClass, mutedTextClass}}
          />
        </div>
      </div>

      {/* Appearance */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          {isDark ? <Moon className="w-5 h-5 text-yellow-400" /> : <Sun className="w-5 h-5 text-orange-500" />}
          Appearance
        </h2>
        <div className="flex gap-3">
          <button onClick={() => setIsDark(false)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${!isDark ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-600 text-gray-300'}`}>
            <Sun size={16} /> Light
          </button>
          <button onClick={() => setIsDark(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDark ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-600 text-gray-300'}`}>
            <Moon size={16} /> Dark
          </button>
        </div>
      </div>

      {/* Focus Settings */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          {userType === 'teacher' ? <BookOpen className="text-green-500" /> : <Clock className="text-green-500" />}
          {userType === 'teacher' ? 'Class Settings' : 'Focus Settings'}
        </h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <SelectField 
              label={userType === 'teacher' ? 'Default Class Duration' : 'Default Study Session'}
              value={settings.focus.sessionDuration}
              options={["25", "45", "60", "90"]}
              onChange={(val) => updateNestedSetting('focus', 'sessionDuration', val)}
              {...{isDark, textClass}}
            />
            {userType !== 'teacher' && (
              <SelectField 
                label="Default Break Time"
                value={settings.focus.breakDuration}
                options={["5", "10", "15", "20"]}
                onChange={(val) => updateNestedSetting('focus', 'breakDuration', val)}
                {...{isDark, textClass}}
              />
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function ToggleItem({ label, sublabel, checked, onChange, textClass, mutedTextClass }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className={`font-medium ${textClass}`}>{label}</p>
        <p className={`text-sm ${mutedTextClass}`}>{sublabel}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
    </div>
  );
}

function SelectField({ label, value, options, onChange, isDark, textClass }) {
  return (
    <div>
      <label className={`block font-medium mb-2 ${textClass}`}>{label} (mins)</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}