import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import SmartFarmSetup from "./pages/SmartFarmSetup";
import SoilScanner from "./pages/SoilScanner";
import DiseaseScanner from "./pages/DiseaseScanner";
import SellCrops from "./pages/SellCrops";
import BuyCrops from "./pages/BuyCrops";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SmartFarmSetup />} />
            <Route path="/scan/soil" element={<SoilScanner />} />
            <Route path="/scan/disease" element={<DiseaseScanner />} />
            <Route path="/marketplace/sell" element={<SellCrops />} />
            <Route path="/marketplace/buy" element={<BuyCrops />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
