import React from 'react';
import { TimeSlot, Session } from '../types';
import { SessionCard } from './SessionCard';
import { Clock } from 'lucide-react';

interface TimeSlotSectionProps {
  slot: TimeSlot;
  sessions: Session[];
  selectedSessionId: string | undefined;
  onSelectSession: (session: Session) => void;
}

export const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({
  slot,
  sessions,
  selectedSessionId,
  onSelectSession,
}) => {
  return (
    <section className="mb-12 scroll-mt-24" id={slot.id}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-2 rounded-lg text-red-700">
            <Clock size={20} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900">{slot.label}</h2>
            <p className="text-gray-500 font-medium">{slot.startTime} - {slot.endTime}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isSelected={session.id === selectedSessionId}
            onSelect={onSelectSession}
            otherSelectedInSlot={!!selectedSessionId && selectedSessionId !== session.id}
          />
        ))}
      </div>
    </section>
  );
};
