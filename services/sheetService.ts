import { Session } from '../types';

// TODO: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
// It should look like: 'https://script.google.com/macros/s/AKfycbx.../exec'
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyGS-__Msdq2_a8sSsMq6Y0c8T3TR9hoES_9HBOpaYW4woaj7knvBvGK9pzdnyun5Wu0A/exec'; 

export const submitRegistration = async (userName: string, sessions: Session[]) => {
  // Check if the URL has been updated from the default placeholder
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('REPLACE_WITH')) {
    console.warn("Google Script URL is not configured.");
    // Simulate a short delay so the user sees something happened, then return failure
    await new Promise(resolve => setTimeout(resolve, 1000));
    return false; 
  }

  const payload = {
    userName,
    sessions: sessions.map(s => ({
      slotId: s.slotId,
      title: s.title,
      presenter: s.presenter,
      room: s.room,
      time: s.slotId 
    })),
    submittedAt: new Date().toISOString()
  };

  try {
    // We use fetch with 'no-cors' mode.
    // Google Apps Script prevents reading the response directly in the browser due to CORS security.
    // 'no-cors' allows us to send the data, but we won't get a specific "success" message back.
    // We assume if the code doesn't crash, it worked.
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
