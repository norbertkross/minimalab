import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppHeader from '../../components/header';
import Footer from '../../components/footer';
import BlogEngagementRow from '../../components/BlogEngagementRow';
import RecommendedBlogs from './RecommendedBlogs';
import NewsletterModal from '../../components/NewsletterModal';
import { BlogService } from '../../expose_db';
import { Blog } from './types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const BlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setBlog(undefined);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setBlog(undefined);
    setError(null);

    // Ensure the reader starts at the top when opening a blog post.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // Backwards compatibility: if an older link appended a suffix (e.g. "--------remove"),
    // strip it so we still fetch by the Firestore document id.
    const rawId = (id || "").trim();
    const normalizedId = rawId;

    BlogService.getBlogByIdentifier(normalizedId)
      .then((data) => {
        if (cancelled) return;
        setBlog(data);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error("Failed to fetch blog:", e);
        setError("We couldn't load this blog post right now. Please try again.");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="mt-6 text-lg text-gray-600">Loading blog post…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader />
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="mt-4 max-w-xl text-lg text-gray-600">{error}</p>
          <Link to="/blogs" className="mt-6 rounded-md bg-black px-4 py-2 font-semibold text-white">
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) {

    return (
      <>
        <AppHeader />
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Blog Post Not Found</h1>
          <p className="mt-4 text-lg text-gray-600">Sorry, we couldn't find the post you're looking for.</p>
          <Link to="/blogs" className="mt-6 rounded-md bg-black px-4 py-2 font-semibold text-white">
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </>
    );
  }


  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 pt-32 sm:px-6 lg:px-8">
        <article>
          <header className="mb-4 text-center">
            <p className="mb-2 text-gray-500">{blog.createdAt}</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              {blog.title || "Blog Post"}
            </h1>
            <h2 className="mb-2 text-gray-500">Author: {blog.author}</h2>
          </header>
          <BlogEngagementRow
            blogId={blog.id}
            initialViewCount={blog.view_count || 0}
            initialClapCount={blog.clap_count || 0}
          />
          {blog.image_url ? (
            <img src={blog.image_url} alt="Blog" className="mb-12 h-auto w-full rounded-lg object-cover shadow-lg" style={{maxHeight: '500px'}}/>
          ) : (
            <div className="mb-12 h-64 w-full rounded-lg bg-slate-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="prose prose-lg max-w-none prose-pre:bg-transparent prose-pre:text-black">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Newsletter Subscribe Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowNewsletterModal(true)}
            className="rounded-full bg-black px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Subscribe to Newsletter
          </button>
        </div>

        <RecommendedBlogs excludeBlogId={blog.id} />
      </main>
      <Footer />
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
    </>
  );
};

export default BlogPage;
