import React, { useEffect, useState } from 'react';
import { X, Copy, Download, Sparkles, Loader2, Send, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { Session, TimeSlot } from '../types';
import { generatePDSummary } from '../services/geminiService';
import { submitRegistration, GOOGLE_SCRIPT_URL } from '../services/sheetService';
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
  const [loadingAI, setLoadingAI] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Submission States: idle -> submitting -> success | error
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
        setSubmissionStatus('idle');
        setIsCopied(false);
        if (selectedSessions.length > 0) {
            setLoadingAI(true);
            generatePDSummary(selectedSessions, userName)
                .then(text => setContent(text))
                .finally(() => setLoadingAI(false));
        }
    }
  }, [isOpen, selectedSessions, userName]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers or if permission denied
      alert('Could not copy automatically. Please select the text and copy manually.');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async () => {
    setSubmissionStatus('submitting');
    // Call the service we created in sheetService.ts
    const success = await submitRegistration(userName, selectedSessions);
    
    if (success) {
        setSubmissionStatus('success');
    } else {
        setSubmissionStatus('error');
    }
  };

  // Helper to check if the user forgot to paste their URL
  const isConfigured = GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('REPLACE_WITH');

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
            {/* SUCCESS MESSAGE */}
            {submissionStatus === 'success' && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-800 animate-fade-in print:hidden">
                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Registration Confirmed!</p>
                        <p className="text-sm">Your choices have been successfully recorded in the main system.</p>
                    </div>
                </div>
            )}
            
            {/* ERROR MESSAGE */}
            {submissionStatus === 'error' && (
                 <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-800 animate-fade-in print:hidden">
                    <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Submission Failed</p>
                        <p className="text-sm">
                            {isConfigured 
                                ? "There was a problem connecting to the spreadsheet. Please try again or print your schedule as a backup." 
                                : "System Error: The Google Sheet URL has not been configured in the code yet."}
                        </p>
                    </div>
                </div>
            )}

            {/* AI LOADING STATE */}
            {loadingAI ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="animate-spin text-red-600" size={48} />
                    <p className="text-gray-500 font-medium animate-pulse">Generating your personalized itinerary...</p>
                    {/* Allow reading while loading, or just show partial content if available */}
                </div>
            ) : (
                <div className="print:block">
                   <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row justify-end gap-3 print:hidden">
             
             {/* Left side actions (Print/Copy) */}
             <div className="flex gap-3 sm:mr-auto">
                 <button 
                    onClick={handleCopy}
                    disabled={loadingAI}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg font-medium transition-all shadow-sm
                        ${isCopied 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button 
                    onClick={handlePrint}
                    disabled={loadingAI}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <Download size={18} />
                    <span className="hidden sm:inline">Print</span>
                </button>
             </div>

            {/* Right side actions (Submit) - Only show if not already successful */}
            {submissionStatus !== 'success' && (
                <button 
                    onClick={handleSubmit}
                    /* IMPORTANT: Removed loadingAI from disabled condition so user can submit immediately */
                    disabled={submissionStatus === 'submitting'}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-700 rounded-lg font-bold text-white hover:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md w-full sm:w-auto"
                >
                    {submissionStatus === 'submitting' ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Submit Registration
                        </>
                    )}
                </button>
            )}
            
            {/* Close Button - Only show on success */}
            {submissionStatus === 'success' && (
                 <button 
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 rounded-lg font-bold text-white hover:bg-gray-800 transition-all shadow-md w-full sm:w-auto"
                >
                    Close
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
