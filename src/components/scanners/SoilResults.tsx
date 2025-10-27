import { Star, Sprout, Beaker, Lightbulb, Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SoilAnalysis } from "@/types/scanner";
import { Progress } from "@/components/ui/progress";

interface SoilResultsProps {
  analysis: SoilAnalysis;
}

const SoilResults = ({ analysis }: SoilResultsProps) => {
  const { t } = useLanguage();

  const getMineralLevel = (level: string) => {
    const levels = { 'High': 80, 'Medium': 50, 'Low': 25 };
    return levels[level as keyof typeof levels] || 50;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Health Score */}
      <div className="glass-card p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${
                i < Math.floor(analysis.analysis.healthScore / 20)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
          ))}
        </div>
        <div className="text-4xl font-bold text-primary mb-1">
          {analysis.analysis.healthScore}/100
        </div>
        <div className="text-lg opacity-80">{t('scanners.soil.healthScore')}</div>
        <div className="mt-2 px-4 py-2 rounded-full bg-primary/20 inline-block">
          {analysis.analysis.healthStatus}
        </div>
      </div>

      {/* Soil Profile */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">{t('scanners.soil.soilProfile')}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm opacity-70">Type:</span>
            <p className="font-medium">{analysis.analysis.soilType}</p>
          </div>
          <div>
            <span className="text-sm opacity-70">Color:</span>
            <p className="font-medium">{analysis.analysis.color}</p>
          </div>
          <div>
            <span className="text-sm opacity-70">Texture:</span>
            <p className="font-medium">{analysis.analysis.texture}</p>
          </div>
          <div>
            <span className="text-sm opacity-70">Moisture:</span>
            <p className="font-medium">{analysis.analysis.moisture}</p>
          </div>
          <div className="col-span-2">
            <span className="text-sm opacity-70">Organic Matter:</span>
            <p className="font-medium">{analysis.analysis.organicMatter}</p>
          </div>
        </div>
      </div>

      {/* Minerals */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Beaker className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">{t('scanners.soil.minerals')}</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(analysis.minerals).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className="font-medium capitalize">{key}</span>
                <span className="text-sm opacity-70">
                  {'level' in value ? value.level : value.status}
                </span>
              </div>
              {'level' in value && (
                <Progress value={getMineralLevel(value.level)} className="h-2" />
              )}
              {'note' in value && value.note && (
                <p className="text-sm opacity-70 mt-1">{value.note}</p>
              )}
              {'recommendation' in value && value.recommendation && (
                <p className="text-sm text-amber-500 mt-1">💡 {value.recommendation}</p>
              )}
              {'estimated' in value && (
                <p className="text-sm opacity-70 mt-1">pH: {value.estimated}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">{t('scanners.soil.recommendations')}</h3>
        </div>
        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high'
                  ? 'border-red-500 bg-red-500/10'
                  : rec.priority === 'medium'
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-blue-500 bg-blue-500/10'
              }`}
            >
              <div className="font-semibold mb-1">{rec.action}</div>
              <p className="text-sm opacity-80">{rec.details}</p>
              <p className="text-xs opacity-60 mt-1">⏰ {rec.timing}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Organic Fertilizers */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">{t('scanners.soil.organicFertilizers')}</h3>
        </div>
        <div className="space-y-3">
          {analysis.organicInputs.fertilizers.map((fert, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-green-500/10">
              <div className="font-semibold text-green-700 dark:text-green-300 mb-1">
                {fert.name}
              </div>
              <p className="text-sm opacity-80 mb-2">{fert.benefit}</p>
              <div className="text-sm space-y-1">
                <p>📊 {fert.application}</p>
                <p>⏰ {fert.timing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Crops */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">{t('scanners.soil.bestCrops')}</h3>
        <div className="grid gap-3">
          {analysis.cropSuitability.map((crop, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <div className="font-semibold">{crop.crop}</div>
                <div className="text-sm opacity-70">{crop.suitability}</div>
              </div>
              <div className="text-2xl font-bold text-primary">{crop.score}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoilResults;
