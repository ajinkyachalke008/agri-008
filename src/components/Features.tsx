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
    <section className="py-20 px-6 relative">
      {/* Cyber Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40 animate-particleFloat" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-secondary/40 animate-particleFloat" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-accent/40 animate-particleFloat" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="font-cyber neon-text">Powerful Features</span>
            {" "}for{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Modern Farming
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps farmers make data-driven decisions for better crop management and sustainable practices.
          </p>
        </div>

        {/* Features Grid - 3D Cyber Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="cyber-card group cursor-pointer relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Scan Line Effect */}
                <div className="scan-line opacity-0 group-hover:opacity-100"></div>

                {/* Feature Image */}
                {feature.image && (
                  <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                    
                    {/* Holographic Overlay */}
                    <div className="absolute inset-0 holo-effect opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  </div>
                )}

                {/* Feature Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-${feature.color}/10 border border-${feature.color}/30 group-hover:scale-110 group-hover:animate-pulseGlow transition-all duration-300`}>
                      <IconComponent className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors font-cyber">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Neon Border on Hover */}
                <div className="absolute inset-0 rounded-glass border-2 border-transparent group-hover:border-primary/50 group-hover:animate-neonBorder transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;