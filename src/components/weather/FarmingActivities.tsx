import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Bug, Scissors, Leaf, Shovel, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Activity {
  activity: string;
  timing: string;
  recommendation: 'should_do' | 'avoid' | 'optimal';
  reason: string;
  details: string;
}

interface FarmingActivitiesProps {
  activities: Activity[] | null;
  isLoading?: boolean;
}

const activityIcons: Record<string, any> = {
  'Irrigation': Droplets,
  'Pesticide Spraying': Bug,
  'Spraying': Bug,
  'Harvesting': Scissors,
  'Fertilizer Application': Leaf,
  'Fertilizing': Leaf,
  'Weeding': Shovel,
};

const getActivityIcon = (activity: string) => {
  for (const [key, Icon] of Object.entries(activityIcons)) {
    if (activity.toLowerCase().includes(key.toLowerCase())) {
      return Icon;
    }
  }
  return Leaf;
};

const getRecommendationStyle = (recommendation: string) => {
  switch (recommendation) {
    case 'optimal':
      return {
        badge: 'bg-green-500/20 text-green-700 border-green-300',
        icon: CheckCircle2,
        iconColor: 'text-green-600',
        border: 'border-l-green-500',
        label: 'Optimal'
      };
    case 'should_do':
      return {
        badge: 'bg-blue-500/20 text-blue-700 border-blue-300',
        icon: CheckCircle2,
        iconColor: 'text-blue-600',
        border: 'border-l-blue-500',
        label: 'Recommended'
      };
    case 'avoid':
      return {
        badge: 'bg-red-500/20 text-red-700 border-red-300',
        icon: XCircle,
        iconColor: 'text-red-600',
        border: 'border-l-red-500',
        label: 'Avoid'
      };
    default:
      return {
        badge: 'bg-muted text-muted-foreground border-muted',
        icon: AlertCircle,
        iconColor: 'text-muted-foreground',
        border: 'border-l-muted',
        label: 'Check'
      };
  }
};

export const FarmingActivities = ({ activities, isLoading }: FarmingActivitiesProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Today's Farming Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Analyzing weather for best timings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Today's Farming Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Add crops to your profile to get activity recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Today's Farming Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.activity);
            const style = getRecommendationStyle(activity.recommendation);
            const StatusIcon = style.icon;

            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 bg-card shadow-sm ${style.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg bg-muted ${style.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-semibold text-foreground">{activity.activity}</h4>
                        <Badge variant="outline" className={style.badge}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {style.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{activity.timing}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Why: </span>{activity.reason}
                      </p>
                      <p className="text-sm text-foreground/80">
                        <span className="font-medium">How: </span>{activity.details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
