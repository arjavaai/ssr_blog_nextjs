import { useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { createBlogPost } from "@/lib/blog-service"
import BlogForm from "@/components/blog-form"
import type { BlogPost } from "@/lib/blog-service"
import slugify from "slugify"

export default function NewBlogPost() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Partial<BlogPost>) => {
    try {
      setIsSubmitting(true)
      
      // Generate slug from title if not provided
      if (!data.slug && data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true })
      }

      await createBlogPost(data as BlogPost)
      router.push("/admin")
    } catch (error) {
      console.error("Error creating blog post:", error)
      alert("Failed to create blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create New Blog Post</title>
      </Head>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Blog Post</h1>
          <p className="text-gray-600">Fill in the details below to create your blog post.</p>
        </div>

        <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </>
  )
}
