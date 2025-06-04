export interface BlogPost {
  id?: string
  title: string
  slug: string
  content: string
  metaTitle: string
  metaDescription: string
  coverImage: string
  status: "draft" | "published"
  createdAt: Date | string
  updatedAt: Date | string
} 