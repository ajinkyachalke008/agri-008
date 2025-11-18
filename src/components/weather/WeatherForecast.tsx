import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface WeatherForecastProps {
  forecast: any[];
}

export const WeatherForecast = ({ forecast }: WeatherForecastProps) => {
  if (!forecast || forecast.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Cloud className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>7-day forecast will appear here once weather data is loaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (condition: string) => {
    if (condition?.toLowerCase().includes('rain')) return <CloudRain className="w-8 h-8" />;
    if (condition?.toLowerCase().includes('cloud')) return <Cloud className="w-8 h-8" />;
    if (condition?.toLowerCase().includes('wind')) return <Wind className="w-8 h-8" />;
    return <Sun className="w-8 h-8" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.slice(0, 7).map((day: any, index: number) => (
            <div key={index} className="text-center p-4 rounded-lg border hover:border-primary transition-colors">
              <div className="font-medium text-sm mb-2">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-primary mb-2 flex justify-center">
                {getWeatherIcon(day.weather?.[0]?.main)}
              </div>
              <div className="text-2xl font-bold">{Math.round(day.temp?.max)}°</div>
              <div className="text-sm text-muted-foreground">{Math.round(day.temp?.min)}°</div>
              {day.rain && (
                <div className="text-xs text-muted-foreground mt-2">
                  {Math.round(day.rain)}mm
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
