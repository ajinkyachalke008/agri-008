import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScannerHeader from "@/components/scanners/ScannerHeader";
import ImageUpload from "@/components/scanners/ImageUpload";
import SoilResults from "@/components/scanners/SoilResults";
import { analyzeSoil } from "@/lib/scannerApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SoilAnalysis } from "@/types/scanner";

const SoilScanner = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SoilAnalysis | null>(null);

  const handleImageSelect = async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await analyzeSoil(imageData);
      
      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
        toast({
          title: "Analysis Complete",
          description: `Soil health score: ${result.analysis.analysis.healthScore}/100`
        });
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Soil analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze soil. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <ScannerHeader title={t('scanners.soil.pageTitle')} />

        {!analysis && !isAnalyzing && (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}

        {isAnalyzing && (
          <div className="glass-card p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">{t('scanners.soil.analyzing')}</p>
            <p className="text-sm opacity-70">This may take a few seconds...</p>
          </div>
        )}

        {analysis && (
          <>
            <SoilResults analysis={analysis} />
            <div className="mt-6 text-center">
              <Button onClick={handleNewScan} className="btn-secondary">
                {t('scanners.upload.uploadAnother')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SoilScanner;
