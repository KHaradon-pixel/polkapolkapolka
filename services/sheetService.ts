import { Session } from '../types';
import { TIME_SLOTS } from './mockData';

// Your Google Script URL
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyGS-__Msdq2_a8sSsMq6Y0c8T3TR9hoES_9HBOpaYW4woaj7knvBvGK9pzdnyun5Wu0A/exec'; 

export const submitRegistration = async (userName: string, sessions: Session[]) => {
  // Check if the URL has been updated from the default placeholder
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('REPLACE_WITH')) {
    console.warn("Google Script URL is not configured.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return false; 
  }

  const payload = {
    userName,
    sessions: sessions.map(s => {
      // Find readable time label
      const timeSlot = TIME_SLOTS.find(ts => ts.id === s.slotId);
      return {
        title: s.title,
        presenter: s.presenter,
        room: s.room,
        time: timeSlot ? timeSlot.label : s.slotId // Sends "June 2: 8:00 AM..." instead of "j2-slot-1"
      };
    }),
    submittedAt: new Date().toISOString()
  };

  try {
    // We use fetch with 'no-cors' mode.
    // Google Apps Script prevents reading the response directly in the browser due to CORS security.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      mode: 'no-cors'
    });
    
    return true;
  } catch (error) {
    console.error("Submission error", error);
    return false;
  }
};
