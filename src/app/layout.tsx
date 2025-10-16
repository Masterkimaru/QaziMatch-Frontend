import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "QaziMatch",
  description: "Find and post jobs easily",
  metadataBase: new URL("https://qazimatch.com"),
  icons: {
    icon: "/Qazi-logo.png", // Favicon (used in browser tab)
    shortcut: "/Qazi-logo.png",
    apple: "/Qazi-logo.png", // Apple touch icon
  },
  // Optional: Open Graph image for social sharing
  openGraph: {
    images: ["/Qazi-logo.png"],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto p-4">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
