import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface WeatherAlertsProps {
  alerts: any[];
}

export const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) return null;

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const highAlerts = alerts.filter(a => a.severity === 'high');

  const getAlertIcon = (severity: string) => {
    if (severity === 'critical') return <AlertCircle className="w-6 h-6" />;
    if (severity === 'high') return <AlertTriangle className="w-6 h-6" />;
    return <Info className="w-6 h-6" />;
  };

  const getAlertColor = (severity: string) => {
    if (severity === 'critical') return 'border-destructive bg-destructive/10';
    if (severity === 'high') return 'border-warning bg-warning/10';
    return 'border-primary bg-primary/10';
  };

  const displayAlerts = [...criticalAlerts, ...highAlerts].slice(0, 3);

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert) => (
        <Card key={alert.id} className={`${getAlertColor(alert.severity)} border-l-4`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={`${alert.severity === 'critical' ? 'text-destructive' : alert.severity === 'high' ? 'text-warning' : 'text-primary'}`}>
                {getAlertIcon(alert.severity)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                {alert.recommendations && (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium">Recommended Actions:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {(alert.recommendations?.en || []).map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
