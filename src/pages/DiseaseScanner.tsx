import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScannerHeader from "@/components/scanners/ScannerHeader";
import ImageUpload from "@/components/scanners/ImageUpload";
import DiseaseResults from "@/components/scanners/DiseaseResults";
import { detectDisease } from "@/lib/scannerApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DiseaseDetection } from "@/types/scanner";

const DiseaseScanner = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detection, setDetection] = useState<DiseaseDetection | null>(null);

  const handleImageSelect = async (imageData: string) => {
    setIsAnalyzing(true);
    setDetection(null);

    try {
      const result = await detectDisease(imageData);
      
      if (result.success && result.detection) {
        setDetection(result.detection);
        if (result.detection.detection.diseaseDetected) {
          toast({
            title: "Disease Detected",
            description: `${result.detection.detection.diseaseName} (${result.detection.detection.confidence}% confidence)`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "No Disease Detected",
            description: "Plant appears healthy!"
          });
        }
      } else {
        throw new Error(result.error || 'Detection failed');
      }
    } catch (error) {
      console.error('Disease detection error:', error);
      toast({
        title: "Detection Failed",
        description: "Unable to analyze plant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
    setDetection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <ScannerHeader title={t('scanners.disease.pageTitle')} />

        {!detection && !isAnalyzing && (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}

        {isAnalyzing && (
          <div className="glass-card p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">{t('scanners.disease.analyzing')}</p>
            <p className="text-sm opacity-70">Analyzing plant health...</p>
          </div>
        )}

        {detection && (
          <>
            <DiseaseResults detection={detection} />
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

export default DiseaseScanner;
