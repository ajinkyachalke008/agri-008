import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bookmark, ExternalLink, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SchemeCardProps {
  scheme: any;
  onBookmark?: (schemeId: string) => void;
  isBookmarked?: boolean;
  relevanceScore?: number;
  matchReason?: string;
}

const SchemeCard = ({ scheme, onBookmark, isBookmarked, relevanceScore, matchReason }: SchemeCardProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const schemeName = language === 'mr' ? scheme.scheme_name_mr : scheme.scheme_name;
  const description = language === 'mr' ? scheme.description_mr : scheme.description;

  const categoryColors: Record<string, string> = {
    crop_insurance: "bg-blue-500",
    irrigation: "bg-cyan-500",
    machinery: "bg-orange-500",
    financial_aid: "bg-green-500",
    soil_health: "bg-amber-500",
    renewable_energy: "bg-purple-500"
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      crop_insurance: t("schemes.dashboard.categories.insurance"),
      irrigation: t("schemes.dashboard.categories.irrigation"),
      machinery: t("schemes.dashboard.categories.machinery"),
      financial_aid: t("schemes.dashboard.categories.financial"),
      soil_health: t("schemes.dashboard.categories.soilHealth"),
      renewable_energy: t("schemes.dashboard.categories.energy")
    };
    return labels[category] || category;
  };

  const formatAmount = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max && min === max) return `₹${min.toLocaleString()}`;
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (max) return `${t("schemes.card.upto")} ₹${max.toLocaleString()}`;
    return null;
  };

  return (
    <Card className="glass-card hover:shadow-glow transition-all duration-300 overflow-hidden group">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${categoryColors[scheme.category]} text-white border-0`}>
                {getCategoryLabel(scheme.category)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {scheme.scheme_type === 'central' ? t("schemes.card.central") : t("schemes.card.state")}
              </Badge>
              {relevanceScore && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {relevanceScore}% {t("schemes.recommendations.match")}
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
              {schemeName}
            </h3>
          </div>
          {onBookmark && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onBookmark(scheme.id)}
              className={isBookmarked ? "text-primary" : ""}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>

        {/* Match Reason (for recommendations) */}
        {matchReason && (
          <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r">
            <p className="text-sm text-muted-foreground">
              <strong>{t("schemes.recommendations.why")}</strong> {matchReason}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {description}
        </p>

        {/* Amount & Deadline */}
        <div className="flex items-center gap-4 text-sm">
          {formatAmount(scheme.amount_min, scheme.amount_max) && (
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                {formatAmount(scheme.amount_min, scheme.amount_max)}
              </span>
            </div>
          )}
          {scheme.end_date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(scheme.end_date).toLocaleDateString()}</span>
            </div>
          )}
          {!scheme.end_date && (
            <Badge variant="secondary">{t("schemes.detail.ongoing")}</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1"
            onClick={() => navigate(`/schemes/${scheme.id}`)}
          >
            {t("schemes.card.viewDetails")}
          </Button>
          {scheme.application_link && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(scheme.application_link, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SchemeCard;