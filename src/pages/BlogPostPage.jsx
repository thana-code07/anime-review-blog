import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Heart, Link2 } from "lucide-react";
import { toast } from "sonner";

import { FooterSection } from "@/components/FooterSection";
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { isLoggedIn } from "@/lib/auth";
import { fetchPost } from "@/lib/blogApi";
import { formatLikes, formatPostDate } from "@/lib/formatDate";

const AUTHOR_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

const AUTHOR_BIO =
  "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.";

const MOCK_COMMENTS = [
  {
    id: 1,
    name: "Jacob Lash",
    avatar:
      "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
    date: "11 September 2024",
    text: "I loved this article! It really captures the essence of why cats are such amazing companions.",
  },
  {
    id: 2,
    name: "Arvi",
    avatar:
      "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
    date: "11 September 2024",
    text: "Such a great read! I've always been a dog person, but this makes me want to adopt a cat now.",
  },
  {
    id: 3,
    name: "Mimi mama",
    avatar:
      "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
    date: "11 September 2024",
    text: "This article perfectly describes why cats are so lovable. Great job!",
  },
];

function SocialShareButton({ label, className, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex size-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}

function CommentItem({ name, avatar, date, text }) {
  return (
    <div className="flex gap-4 border-t border-brown-300 pt-6">
      <img
        src={avatar}
        alt={name}
        className="size-10 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-brown-900">{name}</span>
          <span className="text-sm text-brown-600">{date}</span>
        </div>
        <p className="mt-2 text-brown-800">{text}</p>
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  function requireAuth(action) {
    if (!isLoggedIn) {
      setIsLoginDialogOpen(true);
      return;
    }
    action();
  }

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      setIsLoading(true);
      setError(null);
      setPost(null);

      try {
        const data = await fetchPost(postId);
        if (cancelled) return;
        setPost(data);
      } catch {
        if (cancelled) return;
        setError("Failed to load this article.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied!", {
        description: "This article has been copied to your clipboard.",
      });
    } catch {
      toast.error("Failed to copy link", {
        description: "Please try again or copy the URL manually.",
      });
    }
  }

  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-10 lg:px-[120px] lg:py-12">
        {isLoading && (
          <div className="flex justify-center py-24">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <p className="py-24 text-center text-red-600">{error}</p>
        )}

        {!isLoading && !error && post && (
          <>
            <img
              src={post.image}
              alt={post.title}
              className="aspect-video w-full rounded-2xl object-cover"
            />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
              <article>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
                    {post.category}
                  </span>
                  <span className="text-sm text-brown-600">
                    {formatPostDate(post.date)}
                  </span>
                </div>

                <h1 className="mt-4 font-poppins text-3xl font-bold text-brown-900 sm:text-4xl">
                  {post.title}
                </h1>

                <div className="markdown mt-6 text-brown-800">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brown-200 px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    onClick={() =>
                      requireAuth(() => {
                        // Future: toggle like / increment count
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brown-300 bg-white px-4 py-2 text-sm text-brown-900 transition-colors hover:bg-brown-100"
                  >
                    <Heart className="size-4" />
                    <span>{formatLikes(post.likes)}</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brown-300 bg-white px-4 py-2 text-sm text-brown-900 transition-colors hover:bg-brown-100"
                    >
                      <Link2 className="size-4" />
                      <span>Copy link</span>
                    </button>

                    <SocialShareButton label="Share on Facebook" className="bg-[#1877F2]">
                      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </SocialShareButton>
                    <SocialShareButton label="Share on LinkedIn" className="bg-[#0A66C2]">
                      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </SocialShareButton>
                    <SocialShareButton label="Share on Twitter" className="bg-[#1DA1F2]">
                      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </SocialShareButton>
                  </div>
                </div>

                <section className="mt-12" aria-label="Comments">
                  <textarea
                    placeholder="What are your thoughts?"
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full resize-none rounded-xl border border-brown-300 bg-white px-4 py-3 text-brown-900 placeholder:text-brown-400 focus:border-brown-400 focus:outline-none"
                  />
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="primary"
                      className="rounded-full px-8"
                      onClick={() =>
                        requireAuth(() => {
                          // Future: add comment and clear textarea
                        })
                      }
                    >
                      Send
                    </Button>
                  </div>

                  <div className="mt-8 space-y-6">
                    {MOCK_COMMENTS.map((comment) => (
                      <CommentItem key={comment.id} {...comment} />
                    ))}
                  </div>
                </section>
              </article>

              <aside className="lg:sticky lg:top-24 lg:self-start lg:pt-2">
                <div className="rounded-2xl bg-brown-200 p-6">
                  <img
                    src={AUTHOR_AVATAR}
                    alt={post.author}
                    className="size-16 rounded-full object-cover"
                  />
                  <p className="mt-4 text-sm text-brown-600">Author</p>
                  <p className="mt-1 font-semibold text-brown-900">{post.author}</p>
                  <p className="mt-3 text-sm leading-relaxed text-brown-800">
                    {AUTHOR_BIO}
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <FooterSection />

      <LoginRequiredDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </div>
  );
}
