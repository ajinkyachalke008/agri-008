import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Sparkles, Search, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SchemesHub = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: t("schemes.hub.browse"),
      description: t("schemes.hub.subtitle"),
      action: () => navigate("/schemes"),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: t("schemes.hub.recommendations"),
      description: "AI-powered personalized suggestions",
      action: () => navigate("/schemes/recommendations"),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: t("schemes.hub.search"),
      description: "Natural language search for schemes",
      action: () => navigate("/schemes?search=true"),
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-cyber">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {t("schemes.hub.title")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("schemes.hub.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="cyber-card overflow-hidden cursor-pointer group"
              onClick={feature.action}
            >
              <div className="p-8 space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:animate-pulseGlow transition-all border-2 border-white/30`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold font-cyber">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <Button variant="ghost" className="w-full group-hover:bg-primary/10 font-cyber">
                  Explore →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 text-center border-2 border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h4 className="text-3xl font-bold font-cyber neon-text">11+</h4>
            </div>
            <p className="text-muted-foreground">{t("schemes.hub.stats.total")}</p>
          </Card>
          <Card className="glass-card p-6 text-center border-2 border-green-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-green-500" />
              <h4 className="text-3xl font-bold font-cyber text-green-500">100%</h4>
            </div>
            <p className="text-muted-foreground">{t("schemes.hub.stats.active")}</p>
          </Card>
          <Card className="glass-card p-6 text-center border-2 border-accent/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h4 className="text-3xl font-bold font-cyber text-accent">₹50K+</h4>
            </div>
            <p className="text-muted-foreground">{t("schemes.hub.stats.avgBenefit")}</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SchemesHub;