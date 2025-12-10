import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, Sprout, Loader2 } from 'lucide-react';

interface CropRecommendationsProps {
  recommendations: {
    goodFor?: string[];
    avoid?: string[];
    cropAdvice?: string[];
    warnings?: string[];
    fullAdvice?: string;
  } | null;
  crops: string[] | null;
}

export const CropRecommendations = ({ recommendations, crops }: CropRecommendationsProps) => {
  if (!crops || crops.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5" />
            Farming Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sprout className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Add crops to your profile to get personalized AI recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5" />
            Farming Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating AI recommendations for your crops...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="w-5 h-5" />
          AI Farming Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Your Crops */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Sprout className="w-5 h-5" />
              Your Crops
            </h3>
            <div className="flex flex-wrap gap-2">
              {crops.map((crop) => (
                <span key={crop} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Good For Activities */}
          {recommendations.goodFor && recommendations.goodFor.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                Good Time For
              </h3>
              <ul className="space-y-2">
                {recommendations.goodFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avoid Activities */}
          {recommendations.avoid && recommendations.avoid.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-700">
                <XCircle className="w-5 h-5" />
                Avoid Today
              </h3>
              <ul className="space-y-2">
                {recommendations.avoid.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Crop-Specific Advice */}
          {recommendations.cropAdvice && recommendations.cropAdvice.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-700">
                <Sprout className="w-5 h-5" />
                Crop-Specific Advice
              </h3>
              <ul className="space-y-2">
                {recommendations.cropAdvice.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Sprout className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {recommendations.warnings && recommendations.warnings.length > 0 && (
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Weather Warnings
              </h3>
              <ul className="space-y-2">
                {recommendations.warnings.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full AI Advice (collapsible) */}
          {recommendations.fullAdvice && (
            <details className="group">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                View full AI analysis...
              </summary>
              <div className="mt-3 p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                {recommendations.fullAdvice}
              </div>
            </details>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
