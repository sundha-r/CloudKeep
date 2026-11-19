import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';

const LinkShareModal = ({
  isOpen,
  onClose,
  link = '',
  title = 'Share File'
}) => {
  const [copied, setCopied] = useState(false);

  // Reset copied state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  // Copy link to clipboard
  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Share this link with others to give them access to this file:
        </p>

        {/* Link Input & Copy Status/Button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={link}
            onClick={(e) => e.target.select()}
            className="flex-1 px-3.5 py-2 text-sm text-gray-800 bg-white border-2 border-purple-500 rounded-lg outline-none select-all focus:border-purple-600 focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
              copied
                ? 'bg-green-100 border-green-200 text-green-600'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500'
            }`}
            title={copied ? 'Copied' : 'Copy link'}
          >
            {copied ? (
              <Check size={18} className="text-green-600" />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>

        {/* Status Message & Info */}
        <div className="space-y-1.5 pt-0.5">
          {copied && (
            <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <Check size={16} className="text-green-600" />
              <span>Link copied to clipboard!</span>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Anyone with this link can access this file.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 -mx-6 -mb-6 px-6 py-4 mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-white ${
              copied
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LinkShareModal;
