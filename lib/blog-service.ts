import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./firebase-client"
import type { BlogPost } from "./types"

export interface BlogPost {
  id?: string
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  content: string
  coverImage: string
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
}

// Client-side functions only
export const createBlogPost = async (data: BlogPost): Promise<void> => {
  try {
    await addDoc(collection(db, "blogs"), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    throw error
  }
}

export const updateBlogPost = async (id: string, data: Partial<BlogPost>): Promise<void> => {
  try {
    const blogRef = doc(db, "blogs", id)
    await updateDoc(blogRef, {
      ...data,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating blog post:", error)
    throw error
  }
}

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "blogs", id))
  } catch (error) {
    console.error("Error deleting blog post:", error)
    throw error
  }
}

export const getBlogPosts = async () => {
  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as BlogPost[]
}

export const getBlogPost = async (id: string) => {
  const docRef = doc(db, "blogs", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as BlogPost
  }
  return null
}

export const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file)
  return await getDownloadURL(snapshot.ref)
}
