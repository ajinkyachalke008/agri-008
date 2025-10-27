import { AlertTriangle, Bug, Pill, Shield, Leaf, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DiseaseDetection } from "@/types/scanner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DiseaseResultsProps {
  detection: DiseaseDetection;
}

const DiseaseResults = ({ detection }: DiseaseResultsProps) => {
  const { t } = useLanguage();

  const getSeverityColor = (severity: string) => {
    const colors = {
      'Mild': 'text-green-500 bg-green-500/10',
      'Moderate': 'text-yellow-500 bg-yellow-500/10',
      'Severe': 'text-red-500 bg-red-500/10'
    };
    return colors[severity as keyof typeof colors] || colors['Moderate'];
  };

  if (!detection.detection.diseaseDetected) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Plant Looks Healthy!</h3>
        <p className="opacity-80">No disease detected in this image.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Detection Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <Bug className="w-6 h-6 text-red-500" />
          <h3 className="text-2xl font-bold">{t('scanners.disease.detected')}</h3>
        </div>
        <div className="text-3xl font-bold text-red-500 mb-2">
          {detection.detection.diseaseName}
        </div>
        <div className="text-sm opacity-70 italic mb-4">
          {detection.detection.scientificName}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-70">{t('scanners.disease.confidence')}:</span>
            <span className="font-bold text-lg">{detection.detection.confidence}%</span>
          </div>
          <div className={`px-4 py-2 rounded-full ${getSeverityColor(detection.detection.severity)}`}>
            {detection.detection.severity}
          </div>
        </div>
        <div className="mt-3 text-sm">
          <span className="opacity-70">Affected Parts: </span>
          <span className="font-medium">{detection.detection.affectedParts.join(', ')}</span>
        </div>
      </div>

      {/* Symptoms */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-semibold">{t('scanners.disease.symptoms')}</h3>
        </div>
        <ul className="space-y-2">
          {detection.symptoms.map((symptom, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Immediate Treatment */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-red-500" />
          <h3 className="text-xl font-semibold">{t('scanners.disease.treatment')}</h3>
        </div>
        <div className="space-y-3">
          {detection.treatment.immediate.map((step) => (
            <div
              key={step.step}
              className={`p-4 rounded-lg border-l-4 ${
                step.urgency === 'high'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-blue-500 bg-blue-500/10'
              }`}
            >
              <div className="font-semibold mb-1">
                Step {step.step}: {step.action}
              </div>
              {step.safety && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ {step.safety}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Organic Solutions */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-green-500" />
          <h3 className="text-xl font-semibold">{t('scanners.disease.organicSolutions')}</h3>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {detection.treatment.organicSolutions.map((solution, idx) => (
            <AccordionItem key={idx} value={`solution-${idx}`} className="glass-card">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="text-left">
                  <div className="font-semibold">{solution.name}</div>
                  <div className="text-sm opacity-70">{solution.type}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">📋 Preparation:</span>
                    <p className="mt-1">{solution.preparation}</p>
                  </div>
                  <div>
                    <span className="font-medium">🌿 Application:</span>
                    <p className="mt-1">{solution.application}</p>
                  </div>
                  <div>
                    <span className="font-medium">⏰ Frequency:</span>
                    <p className="mt-1">{solution.frequency}</p>
                  </div>
                  <div className="bg-green-500/10 p-2 rounded">
                    <span className="font-medium">✓ Safety:</span>
                    <p className="mt-1">{solution.safety}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Prevention Tips */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold">{t('scanners.disease.prevention')}</h3>
        </div>
        <ul className="space-y-2">
          {detection.prevention.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10">
              <span className="text-blue-500 mt-1">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recovery Time & Help */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          <div>
            <span className="text-sm opacity-70">Expected Recovery:</span>
            <p className="font-semibold text-lg">{detection.estimatedRecovery}</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/10">
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <div className="font-semibold mb-1">{t('scanners.disease.seekHelp')}</div>
                <p className="text-sm opacity-80">{detection.whenToSeekHelp}</p>
              </div>
            </div>
          </div>
          <Button className="w-full btn-primary">
            <Phone className="w-4 h-4 mr-2" />
            Contact Expert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseResults;
