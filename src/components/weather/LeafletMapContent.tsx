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

interface LeafletMapContentProps {
  latitude: number;
  longitude: number;
  district?: string;
  taluka?: string;
}

const LeafletMapContent = ({ latitude, longitude, district, taluka }: LeafletMapContentProps) => {
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

export default LeafletMapContent;