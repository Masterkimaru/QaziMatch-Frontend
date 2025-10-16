// src/app/page.tsx
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[80vh] px-4 sm:px-6 py-12">
      <HeroSection />
    </div>
  );
}