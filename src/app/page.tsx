import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Overview from "@/components/sections/Overview";
import Features from "@/components/sections/Features";
import Security from "@/components/sections/Security";
import CTA from "@/components/sections/CTA";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Overview />
        <Features />
        <Security />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
