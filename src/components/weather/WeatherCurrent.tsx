import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';

interface WeatherCurrentProps {
  weatherData: any;
}

export const WeatherCurrent = ({ weatherData }: WeatherCurrentProps) => {
  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Cloud className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Weather data will appear here once you provide the OpenWeather API key</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current } = weatherData;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-card">
            <Thermometer className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">{current?.temp}°C</div>
            <div className="text-sm text-muted-foreground">Temperature</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card">
            <Droplets className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">{current?.humidity}%</div>
            <div className="text-sm text-muted-foreground">Humidity</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card">
            <Wind className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">{current?.wind_speed} km/h</div>
            <div className="text-sm text-muted-foreground">Wind Speed</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card">
            <Cloud className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-xl font-medium mt-2">{current?.weather?.[0]?.main}</div>
            <div className="text-sm text-muted-foreground">Condition</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
