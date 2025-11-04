import { AlertTriangle, TrendingDown, Clock, Droplets } from "lucide-react";
import decliningYieldsImage from "@/assets/declining-yields.jpg";
import lateDecisionsImage from "@/assets/late-decisions.jpg";
import waterWasteImage from "@/assets/water-waste.jpg";
import pestOutbreakImage from "@/assets/pest-outbreak.jpg";

const Problem = () => {
  const challenges = [
    {
      icon: TrendingDown,
      title: "Declining Yields",
      description: "Traditional farming methods struggle with unpredictable weather and changing conditions.",
      color: "destructive",
      image: decliningYieldsImage,
      stat: "-25%"
    },
    {
      icon: Clock,
      title: "Late Decision Making",
      description: "Farmers often receive critical information too late to prevent crop damage.",
      color: "warm-yellow",
      image: lateDecisionsImage,
      stat: "72hrs"
    },
    {
      icon: Droplets,
      title: "Water Wastage",
      description: "Inefficient irrigation leads to water scarcity and increased farming costs.",
      color: "sky-blue",
      image: waterWasteImage,
      stat: "40%"
    },
    {
      icon: AlertTriangle,
      title: "Pest Outbreaks",
      description: "Undetected pest infestations can destroy entire crops within days.",
      color: "destructive",
      image: pestOutbreakImage,
      stat: "85%"
    }
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Dark Ominous Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-background"></div>
      
      {/* Animated Danger Indicators */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-destructive/5 blur-3xl animate-pulseGlow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-destructive/5 blur-3xl animate-pulseGlow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="font-cyber">The Challenges</span>{" "}
            <span className="text-destructive neon-text">Farmers Face</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Modern agriculture faces complex challenges that traditional methods cannot address effectively.
          </p>
        </div>

        {/* Problem Cards - Dramatic Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {challenges.map((challenge, index) => {
            const IconComponent = challenge.icon;
            return (
              <div
                key={index}
                className="cyber-card overflow-hidden space-y-4 p-0 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Challenge Image with Alert Badge */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent"></div>
                  
                  {/* Animated Alert Icon */}
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-${challenge.color}/90 flex items-center justify-center animate-pulseGlow`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Dramatic Stat */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-destructive/30">
                    <span className="text-destructive font-bold text-sm font-cyber">{challenge.stat}</span>
                  </div>

                  {/* Glitch Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-3">
                  <h3 className="text-xl font-semibold text-foreground font-cyber group-hover:text-destructive transition-colors">
                    {challenge.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {challenge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass-hero inline-block border-2 border-primary/30 animate-neonBorder">
            <h3 className="text-2xl font-bold text-foreground mb-4 font-cyber">
              There's a <span className="neon-text">Better Way</span>
            </h3>
            <p className="text-lg text-muted-foreground">
              Smart technology can transform these challenges into opportunities for growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;