"use client"

import Link from "next/link"
import type { BlogPost } from "@/lib/blog-service"
import { Calendar, Edit, Trash2, Eye } from "lucide-react"

interface BlogCardProps {
  blog: BlogPost & {
    createdAt: string;
    updatedAt: string;
  }
  onDelete?: (id: string) => void
  showActions?: boolean
}

export default function BlogCard({ blog, onDelete, showActions = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {blog.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Calendar size={14} />
          <span>{formatDate(blog.createdAt)}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              blog.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {blog.status}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{blog.metaDescription}</p>

        {showActions ? (
          <div className="flex gap-2">
            <Link
              href={`/admin/edit/${blog.id}`}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
            >
              <Edit size={14} />
              Edit
            </Link>

            <Link
              href={`/blog/${blog.slug}`}
              target="_blank"
              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
            >
              <Eye size={14} />
              View
            </Link>

            {onDelete && (
              <button
                onClick={() => onDelete(blog.id!)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        ) : (
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Read More
          </Link>
        )}
      </div>
    </div>
  )
}
