import { useState, useEffect } from "react";
import { Bookmark, Eye, Share2 } from "lucide-react";
import { increment } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import ComingSoonModal from "./ComingSoonModal";
import Clap from "../assets/images/clap.svg";

interface BlogEngagementRowProps {
  blogId: string;
  initialViewCount?: number;
  initialClapCount?: number;
}

const BlogEngagementRow: React.FC<BlogEngagementRowProps> = ({
  blogId,
  initialViewCount = 0,
  initialClapCount = 0,
}) => {
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [clapCount, ] = useState(initialClapCount);
  const [showClapModal, setShowClapModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  // Track unique view on component mount
  useEffect(() => {
    if (!blogId) return;

    const storageKey = `blog_view_${blogId}`;
    const hasViewed = localStorage.getItem(storageKey);

    if (!hasViewed) {
      // Mark as viewed in local storage
      localStorage.setItem(storageKey, "true");

      // Increment view count in Firebase
      const incrementViewCount = async () => {
        try {
          const blogRef = doc(db, "blogs", blogId);
          await updateDoc(blogRef, {
            view_count: increment(1),
          });
          setViewCount((prev) => prev + 1);
        } catch (error) {
          console.error("Failed to increment view count:", error);
        }
      };

      incrementViewCount();
    }
  }, [blogId]);

  const handleClapClick = () => {
    setShowClapModal(true);
  };

  const handleBookmarkClick = () => {
    setShowBookmarkModal(true);
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  return (
    <>
      <div className="my-4 flex items-center justify-center gap-6 py-4">
        {/* Clap */}
        <button
          onClick={handleClapClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <img src={Clap} alt="Clap" className="w-6 h-6" />
          <span className="text-sm">{clapCount > 0 ? formatCount(clapCount) : "0"}</span>
        </button>


        {/* View Count */}
        <div className="flex items-center gap-2 text-gray-600">
          <Eye size={20} />
          <span className="text-sm">{formatCount(viewCount)}</span>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmarkClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Bookmark size={20} />
        </button>


        {/* Share */}
        <button
          onClick={handleShareClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Share2 size={20} />
        </button>
      </div>

      <ComingSoonModal
        isOpen={showClapModal}
        onClose={() => setShowClapModal(false)}
        featureName="Clap feature"
      />
      <ComingSoonModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        featureName="Bookmark feature"
      />
    </>
  );
};

// Helper function to format large numbers (e.g., 2900 -> "2.9K")
function formatCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

export default BlogEngagementRow;
