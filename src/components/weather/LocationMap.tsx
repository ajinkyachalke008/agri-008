import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  district?: string;
  taluka?: string;
}

export const LocationMap = ({ latitude, longitude, district, taluka }: LocationMapProps) => {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import Leaflet components only on client side
    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
        
        // Fix for default marker icon
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create a wrapper component
        const MapWrapper = ({ lat, lng, dist, tal }: { lat: number; lng: number; dist?: string; tal?: string }) => (
          <MapContainer
            center={[lat, lng]}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">{dist}</p>
                  {tal && <p className="text-sm">{tal}</p>}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        );

        setMapComponent(() => MapWrapper);
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    loadMap();
  }, []);

  if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Location not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isClient || !MapComponent) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground text-sm">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Your Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] rounded-lg overflow-hidden">
          <MapComponent lat={latitude} lng={longitude} dist={district} tal={taluka} />
        </div>
      </CardContent>
    </Card>
  );
};
