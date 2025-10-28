import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import ScannerHub from "@/components/ScannerHub";
import { MarketplaceHub } from "@/components/marketplace/MarketplaceHub";
import Features from "@/components/Features";
import Impact from "@/components/Impact";
import InteractiveLearning from "@/components/InteractiveLearning";
import ContactCTA from "@/components/ContactCTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <ScannerHub />
      <MarketplaceHub />
      <Problem />
      <Solution />
      <Features />
      <Impact />
      <InteractiveLearning />
      <ContactCTA />
    </main>
  );
};

export default Index;
