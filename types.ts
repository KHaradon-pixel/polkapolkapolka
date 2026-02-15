export interface Session {
  id: string;
  slotId: string;
  title: string;
  description: string;
  presenter: string;
  room: string;
  capacity: number;
  enrolled: number;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
}

export interface UserSelections {
  [slotId: string]: string; // slotId -> sessionId
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
