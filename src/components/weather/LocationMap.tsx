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
  const [isMapReady, setIsMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      setIsMapReady(true);
    }
  }, []);

  useEffect(() => {
    if (isMapReady && latitude && longitude) {
      // Load leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      
      // Small delay to ensure CSS is loaded
      setTimeout(() => setLeafletLoaded(true), 100);
    }
  }, [isMapReady, latitude, longitude]);

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

  if (!leafletLoaded) {
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
          <LeafletMap 
            latitude={latitude} 
            longitude={longitude} 
            district={district} 
            taluka={taluka} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Separate component to avoid re-renders
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  district?: string;
  taluka?: string;
}

const LeafletMap = ({ latitude, longitude, district, taluka }: LeafletMapProps) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold">{district}</p>
            {taluka && <p className="text-sm">{taluka}</p>}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};