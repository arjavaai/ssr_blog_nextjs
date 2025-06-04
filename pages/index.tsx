import type { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { getAllBlogPostsSSR } from "@/lib/blog-service-server"
import type { BlogPost } from "@/lib/blog-service"
import BlogCard from "@/components/blog-card"

interface HomeProps {
  blogs: BlogPost[]
}

export default function Home({ blogs }: HomeProps) {
  return (
    <>
      <Head>
        <title>My Blog - Latest Posts</title>
        <meta
          name="description"
          content="Welcome to my blog. Read the latest posts about technology, programming, and more."
        />
        <meta property="og:title" content="My Blog - Latest Posts" />
        <meta
          property="og:description"
          content="Welcome to my blog. Read the latest posts about technology, programming, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Blog</h1>
                <p className="text-gray-600 mt-1">Thoughts, stories and ideas</p>
              </div>
              <Link href="/admin" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Admin
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No blog posts yet</h2>
              <p className="text-gray-600 mb-6">Start by creating your first blog post in the admin panel.</p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Admin
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Latest Posts</h2>
                <p className="text-gray-600">Discover our latest articles and insights</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 My Blog. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const blogs = await getAllBlogPostsSSR()

    return {
      props: {
        blogs: blogs.map((blog) => ({
          ...blog,
          createdAt: blog.createdAt.toISOString(),
          updatedAt: blog.updatedAt.toISOString(),
        })),
      },
    }
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return {
      props: {
        blogs: [],
      },
    }
  }
}
