# Next.js Firebase Blog Platform

A complete blogging platform built with Next.js, Firebase, and Tiptap editor featuring Server-Side Rendering (SSR) for optimal SEO performance.

## Features

### 🚀 Core Features
- **Server-Side Rendering (SSR)** for blog pages using `getServerSideProps`
- **Firebase Integration** (Firestore, Auth, Storage)
- **Rich Text Editor** with Tiptap (Notion-like experience)
- **SEO Optimized** with dynamic meta tags and Open Graph support
- **Admin Panel** with authentication protection
- **Image Upload** to Firebase Storage
- **Responsive Design** with Tailwind CSS

### 📝 Blog Features
- Dynamic routing with `/blog/[slug]`
- Auto-generated slugs from titles
- Draft and published status
- Cover image support
- Real-time content updates
- 404 handling for invalid slugs

### 🔐 Admin Features
- Email/Password authentication
- Protected admin routes
- CRUD operations for blog posts
- Rich text editing with Tiptap
- Image upload and management
- Preview functionality

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Editor**: Tiptap with extensions
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd nextjs-firebase-blog
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
Copy `.env.local.example` to `.env.local` and fill in your Firebase configuration:

\`\`\`env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
\`\`\`

4. **Set up Firebase**
- Create a Firebase project
- Enable Firestore Database
- Enable Authentication (Email/Password)
- Enable Storage
- Add security rules (see `scripts/firestore-setup.sql`)

5. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Firebase Setup

1. **Firestore Security Rules**
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{blogId} {
      allow read: if resource.data.status == 'published';
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

2. **Storage Security Rules**
\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

3. **Create Admin User**
Go to Firebase Console > Authentication > Users and manually add an admin user with email/password.

## Project Structure

\`\`\`
├── components/
│   ├── admin-layout.tsx      # Admin panel layout
│   ├── blog-card.tsx         # Blog post card component
│   ├── blog-form.tsx         # Blog creation/editing form
│   └── tiptap-editor.tsx     # Rich text editor
├── lib/
│   ├── auth-context.tsx      # Authentication context
│   ├── blog-service.ts       # Blog CRUD operations
│   ├── firebase-admin.ts     # Server-side Firebase config
│   └── firebase-client.ts    # Client-side Firebase config
├── pages/
│   ├── admin/
│   │   ├── edit/[id].tsx     # Edit blog post
│   │   ├── index.tsx         # Admin dashboard
│   │   ├── login.tsx         # Admin login
│   │   └── new.tsx           # Create new post
│   ├── blog/
│   │   └── [slug].tsx        # Individual blog post (SSR)
│   ├── _app.tsx              # App wrapper
│   └── index.tsx             # Homepage (SSR)
├── scripts/
│   └── firestore-setup.sql   # Database setup reference
└── styles/
    └── globals.css           # Global styles
\`\`\`

## Key Features Explained

### Server-Side Rendering (SSR)
Blog pages use `getServerSideProps` to fetch data server-side, ensuring:
- Full SEO compatibility
- Real-time content updates
- Fast initial page loads

### SEO Optimization
Each blog post includes:
- Dynamic `<title>` and meta description
- Open Graph tags for social sharing
- Canonical URLs
- Structured data for search engines

### Admin Authentication
- Firebase Auth protects all `/admin/*` routes
- Automatic redirect to login if not authenticated
- Secure logout functionality

### Rich Text Editor
Tiptap editor provides:
- Notion-like editing experience
- Image upload integration
- Link management
- Formatting toolbar
- HTML output for storage

## Deployment

### Deploy to Vercel

1. **Connect to Vercel**
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

2. **Set Environment Variables**
Add all environment variables in Vercel dashboard.

3. **Deploy**
\`\`\`bash
vercel --prod
\`\`\`

### Environment Variables for Production
Make sure to set all environment variables in your deployment platform:
- All `NEXT_PUBLIC_*` variables
- Firebase Admin SDK credentials
- Site URL

## Usage

### Creating Blog Posts
1. Go to `/admin/login` and sign in
2. Click "Create New Post" in the dashboard
3. Fill in title, meta information, and content
4. Upload a cover image (optional)
5. Save as draft or publish immediately

### Managing Content
- View all posts in the admin dashboard
- Edit existing posts
- Delete posts with confirmation
- Preview posts before publishing
- Toggle between draft and published status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
#   s s r _ b l o g _ n e x t j s  
 