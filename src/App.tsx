import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SmartFarmSetup from "./pages/SmartFarmSetup";
import SoilScanner from "./pages/SoilScanner";
import DiseaseScanner from "./pages/DiseaseScanner";
import SellCrops from "./pages/SellCrops";
import BuyCrops from "./pages/BuyCrops";
import SchemesDashboard from "./pages/SchemesDashboard";
import Auth from "./pages/Auth";
import WeatherDashboard from "./pages/WeatherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/weather" element={<WeatherDashboard />} />
              <Route path="/signup" element={<SmartFarmSetup />} />
              <Route path="/scan/soil" element={<SoilScanner />} />
              <Route path="/scan/disease" element={<DiseaseScanner />} />
              <Route path="/marketplace/sell" element={<SellCrops />} />
              <Route path="/marketplace/buy" element={<BuyCrops />} />
              <Route path="/schemes" element={<SchemesDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
