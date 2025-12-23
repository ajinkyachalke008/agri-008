import { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const LeafletMapContent = lazy(() => import('./LeafletMapContent'));

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  district?: string;
  taluka?: string;
}

const MapLoader = () => (
  <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground text-sm">Loading map...</div>
  </div>
);

export const LocationMap = ({ latitude, longitude, district, taluka }: LocationMapProps) => {
  const hasValidLocation = 
    latitude !== null && 
    latitude !== undefined && 
    longitude !== null && 
    longitude !== undefined &&
    typeof latitude === 'number' && 
    typeof longitude === 'number';

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
          <div className="h-[200px] rounded-lg overflow-hidden">
            <Suspense fallback={<MapLoader />}>
              <LeafletMapContent 
                latitude={latitude} 
                longitude={longitude} 
                district={district} 
                taluka={taluka} 
              />
            </Suspense>
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