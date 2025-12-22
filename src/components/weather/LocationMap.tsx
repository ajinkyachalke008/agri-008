import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
  district?: string;
  taluka?: string;
}

export const LocationMap = ({ latitude, longitude, district, taluka }: LocationMapProps) => {
  if (!latitude || !longitude) {
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
        </div>
      </CardContent>
    </Card>
  );
};
