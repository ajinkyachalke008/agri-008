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
      image: decliningYieldsImage
    },
    {
      icon: Clock,
      title: "Late Decision Making",
      description: "Farmers often receive critical information too late to prevent crop damage.",
      color: "warm-yellow",
      image: lateDecisionsImage
    },
    {
      icon: Droplets,
      title: "Water Wastage",
      description: "Inefficient irrigation leads to water scarcity and increased farming costs.",
      color: "sky-blue",
      image: waterWasteImage
    },
    {
      icon: AlertTriangle,
      title: "Pest Outbreaks",
      description: "Undetected pest infestations can destroy entire crops within days.",
      color: "destructive",
      image: pestOutbreakImage
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            The Challenges{" "}
            <span className="text-destructive">Farmers Face</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Modern agriculture faces complex challenges that traditional methods cannot address effectively.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {challenges.map((challenge, index) => {
            const IconComponent = challenge.icon;
            return (
              <div
                key={index}
                className="glass-card overflow-hidden space-y-4 p-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Challenge Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-${challenge.color}/90 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-white`} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {challenge.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass-hero inline-block">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              There's a Better Way
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