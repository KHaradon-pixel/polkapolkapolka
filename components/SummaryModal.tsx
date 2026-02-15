import React, { useEffect, useState } from 'react';
import { X, Copy, Download, Sparkles, Loader2 } from 'lucide-react';
import { Session, TimeSlot } from '../types';
import { generatePDSummary } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSessions: Session[];
  timeSlots: TimeSlot[];
  userName: string;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  selectedSessions,
  userName,
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedSessions.length > 0) {
      setLoading(true);
      generatePDSummary(selectedSessions, userName)
        .then(text => {
            setContent(text);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, selectedSessions, userName]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('Itinerary copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:absolute print:inset-0 print:bg-white print:p-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:rounded-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2 text-red-700">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold text-gray-900">Your PD Focus Guide</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 prose prose-red max-w-none">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="animate-spin text-red-600" size={48} />
                    <p className="text-gray-500 font-medium animate-pulse">Generating your personalized itinerary...</p>
                </div>
            ) : (
                <div className="print:block">
                   <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 print:hidden">
            <button 
                onClick={handleCopy}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
                <Copy size={18} />
                Copy Text
            </button>
            <button 
                onClick={handlePrint}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-700 rounded-lg font-medium text-white hover:bg-red-800 transition-all shadow-md"
            >
                <Download size={18} />
                Print / Save PDF
            </button>
        </div>
      </div>
    </div>
  );
};
