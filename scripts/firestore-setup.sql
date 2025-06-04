-- This is a reference for the Firestore collection structure
-- Firestore is NoSQL, so this is just for documentation

-- Collection: blogs
-- Document structure:
{
  "title": "string",
  "slug": "string (unique)",
  "metaTitle": "string",
  "metaDescription": "string", 
  "content": "string (HTML from Tiptap)",
  "coverImage": "string (Firebase Storage URL)",
  "status": "string (draft | published)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}

-- Firestore Security Rules (add to Firebase Console):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to published blogs for everyone
    match /blogs/{blogId} {
      allow read: if resource.data.status == 'published';
      // Allow full access for authenticated users (admin)
      allow read, write: if request.auth != null;
    }
  }
}

-- Firebase Storage Security Rules (add to Firebase Console):
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow read access to all files
      allow read;
      // Allow write access only for authenticated users
      allow write: if request.auth != null;
    }
  }
}
