import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Calendar, Sprout } from 'lucide-react';

interface CropRecommendationsProps {
  recommendations: any;
  crops: string[] | null;
}

export const CropRecommendations = ({ recommendations, crops }: CropRecommendationsProps) => {
  if (!recommendations && !crops) {
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
            <p>Add crops to your profile to get personalized recommendations</p>
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
          Farming Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* General Recommendations */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              Good Time For
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Irrigation of crops (weather conditions favorable)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Fertilizer application (no rain expected for 48 hours)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-700">
              <XCircle className="w-5 h-5" />
              Avoid Today
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <XCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <span>Pesticide spraying (rain expected tomorrow - will wash off)</span>
              </li>
            </ul>
          </div>

          {crops && crops.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your Crops
              </h3>
              <div className="flex flex-wrap gap-2">
                {crops.map((crop) => (
                  <span key={crop} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {crop}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                AI-powered crop-specific recommendations will appear here once weather data is loaded
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
