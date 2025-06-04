import { adminDb } from "./firebase-admin"
import type { BlogPost } from "./types"

// Server-side functions for SSR
export const getBlogPostBySlugSSR = async (slug: string): Promise<BlogPost | null> => {
  try {
    const blogsRef = adminDb.collection("blogs")
    const q = blogsRef.where("slug", "==", slug).where("status", "==", "published")
    const querySnapshot = await q.get()

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as BlogPost
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return null
  }
}

export const getAllBlogPostsSSR = async (): Promise<BlogPost[]> => {
  try {
    const blogsRef = adminDb.collection("blogs")
    const q = blogsRef.where("status", "==", "published").orderBy("createdAt", "desc")
    const querySnapshot = await q.get()

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as BlogPost
    })
  } catch (error) {
    console.error("Error fetching all blog posts:", error)
    return []
  }
}

export const getBlogPostByIdSSR = async (id: string): Promise<BlogPost | null> => {
  try {
    const doc = await adminDb.collection("blogs").doc(id).get()

    if (!doc.exists) {
      return null
    }

    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt.toDate(),
      updatedAt: data?.updatedAt.toDate(),
    } as BlogPost
  } catch (error) {
    console.error("Error fetching blog post by ID:", error)
    return null
  }
}

export const updateBlogPost = async (id: string, data: Partial<BlogPost>): Promise<void> => {
  try {
    const blogRef = adminDb.collection("blogs").doc(id)
    await blogRef.update({
      ...data,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating blog post:", error)
    throw error
  }
}
