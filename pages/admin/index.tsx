"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import AdminLayout from "@/components/admin-layout"
import BlogCard from "@/components/blog-card"
import { getBlogPosts, deleteBlogPost, type BlogPost } from "@/lib/blog-service"
import toast from "react-hot-toast"
import { Plus, RefreshCw } from "lucide-react"

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const blogPosts = await getBlogPosts()
      setBlogs(blogPosts)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast.error("Error fetching blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return
    }

    try {
      await deleteBlogPost(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      toast.success("Blog post deleted successfully")
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast.error("Error deleting blog post")
    }
  }

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard - Blog CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchBlogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              href="/admin/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} />
              Create New Post
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-blue-600">{blogs.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-600">
              {blogs.filter((blog) => blog.status === "published").length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {blogs.filter((blog) => blog.status === "draft").length}
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Blog Posts</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No blog posts yet</p>
                <Link
                  href="/admin/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} showActions={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
