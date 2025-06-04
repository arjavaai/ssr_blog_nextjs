import type { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { getBlogPostBySlugSSR } from "@/lib/blog-service-server"
import type { BlogPost } from "@/lib/blog-service"
import { Calendar, ArrowLeft } from "lucide-react"

interface BlogPostPageProps {
  blog: (BlogPost & {
    createdAt: string;
    updatedAt: string;
  }) | null;
}

export default function BlogPostPage({ blog }: BlogPostPageProps) {
  if (!blog) {
    return (
      <>
        <Head>
          <title>Post Not Found</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-6">Blog post not found</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`

  return (
    <>
      <Head>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph tags */}
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={blog.metaDescription} />
        {blog.coverImage && <meta name="twitter:image" content={blog.coverImage} />}

        {/* Article specific tags */}
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </header>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="aspect-video mb-8 overflow-hidden rounded-lg">
              <img
                src={blog.coverImage || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{blog.title}</h1>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
              </div>

              {blog.updatedAt !== blog.createdAt && (
                <div className="text-sm">Updated: {formatDate(blog.updatedAt)}</div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <ArrowLeft size={16} />
                Back to All Posts
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string

  if (!slug) {
    return {
      notFound: true,
    }
  }

  try {
    const blog = await getBlogPostBySlugSSR(slug)

    if (!blog) {
      return {
        notFound: true,
      }
    }

    // Convert dates to ISO strings for serialization
    const serializedBlog = {
      ...blog,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
    }

    return {
      props: {
        blog: serializedBlog,
      },
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return {
      notFound: true,
    }
  }
}
