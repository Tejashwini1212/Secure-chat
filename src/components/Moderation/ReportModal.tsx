import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const reportReasons = [
    'Inappropriate content',
    'Harassment or bullying',
    'Spam',
    'Misleading information',
    'Other'
  ];
  
  const handleSubmit = () => {
    if (!reason) return;
    
    setIsSubmitting(true);
    onSubmit(reason);
    
    // Reset state and close modal
    setTimeout(() => {
      setIsSubmitting(false);
      setReason('');
      onClose();
    }, 500);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Content">
      <div className="space-y-4">
        <div className="flex items-start">
          <AlertTriangle size={20} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            Content that violates our guidelines will be reviewed. Thank you for helping keep this platform safe.
          </p>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Reason for reporting</label>
          <div className="grid grid-cols-1 gap-2">
            {reportReasons.map((reportReason) => (
              <button
                key={reportReason}
                className={`text-left px-3 py-2 text-sm rounded-md ${
                  reason === reportReason 
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setReason(reportReason)}
              >
                {reportReason}
              </button>
            ))}
          </div>
        </div>
        
        {reason === 'Other' && (
          <div>
            <label htmlFor="customReason" className="block text-sm font-medium text-gray-300 mb-1">
              Please specify
            </label>
            <textarea
              id="customReason"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Describe the issue..."
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleSubmit} 
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;