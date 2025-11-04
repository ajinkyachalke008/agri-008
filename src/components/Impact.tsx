import { TrendingUp, Droplets, Leaf, Users } from "lucide-react";
import impactImage from "@/assets/impact-success.jpg";
import { useEffect, useState } from "react";

const Impact = () => {
  const [counters, setCounters] = useState({
    yield: 0,
    water: 0,
    pesticide: 0,
    farmers: 0
  });

  const stats = [
    {
      icon: TrendingUp,
      value: 20,
      suffix: "%",
      prefix: "+",
      label: "Crop Yield Increase",
      description: "Average improvement in harvest quantity",
      color: "primary",
      key: "yield"
    },
    {
      icon: Droplets,
      value: 30,
      suffix: "%",
      prefix: "-",
      label: "Water Conservation",
      description: "Reduction in water usage through smart irrigation",
      color: "sky-blue",
      key: "water"
    },
    {
      icon: Leaf,
      value: 15,
      suffix: "%",
      prefix: "-",
      label: "Pesticide Reduction",
      description: "Decreased chemical usage with precision application",
      color: "accent",
      key: "pesticide"
    },
    {
      icon: Users,
      value: 5000,
      suffix: "+",
      prefix: "",
      label: "Farmers Empowered",
      description: "Growing community of smart farmers",
      color: "secondary",
      key: "farmers"
    }
  ];

  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        yield: Math.floor(20 * progress),
        water: Math.floor(30 * progress),
        pesticide: Math.floor(15 * progress),
        farmers: Math.floor(5000 * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters({ yield: 20, water: 30, pesticide: 15, farmers: 5000 });
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${impactImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
      </div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.2) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="font-cyber">Measurable</span>{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Real results from farmers who have embraced smart agriculture practices with our advisory system.
          </p>
        </div>

        {/* Real-Time Dashboard Style Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const counterValue = counters[stat.key as keyof typeof counters];
            
            return (
              <div
                key={index}
                className="cyber-card text-center group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated Background Pulse */}
                <div className={`absolute inset-0 bg-${stat.color}/5 animate-pulseGlow`}></div>

                {/* Icon with Circular Progress */}
                <div className="relative mb-6">
                  <div className={`mx-auto w-20 h-20 rounded-full bg-${stat.color}/10 border-2 border-${stat.color}/30 flex items-center justify-center group-hover:scale-110 group-hover:animate-spin transition-all duration-500`}>
                    <IconComponent className={`w-10 h-10 text-${stat.color}`} />
                  </div>
                  {/* Orbital Ring */}
                  <div className={`absolute inset-0 rounded-full border-2 border-${stat.color}/20 animate-spin`} style={{ animationDuration: '3s' }}></div>
                </div>
                
                {/* Animated Counter */}
                <div className={`text-5xl font-bold mb-2 font-cyber relative z-10`}>
                  <span className="neon-text">
                    {stat.prefix}{counterValue}{stat.suffix}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 font-cyber">
                  {stat.label}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Data Flow Visualization */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        {/* Success Stories */}
        <div className="glass-hero text-center border-2 border-primary/30 relative overflow-hidden">
          {/* Holographic Shimmer */}
          <div className="absolute inset-0 holo-effect opacity-20"></div>
          
          <h3 className="text-3xl font-bold text-foreground mb-6 font-cyber relative z-10">
            Transforming Lives, <span className="neon-text">One Farm at a Time</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed relative z-10">
            "Since adopting the Smart Farm Advisory System, I've seen remarkable improvements in my crop yield while using fewer resources. 
            The real-time recommendations have helped me make better decisions and increase my farm's profitability."
          </p>
          <div className="mt-6 relative z-10">
            <p className="font-semibold text-primary">— Rajesh Kumar, Progressive Farmer</p>
            <p className="text-sm text-muted-foreground">Maharashtra, India</p>
          </div>
        </div>

        {/* Environmental Impact - Mini Dashboard */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="glass-feature text-center group hover:border-primary/40 transition-all">
            <div className="text-3xl font-bold text-primary mb-2 font-cyber neon-text">50M+</div>
            <p className="text-muted-foreground">Liters of water saved</p>
            <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="glass-feature text-center group hover:border-accent/40 transition-all">
            <div className="text-3xl font-bold text-accent mb-2 font-cyber">25%</div>
            <p className="text-muted-foreground">Reduction in carbon footprint</p>
            <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="glass-feature text-center group hover:border-secondary/40 transition-all">
            <div className="text-3xl font-bold text-secondary mb-2 font-cyber">1000+</div>
            <p className="text-muted-foreground">Hectares under smart farming</p>
            <div className="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;