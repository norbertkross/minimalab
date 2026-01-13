import { X } from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, featureName = "This feature" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Coming Soon</h2>
          <p className="text-gray-600">{featureName} will be available soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
