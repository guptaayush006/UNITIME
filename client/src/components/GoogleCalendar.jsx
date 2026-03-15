
import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

// 👇 PASTE YOUR KEYS FROM STEP 1 HERE 👇
const API_KEY = "AIzaSyCyUUTRRWuUQ0vuO1JcpPDo0Wn5gB-qUpM";
const CLIENT_ID = "806375496068-cdi7fq1o7adv77ge6h0l0u83s1j1hn46.apps.googleusercontent.com";

const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

const GoogleCalendar = ({ isDark }) => {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const updateSigninStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
    if (isSignedIn) {
      listUpcomingEvents();
    }
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
    setEvents([]);
  };

  const listUpcomingEvents = () => {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(response => {
      setEvents(response.result.items);
    });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', 
      hour: 'numeric', minute: '2-digit', hour12: true 
    });
  };

  // --- DARK MODE LOGIC ---
  const containerClass = isDark 
    ? "bg-gray-800 border-gray-700 text-white" 
    : "bg-white border-gray-100 text-gray-800";
    
  const itemClass = isDark
    ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
    : "bg-white hover:bg-gray-50 border-l-4 border-blue-500 shadow-sm text-gray-800";

  const dateClass = isDark ? "text-blue-400" : "text-blue-600";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`p-6 rounded-xl shadow-lg border h-full transition-colors ${containerClass}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <span className={dateClass}>📅</span> Your Schedule
        </h3>
        
        {!isSignedIn ? (
          <button 
            onClick={handleAuthClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md"
          >
            Sync Google Calendar
          </button>
        ) : (
          <button 
            onClick={handleSignoutClick}
            className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
          >
            Disconnect
          </button>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {isSignedIn && events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className={`flex gap-4 p-3 rounded-lg transition-colors ${itemClass} ${!isDark && 'border-l-4 border-blue-500'}`}>
              <div className="flex flex-col items-center justify-center min-w-[50px]">
                <span className={`text-xs font-bold uppercase ${dateClass}`}>
                  {new Date(event.start.dateTime || event.start.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {new Date(event.start.dateTime || event.start.date).getDate()}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{event.summary}</h4>
                <p className={`text-xs mt-1 ${subTextClass}`}>
                  ⏰ {event.start.dateTime ? formatDate(event.start.dateTime) : "All Day"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg ${isDark ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-400'}`}>
            <p className="text-sm">
              {isSignedIn ? "No upcoming events found." : "Sign in to view your calendar."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendar;