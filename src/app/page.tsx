import ThreeBackground from "@/components/ui/ThreeBackground";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import StatsDashboard from "@/components/sections/StatsDashboard";
import MarqueeBreak from "@/components/sections/MarqueeBreak"; // <--- Import this
import ProjectList from "@/components/sections/ProjectList";
import ContactFooter from "@/components/sections/ContactFooter";
import Experience from "@/components/sections/Experience";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <ThreeBackground />

      <Hero />
      <StatsDashboard />

      <MarqueeBreak />

      <ProjectList />

      <Experience />

      <ContactFooter />
      <div className="h-[50vh]"></div>
    </main>
  );
}