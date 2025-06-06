import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "react-hot-toast"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}
