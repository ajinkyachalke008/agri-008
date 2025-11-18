import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherCurrent } from '@/components/weather/WeatherCurrent';
import { WeatherForecast } from '@/components/weather/WeatherForecast';
import { WeatherAlerts } from '@/components/weather/WeatherAlerts';
import { CropRecommendations } from '@/components/weather/CropRecommendations';
import { LocationSettings } from '@/components/weather/LocationSettings';
import { LogOut, RefreshCw, Settings, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const WeatherDashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchWeatherData();
      fetchAlerts();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    // This will be implemented once we add the edge function
    // For now, show placeholder
    setLoading(false);
  };

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from('weather_alerts')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching alerts:', error);
    } else {
      setAlerts(data || []);
    }
  };

  const handleRefresh = () => {
    fetchWeatherData();
    fetchAlerts();
    toast.success('Weather data refreshed');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Weather Dashboard</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{profile?.district}, {profile?.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Alerts Banner */}
          {alerts.length > 0 && <WeatherAlerts alerts={alerts} />}

          {/* Current Weather */}
          <WeatherCurrent weatherData={weatherData} />

          {/* 7-Day Forecast */}
          <WeatherForecast forecast={weatherData?.daily || []} />

          {/* Farming Recommendations */}
          <CropRecommendations recommendations={recommendations} crops={profile?.primary_crops} />

          {/* Recent Alerts History */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Your weather alert history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                          alert.severity === 'high' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <LocationSettings
          profile={profile}
          onClose={() => setShowSettings(false)}
          onUpdate={fetchUserProfile}
        />
      )}
    </div>
  );
};

export default WeatherDashboard;
