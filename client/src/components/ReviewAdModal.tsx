import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ReviewAdModalProps {
  ad: any;
  onClose: () => void;
  onReviewed: () => void;
}

export const ReviewAdModal: React.FC<ReviewAdModalProps> = ({ ad, onClose, onReviewed }) => {
  const { apiClient } = useAuth();
  const [internalNotes, setInternalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReview = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !isRejecting) {
      setIsRejecting(true);
      return;
    }

    if (action === 'reject' && !rejectionReason) {
      setError('Rejection reason is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiClient.patch(`/moderator/ads/${ad.id}/review`, {
        ad_id: ad.id,
        action,
        rejection_reason: action === 'reject' ? rejectionReason : undefined,
        internal_notes: internalNotes || undefined,
      });
      onReviewed();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Review failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Review Ad: {ad.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-6 space-y-6">
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="mt-1 text-gray-600 whitespace-pre-wrap">{ad.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Category</h3>
              <p className="mt-1 text-gray-600">{ad.categories?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">City</h3>
              <p className="mt-1 text-gray-600">{ad.cities?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Seller</h3>
              <p className="mt-1 text-gray-600">{ad.users?.name} ({ad.users?.email})</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Package</h3>
              <p className="mt-1 text-gray-600">{ad.packages?.name || 'N/A'}</p>
            </div>
          </div>

          {ad.media && ad.media.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Media</h3>
              <div className="grid grid-cols-2 gap-2">
                {ad.media.map((m: any, idx: number) => (
                  <div key={idx} className="border p-2 rounded">
                    <p className="text-xs text-gray-500 truncate mb-1">{m.original_url}</p>
                    <a href={m.original_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">View Media</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Optional)</label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Notes for other moderators..."
              />
            </div>

            {isRejecting && (
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">Rejection Reason (Required)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 rounded focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Explain why this ad is being rejected..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          {isRejecting ? (
            <>
              <button 
                onClick={() => setIsRejecting(false)} 
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleReview('reject')} 
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleReview('reject')} 
                disabled={isLoading}
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
              >
                Reject Ad
              </button>
              <button 
                onClick={() => handleReview('approve')} 
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Approve Ad
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
