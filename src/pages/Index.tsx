import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";
import FloatingHearts from "@/components/FloatingHearts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingHearts />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TimelineSection />
      <Footer />
    </div>
  );
};

export default Index;
