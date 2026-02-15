import React from 'react';
import { Session } from '../types';
import { User, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  isSelected: boolean;
  onSelect: (session: Session) => void;
  otherSelectedInSlot: boolean; // If true, another session in this slot is selected
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isSelected,
  onSelect,
  otherSelectedInSlot,
}) => {
  const isFull = session.enrolled >= session.capacity;
  const isNearFull = !isFull && session.enrolled >= session.capacity - 5;
  
  // Calculate width for progress bar
  const fillPercentage = Math.min((session.enrolled / session.capacity) * 100, 100);

  let borderClass = 'border-gray-200';
  let bgClass = 'bg-white';
  
  if (isSelected) {
    borderClass = 'border-red-600 ring-1 ring-red-600';
    bgClass = 'bg-red-50';
  } else if (isFull) {
    bgClass = 'bg-gray-50 opacity-75';
  }

  return (
    <div 
      className={`relative rounded-xl border-2 ${borderClass} ${bgClass} p-5 transition-all duration-200 flex flex-col h-full ${!isFull ? 'hover:shadow-md' : ''}`}
    >
      {/* Selection Status Badge */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 shadow-sm">
          <CheckCircle size={20} fill="currentColor" className="text-white" />
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <h3 className={`text-lg font-bold leading-snug mb-1 ${isSelected ? 'text-red-900' : 'text-gray-900'}`}>
          {session.title}
        </h3>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{session.presenter}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{session.room}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
        {session.description}
      </p>

      {/* Footer / Action */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-medium">
                 {isFull ? (
                    <span className="text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} /> Full
                    </span>
                 ) : (
                    <span className={`${isNearFull ? 'text-orange-600' : 'text-gray-500'}`}>
                        {session.capacity - session.enrolled} spots left
                    </span>
                 )}
            </div>
            <div className="text-xs text-gray-400">
                Cap: {session.capacity}
            </div>
        </div>

        {/* Capacity Bar */}
        <div className="h-1.5 w-full bg-gray-100 rounded-full mb-4 overflow-hidden">
            <div 
                className={`h-full rounded-full ${isFull ? 'bg-red-500' : isNearFull ? 'bg-orange-400' : 'bg-green-500'}`} 
                style={{ width: `${fillPercentage}%` }}
            />
        </div>

        <button
          onClick={() => onSelect(session)}
          disabled={isFull && !isSelected}
          className={`
            w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2
            ${isSelected 
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm' 
              : isFull 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : otherSelectedInSlot 
                  ? 'bg-white border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
            }
          `}
        >
          {isSelected ? 'Selected' : isFull ? 'Session Full' : otherSelectedInSlot ? 'Switch to this Session' : 'Select Session'}
        </button>
      </div>
    </div>
  );
};
