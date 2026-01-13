import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { NewsletterService } from "../expose_db";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await NewsletterService.subscribe({
        email,
        name: name || undefined,
        tags: ["blog"],
      });

      setIsSuccess(true);
      setEmail("");
      setName("");

      // Auto close after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {isSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 border border-black">
              <svg
                className="h-6 w-6 block text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Success!</h2>
            <p className="text-gray-600">You've been subscribed to our newsletter.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Subscribe to our Newsletter!</h2>
              <p className="text-sm text-gray-600">
                Be the first to know about new collections, sales and more. Members also get access to exclusive offers and initiatives!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  E-Mail Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="your.email@example.com"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-black px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Subscribing..." : "Sign me up!"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                No thanks, I don't want exclusive offers.
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;
