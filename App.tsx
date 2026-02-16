import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TimeSlotSection } from './components/TimeSlotSection';
import { SummaryModal } from './components/SummaryModal';
import { TIME_SLOTS, INITIAL_SESSIONS } from './services/mockData';
import { Session, UserSelections } from './types';
import { CalendarCheck, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  // State for user selections: { slotId: sessionId }
  const [selections, setSelections] = useState<UserSelections>({});
  
  // State for session data (to handle "capacity" changes purely on frontend for demo)
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  const handleSelectSession = (session: Session) => {
    // If the session is full and not already selected, do nothing
    if (session.enrolled >= session.capacity && selections[session.slotId] !== session.id) {
        return;
    }

    setSelections((prev) => {
      const currentSelectionId = prev[session.slotId];
      
      // If clicking the already selected session, usually we might deselect, 
      // but for this specific "switch" UI, we'll keep it simple: re-clicking does nothing or toggle. 
      // Let's assume clicking a new one switches. 
      if (currentSelectionId === session.id) {
        return prev; // No change
      }
      return { ...prev, [session.slotId]: session.id };
    });

    // Update capacity locally for the visual demo
    setSessions((prevSessions) => {
        return prevSessions.map(s => {
            const currentSelectionId = selections[session.slotId];
            
            // If this is the session being selected
            if (s.id === session.id) {
                // If we are switching from another session, we shouldn't increment if we were already holding a spot?
                // Actually, for a pure frontend mock, let's just increment this one
                // and decrement the old one if it existed.
                return { ...s, enrolled: s.enrolled + 1 };
            }
            // If this was the PREVIOUSLY selected session in this slot, decrement it
            if (s.id === currentSelectionId) {
                return { ...s, enrolled: Math.max(0, s.enrolled - 1) };
            }
            return s;
        });
    });
  };

  const selectedSessionsList = useMemo(() => {
    return Object.values(selections)
      .map(id => sessions.find(s => s.id === id))
      .filter((s): s is Session => !!s)
      .sort((a, b) => a.slotId.localeCompare(b.slotId)); // Simple sort by slot ID
  }, [selections, sessions]);

  if (!hasStarted) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <CalendarCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Barrington 220 PD</h2>
                    <p className="text-gray-600 mb-8">
                        Welcome! Please enter your name to begin selecting your sessions for the June 2-3 Professional Development workshops.
                    </p>
                    
                    <input 
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name to sign in"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all mb-4 text-center text-lg"
                    />

                    <button 
                        onClick={() => setHasStarted(true)}
                        disabled={!userName.trim()}
                        className="w-full py-3.5 rounded-xl font-bold text-white bg-red-800 hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        Start Registration <ChevronRight size={20} />
                    </button>
                    
                    <div className="mt-8 text-xs text-gray-400">
                        Official Barrington 220 Schedule • June 2-3
                    </div>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-slate-800">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome, {userName}</h2>
                <p className="text-gray-600 mt-2 max-w-2xl">
                    Select one session for each time block below. Sessions fill up quickly, so secure your spot now.
                    You can change your selection until the session is full.
                </p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="text-sm">
                    <span className="block text-gray-500">Your Progress</span>
                    <span className="font-bold text-gray-900">{selectedSessionsList.length} / {TIME_SLOTS.length} Selected</span>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={selectedSessionsList.length === 0}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    View & Save Schedule
                </button>
            </div>
        </div>

        <div className="space-y-4">
          {TIME_SLOTS.map((slot) => (
            <TimeSlotSection
              key={slot.id}
              slot={slot}
              sessions={sessions.filter((s) => s.slotId === slot.id)}
              selectedSessionId={selections[slot.id]}
              onSelectSession={handleSelectSession}
            />
          ))}
        </div>

        {/* Floating Action Button for Mobile / Sticky Bottom */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
            <button
                onClick={() => setIsModalOpen(true)}
                disabled={selectedSessionsList.length === 0}
                className="w-14 h-14 bg-red-800 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-red-900 transition-all disabled:opacity-50"
            >
                <CalendarCheck size={24} />
            </button>
        </div>

        <div className="mt-16 text-center text-sm text-gray-400 border-t pt-8 pb-4">
            Barrington 220 School District • Professional Development
        </div>

      </main>

      <SummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSessions={selectedSessionsList}
        timeSlots={TIME_SLOTS}
        userName={userName}
      />
    </div>
  );
};

export default App;
