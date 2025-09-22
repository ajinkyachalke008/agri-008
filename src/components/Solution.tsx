import { useState } from "react";
import { 
  Database, Brain, Smartphone, Plane, Calendar, Bug, 
  ShoppingCart, BarChart3, FileText, User, X, ArrowRight,
  Download, Eye, CheckCircle, TrendingUp, MapPin, AlertTriangle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import smartFarmImage from "@/assets/smart-farm-tech.jpg";
import multiSourceDataImage from "@/assets/multi-source-data.jpg";
import aiAnalyticsImage from "@/assets/ai-analytics.jpg";
import smartRecommendationsImage from "@/assets/smart-recommendations.jpg";
import cropPlanningImage from "@/assets/crop-planning-calendar.jpg";
import pestDiagnosisImage from "@/assets/pest-diagnosis.jpg";
import irrigationImage from "@/assets/irrigation-techniques.jpg";

const Solution = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const mainSolutionCards = [
    {
      id: 1,
      icon: Database,
      title: "Multi-Source Data",
      shortDesc: "IoT sensors, satellite imagery, weather & soil analysis",
      color: "sky-blue",
      image: multiSourceDataImage,
      expandedContent: {
        description: "Our comprehensive data collection system gathers real-time information from multiple sources to create a complete picture of your farm's conditions.",
        features: [
          "Soil moisture and pH sensors",
          "Weather station data",
          "Satellite imagery analysis",
          "UAV surveillance"
        ],
        caseStudy: {
          title: "Irrigation Optimization Success",
          result: "Saved 15% water usage while maintaining crop yields",
          farmer: "John Smith, 200-acre corn farm"
        },
        visualization: "Field heatmap showing soil moisture levels across different zones",
        ctaButtons: ["Download Data", "View Map"]
      }
    },
    {
      id: 2,
      icon: Brain,
      title: "AI Analytics",
      shortDesc: "Machine learning that turns data into insights",
      color: "primary",
      image: aiAnalyticsImage,
      expandedContent: {
        description: "Advanced machine learning algorithms analyze your farm data to detect patterns, predict issues, and provide actionable insights with confidence scores.",
        features: [
          "Plant stress detection",
          "Yield prediction modeling",
          "Anomaly alert system",
          "Disease risk assessment"
        ],
        caseStudy: {
          title: "Early Pest Detection",
          result: "Prevented major outbreak, saved $12,000 in potential losses",
          farmer: "Maria Garcia, organic tomato farm"
        },
        visualization: "AI-highlighted leaf images showing stress indicators and confidence percentages",
        ctaButtons: ["See Forecast", "Learn More"]
      }
    },
    {
      id: 3,
      icon: Smartphone,
      title: "Smart Recommendations",
      shortDesc: "Personalized, actionable advice delivered instantly",
      color: "accent",
      image: smartRecommendationsImage,
      expandedContent: {
        description: "Get personalized recommendations for irrigation, fertilization, pest control, and harvest timing based on your specific field conditions and crop needs.",
        features: [
          "Custom irrigation schedules",
          "Fertilizer application plans",
          "Pest & disease treatment advice",
          "Optimal harvest windows"
        ],
        caseStudy: {
          title: "Fertilizer Optimization",
          result: "Reduced fertilizer use by 18%, increased profit by $8,500",
          farmer: "David Chen, sustainable wheat farm"
        },
        visualization: "Interactive checklist with ROI calculations and application timelines",
        ctaButtons: ["Apply Recommendation", "Download PDF"]
      }
    }
  ];

  const additionalFeatures = [
    {
      id: 4,
      icon: Plane,
      title: "Aerial Imaging & Field Scouting",
      shortDesc: "On-demand NDVI & change detection flights",
      color: "sky-blue",
      image: smartFarmImage
    },
    {
      id: 5,
      icon: Calendar,
      title: "Crop Calendar & Task Planner",
      shortDesc: "Track seeding, spraying, harvest with reminders",
      color: "primary",
      image: cropPlanningImage
    },
    {
      id: 6,
      icon: Bug,
      title: "Pest & Disease Library",
      shortDesc: "Photos + treatment guides for major crops",
      color: "accent",
      image: pestDiagnosisImage
    },
    {
      id: 7,
      icon: ShoppingCart,
      title: "Marketplace & Inputs Ordering",
      shortDesc: "Order seeds, fertilizer, services directly",
      color: "sky-blue",
      image: irrigationImage
    },
    {
      id: 8,
      icon: BarChart3,
      title: "Farm Management Dashboard",
      shortDesc: "Multi-field overview with KPIs",
      color: "primary",
      image: smartFarmImage
    },
    {
      id: 9,
      icon: FileText,
      title: "Reports & Downloads",
      shortDesc: "Export PDF, GeoTIFF, CSV for agronomists",
      color: "accent",
      image: multiSourceDataImage
    },
    {
      id: 10,
      icon: User,
      title: "Farmer Profile & Settings",
      shortDesc: "Customize field size, irrigation type, preferred crops",
      color: "sky-blue",
      image: aiAnalyticsImage
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "sky-blue":
        return {
          bg: "bg-sky-blue/10",
          text: "text-sky-blue",
          glow: "glow-blue"
        };
      case "primary":
        return {
          bg: "bg-primary/10", 
          text: "text-primary",
          glow: "glow-green"
        };
      case "accent":
        return {
          bg: "bg-accent/10",
          text: "text-accent", 
          glow: "glow-yellow"
        };
      default:
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          glow: "glow-green"
        };
    }
  };

  const LiquidGlassCard = ({ card, onClick, isMain = false }: { 
    card: any, 
    onClick: () => void, 
    isMain?: boolean 
  }) => {
    const IconComponent = card.icon;
    const colors = getColorClasses(card.color);

    return (
      <div
        className={`liquid-glass-card ${isMain ? 'lg:col-span-1' : ''} cursor-pointer group`}
        onClick={onClick}
      >
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Icon */}
          <div className={`absolute top-4 right-4 w-12 h-12 ${colors.bg} ${colors.glow} rounded-full flex items-center justify-center backdrop-blur-sm`}>
            <IconComponent className={`w-6 h-6 ${colors.text}`} />
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm opacity-90 mb-3">{card.shortDesc}</p>
            <div className="flex items-center text-xs opacity-75">
              <span>Tap to explore</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExpandedCardModal = ({ card }: { card: any }) => {
    const IconComponent = card.icon;
    const colors = getColorClasses(card.color);

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 text-2xl">
            <div className={`w-12 h-12 ${colors.bg} ${colors.glow} rounded-full flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${colors.text}`} />
            </div>
            {card.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Image */}
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            {card.expandedContent?.description}
          </p>

          {card.expandedContent && (
            <>
              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {card.expandedContent.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Success Story
                  </h4>
                  <div className="glass-feature">
                    <h5 className="font-medium mb-2">{card.expandedContent.caseStudy.title}</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      {card.expandedContent.caseStudy.result}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {card.expandedContent.caseStudy.farmer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualization */}
              <div className="glass-feature">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-sky-blue" />
                  Data Visualization
                </h4>
                <p className="text-sm text-muted-foreground">
                  {card.expandedContent.visualization}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-glass-border">
                {card.expandedContent.ctaButtons.map((buttonText: string, index: number) => (
                  <Button
                    key={index}
                    variant={index === 0 ? "hero" : "glass"}
                    className="flex items-center gap-2"
                  >
                    {buttonText.includes("Download") && <Download className="w-4 h-4" />}
                    {buttonText.includes("View") && <Eye className="w-4 h-4" />}
                    {buttonText.includes("Apply") && <CheckCircle className="w-4 h-4" />}
                    {buttonText}
                  </Button>
                ))}
                <Button variant="outline" size="sm">
                  Request Demo
                </Button>
              </div>
            </>
          )}

          {/* Trust Line */}
          <div className="text-center pt-4 border-t border-glass-border">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Brain className="w-4 h-4" />
              Powered by AI + verified agronomy data
            </p>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <section className="py-20 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-sky-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-primary via-sky-blue to-accent bg-clip-text text-transparent">
              Smart Solution
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We combine cutting-edge technology with agricultural expertise to deliver personalized farming recommendations.
          </p>
          
          {/* Alert Banner */}
          <div className="mt-8 inline-flex items-center gap-2 glass-feature px-4 py-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">
              High pest risk detected in your area — inspect crops now
            </span>
          </div>
        </div>

        {/* Main Solution Cards */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            Core Solutions
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {mainSolutionCards.map((card) => (
              <LiquidGlassCard
                key={card.id}
                card={card}
                onClick={() => setSelectedCard(card.id)}
                isMain={true}
              />
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            Complete Farm Management Suite
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature) => (
              <LiquidGlassCard
                key={feature.id}
                card={feature}
                onClick={() => setSelectedCard(feature.id)}
              />
            ))}
          </div>
        </div>

        {/* Process Flow */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            Simple 4-Step Process
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "01", title: "Register Farm", desc: "Add your farm details and crop information", icon: User },
              { number: "02", title: "Collect Data", desc: "IoT sensors and satellites gather real-time data", icon: Database },
              { number: "03", title: "AI Analysis", desc: "Advanced algorithms process data for insights", icon: Brain },
              { number: "04", title: "Get Advice", desc: "Receive personalized recommendations instantly", icon: Smartphone }
            ].map((process, index) => {
              const ProcessIcon = process.icon;
              return (
                <div key={index} className="text-center liquid-glass-card cursor-default">
                  <div className="relative">
                    <div className="text-6xl font-bold text-primary/20 mb-4">
                      {process.number}
                    </div>
                    <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center glow-green">
                      <ProcessIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">
                      {process.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {process.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal for Expanded Cards */}
      <Dialog open={selectedCard !== null} onOpenChange={() => setSelectedCard(null)}>
        {selectedCard && (
          <ExpandedCardModal 
            card={mainSolutionCards.find(c => c.id === selectedCard) || additionalFeatures.find(c => c.id === selectedCard)} 
          />
        )}
      </Dialog>
    </section>
  );
};

export default Solution;