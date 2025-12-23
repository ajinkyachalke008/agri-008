import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  district?: string;
  taluka?: string;
}

export const LocationMap = ({ latitude, longitude, district, taluka }: LocationMapProps) => {
  const hasValidLocation = 
    latitude !== null && 
    latitude !== undefined && 
    longitude !== null && 
    longitude !== undefined &&
    typeof latitude === 'number' && 
    typeof longitude === 'number';

  const openInMaps = () => {
    if (hasValidLocation) {
      window.open(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=12`, '_blank');
    }
  };

  // Generate static map image URL from OpenStreetMap
  const getStaticMapUrl = () => {
    if (!hasValidLocation) return '';
    // Using OpenStreetMap static map service
    const zoom = 10;
    const width = 400;
    const height = 200;
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=${latitude},${longitude},red-pushpin`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Your Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasValidLocation ? (
          <div className="space-y-3">
            <div className="h-[180px] rounded-lg overflow-hidden bg-muted relative">
              <img 
                src={getStaticMapUrl()} 
                alt={`Map showing ${district || 'your location'}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if static map fails
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {latitude?.toFixed(4)}°N, {longitude?.toFixed(4)}°E
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">{district}</p>
                {taluka && <p className="text-muted-foreground">{taluka}</p>}
              </div>
              <Button variant="outline" size="sm" onClick={openInMaps}>
                <ExternalLink className="w-4 h-4 mr-1" />
                Open Map
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Location not available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};