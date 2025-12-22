import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { maharashtraDistricts } from '@/data/maharashtraLocations';
import { MapPin } from 'lucide-react';

interface LocationSettingsProps {
  profile: any;
  onClose: () => void;
  onUpdate: () => void;
}

export const LocationSettings = ({ profile, onClose, onUpdate }: LocationSettingsProps) => {
  const [formData, setFormData] = useState({
    district: profile?.district || '',
    taluka: profile?.taluka || '',
    village: profile?.village || '',
    pincode: profile?.pincode || '',
    primary_crops: profile?.primary_crops || [],
    weather_alerts_enabled: profile?.weather_alerts_enabled ?? true,
    sms_notifications: profile?.sms_notifications ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [cropsInput, setCropsInput] = useState('');

  // Get talukas for the selected district
  const availableTalukas = useMemo(() => {
    const selectedDistrict = maharashtraDistricts.find(d => d.name === formData.district);
    return selectedDistrict?.talukas || [];
  }, [formData.district]);

  // Reset taluka when district changes
  const handleDistrictChange = (district: string) => {
    setFormData({ ...formData, district, taluka: '' });
  };

  useEffect(() => {
    if (profile?.primary_crops) {
      setCropsInput(profile.primary_crops.join(', '));
    }
  }, [profile]);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.success('Location captured successfully!');
          // We'll store lat/lon when we update profile
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation not supported by your browser');
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const crops = cropsInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...formData,
        primary_crops: crops,
      })
      .eq('user_id', profile.user_id);

    if (error) {
      toast.error('Failed to update settings');
      console.error(error);
    } else {
      toast.success('Settings updated successfully');
      onUpdate();
      onClose();
    }

    setLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Location & Notification Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Farm Location
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={formData.district} onValueChange={handleDistrictChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {maharashtraDistricts.map((district) => (
                      <SelectItem key={district.name} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Taluka</Label>
                <Select 
                  value={formData.taluka} 
                  onValueChange={(value) => setFormData({ ...formData, taluka: value })}
                  disabled={!formData.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.district ? "Select taluka" : "Select district first"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableTalukas.map((taluka) => (
                      <SelectItem key={taluka.name} value={taluka.name}>
                        {taluka.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Village</Label>
                <Input
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Enter village"
                />
              </div>

              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </div>
            </div>

            <Button variant="outline" onClick={handleGetLocation} className="w-full">
              <MapPin className="w-4 h-4 mr-2" />
              Use My Current Location
            </Button>
          </div>

          {/* Crops Section */}
          <div className="space-y-2">
            <Label>Primary Crops (comma separated)</Label>
            <Input
              value={cropsInput}
              onChange={(e) => setCropsInput(e.target.value)}
              placeholder="e.g., Wheat, Rice, Cotton"
            />
            <p className="text-xs text-muted-foreground">
              Enter crop names separated by commas for personalized recommendations
            </p>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold">Notification Preferences</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Weather Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive weather alerts and warnings</p>
              </div>
              <Switch
                checked={formData.weather_alerts_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, weather_alerts_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Get alerts via SMS</p>
              </div>
              <Switch
                checked={formData.sms_notifications}
                onCheckedChange={(checked) => setFormData({ ...formData, sms_notifications: checked })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
