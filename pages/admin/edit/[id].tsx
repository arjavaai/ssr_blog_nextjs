"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import type { GetServerSideProps } from "next"
import { getBlogPostByIdSSR } from "@/lib/blog-service-server"
import { updateBlogPost } from "@/lib/blog-service"
import BlogForm from "@/components/blog-form"
import type { BlogPost } from "@/lib/types"

interface EditBlogPostProps {
  blog: BlogPost & { id: string }
}

export default function EditBlogPost({ blog }: EditBlogPostProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Partial<BlogPost>) => {
    try {
      setIsSubmitting(true)
      await updateBlogPost(blog.id, data)
      router.push("/admin")
    } catch (error) {
      console.error("Error updating blog post:", error)
      alert("Failed to update blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Edit Blog Post</title>
      </Head>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Blog Post</h1>
          <p className="text-gray-600">Update your blog post details below.</p>
        </div>

        <BlogForm initialData={blog} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string

  if (!id) {
    return {
      notFound: true,
    }
  }

  try {
    const blog = await getBlogPostByIdSSR(id)

    if (!blog) {
      return {
        notFound: true,
      }
    }

    // Convert Firestore Timestamps to ISO strings for serialization
    return {
      props: {
        blog: {
          ...blog,
          id: blog.id,
          createdAt: blog.createdAt.toISOString(),
          updatedAt: blog.updatedAt.toISOString(),
        },
      },
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return {
      notFound: true,
    }
  }
}
