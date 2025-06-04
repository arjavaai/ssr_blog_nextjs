"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { slugify } from "@/lib/utils"
import { uploadImage } from "@/lib/blog-service"
import type { BlogPost } from "@/lib/types"

interface BlogFormProps {
  initialData?: Partial<BlogPost>
  onSubmit: (data: Partial<BlogPost>) => Promise<void>
  isSubmitting?: boolean
}

export default function BlogForm({ initialData, onSubmit, isSubmitting }: BlogFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "")
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "")
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status || "draft")
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
      setIsDirty(true)
    },
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      setSlug(slugify(title))
    }
  }, [title, slug])

  // Handle cover image URL
  const handleCoverImageUrl = async () => {
    if (!coverImageUrl) return

    try {
      // Validate URL
      const response = await fetch(coverImageUrl)
      if (!response.ok) throw new Error("Invalid image URL")

      // Upload to Firebase
      const blob = await response.blob()
      const file = new File([blob], "cover-image.jpg", { type: blob.type })
      const path = `blog-covers/${Date.now()}-${file.name}`
      const imageUrl = await uploadImage(file, path)
      
      setCoverImage(imageUrl)
      setCoverImagePreview(null)
      setCoverImageUrl("")
      setIsDirty(true)
    } catch (error) {
      console.error("Error handling cover image URL:", error)
      alert("Failed to process image URL. Please make sure it's a valid image URL.")
    }
  }

  // Handle cover image upload
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    setCoverImagePreview(previewUrl)

    try {
      const path = `blog-covers/${Date.now()}-${file.name}`
      const imageUrl = await uploadImage(file, path)
      setCoverImage(imageUrl)
      setIsDirty(true)
    } catch (error) {
      console.error("Error uploading cover image:", error)
      alert("Failed to upload cover image. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isDirty) return

    const formData: Partial<BlogPost> = {
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      coverImage,
      status,
    }

    await onSubmit(formData)
    setIsDirty(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Title and Slug */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setIsDirty(true)
                  }}
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setIsDirty(true)
                  }}
                  placeholder="Enter URL slug"
                  required
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-4">
              <Label>Cover Image</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="max-w-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="Or paste image URL here"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCoverImageUrl}
                    disabled={!coverImageUrl}
                  >
                    Use URL
                  </Button>
                </div>
                {(coverImagePreview || coverImage) && (
                  <div className="relative w-32 h-32">
                    <img
                      src={coverImagePreview || coverImage}
                      alt="Cover preview"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-4">
              <Label>Content</Label>
              <div className="border rounded-lg">
                <div className="border-b p-2 flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor?.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
                  >
                    H1
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor?.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor?.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-accent" : ""}
                  >
                    Bold
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-accent" : ""}
                  >
                    Italic
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={editor?.isActive("underline") ? "bg-accent" : ""}
                  >
                    Underline
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive("bulletList") ? "bg-accent" : ""}
                  >
                    Bullet List
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={editor?.isActive("orderedList") ? "bg-accent" : ""}
                  >
                    Numbered List
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={editor?.isActive("blockquote") ? "bg-accent" : ""}
                  >
                    Quote
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                    className={editor?.isActive("codeBlock") ? "bg-accent" : ""}
                  >
                    Code
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = window.prompt("Enter URL")
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run()
                      }
                    }}
                    className={editor?.isActive("link") ? "bg-accent" : ""}
                  >
                    Link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = window.prompt("Enter image URL")
                      if (url) {
                        editor?.chain().focus().setImage({ src: url }).run()
                      }
                    }}
                  >
                    Image
                  </Button>
                </div>
                <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
              </div>
            </div>

            {/* SEO Fields */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => {
                    setMetaTitle(e.target.value)
                    setIsDirty(true)
                  }}
                  placeholder="Enter meta title for SEO"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => {
                    setMetaDescription(e.target.value)
                    setIsDirty(true)
                  }}
                  placeholder="Enter meta description for SEO"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "draft" | "published") => {
                  setStatus(value)
                  setIsDirty(true)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving..." : "Save Post"}
        </Button>
      </div>
    </form>
  )
}
