import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "./types";
import { BlogService } from "../../expose_db";
import { ThumbsUp, MessageCircle, Bookmark } from "lucide-react";

interface RecommendedBlogsProps {
  excludeBlogId?: string;
}

const RecommendedBlogs = ({ excludeBlogId }: RecommendedBlogsProps) => {
  const [recommendedBlogs, setRecommendedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    BlogService.getBlogs()
      .then((blogs) => {
        // Filter out the current blog if excludeBlogId is provided
        const filtered = excludeBlogId
          ? blogs.filter(blog => blog.id !== excludeBlogId)
          : blogs;

        // Get 3 most recent blogs (or you could filter by views/claps for most popular)
        // Sort by date if available, otherwise just take first 3
        const sorted = [...filtered].sort((a, b) => {
          // Simple date comparison - most recent first
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
        setRecommendedBlogs(sorted.slice(0, 3));
      })
      .catch((error) => {
        console.error("Failed to fetch recommended blogs:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="mt-16 w-full">
        <h2 className="mb-6 text-2xl font-bold">Recommended from Minimalab</h2>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 rounded-lg bg-slate-200"></div>
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-200"></div>
              <div className="mt-2 h-4 w-1/2 rounded bg-slate-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendedBlogs.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 w-full">
      <h2 className="mb-6 text-2xl font-bold">Recommended from Minimalab</h2>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendedBlogs.map((blog) => {
          const previewText = String(blog.short_description ?? blog.content ?? "");
          const snippet = previewText.slice(0, 120) + (previewText.length > 120 ? "..." : "");

          return (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-200 hover:border-black hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                {blog.image_url ? (
                  <img
                    src={blog.image_url}
                    alt={blog.title || "Blog post"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                {/* Author/Publisher */}
                {blog.author && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      {blog.author}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-black">
                  {blog.title || "Blog Post"}
                </h3>

                {/* Description */}
                {snippet && (
                  <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
                    {snippet}
                  </p>
                )}

                {/* Metadata/Engagement */}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    {blog.createdAt && (
                      <span>{blog.createdAt}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {blog.clap_count !== undefined && blog.clap_count > 0 && (
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{blog.clap_count}</span>
                      </div>
                    )}
                    {blog.view_count !== undefined && blog.view_count > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{blog.view_count}</span>
                      </div>
                    )}
                    <Bookmark className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedBlogs;
