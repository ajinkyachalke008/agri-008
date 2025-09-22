import { Droplets, Sprout, Bug, Mic, Wifi, Leaf } from "lucide-react";
import irrigationImage from "@/assets/irrigation-feature.jpg";
import fertilizerImage from "@/assets/fertilizer-feature.jpg";
import pestImage from "@/assets/pest-diagnosis.jpg";

const Features = () => {
  const features = [
    {
      id: 1,
      icon: Droplets,
      title: "Smart Irrigation",
      description: "AI-powered irrigation scheduling based on soil moisture, weather, and crop needs.",
      image: irrigationImage,
      color: "sky-blue"
    },
    {
      id: 2,
      icon: Sprout,
      title: "Fertilizer Advisory",
      description: "Personalized fertilizer recommendations for optimal nutrition and growth.",
      image: fertilizerImage,
      color: "farm-green"
    },
    {
      id: 3,
      icon: Bug,
      title: "Pest Diagnosis",
      description: "Early pest detection and treatment recommendations using computer vision.",
      image: pestImage,
      color: "warm-yellow"
    },
    {
      id: 4,
      icon: Mic,
      title: "Voice Assistance",
      description: "Get farming advice through voice commands in your local language.",
      image: null,
      color: "secondary"
    },
    {
      id: 5,
      icon: Wifi,
      title: "Offline Mode",
      description: "Access critical farming information even without internet connectivity.",
      image: null,
      color: "accent"
    },
    {
      id: 6,
      icon: Leaf,
      title: "Sustainability",
      description: "Eco-friendly practices that preserve soil health and reduce environmental impact.",
      image: null,
      color: "primary"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Powerful Features for{" "}
            <span className="text-primary bg-gradient-to-r from-farm-green to-sky-blue bg-clip-text text-transparent">
              Modern Farming
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps farmers make data-driven decisions for better crop management and sustainable practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="glass-feature group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Feature Image */}
                {feature.image && (
                  <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}

                {/* Feature Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-${feature.color}/10 glow-${feature.color === 'farm-green' ? 'green' : feature.color === 'sky-blue' ? 'blue' : 'yellow'} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-glass border-2 border-transparent group-hover:border-primary/30 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;