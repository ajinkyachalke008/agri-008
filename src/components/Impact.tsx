import { TrendingUp, Droplets, Leaf, Users } from "lucide-react";
import impactImage from "@/assets/impact-success.jpg";

const Impact = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "+20%",
      label: "Crop Yield Increase",
      description: "Average improvement in harvest quantity",
      color: "primary"
    },
    {
      icon: Droplets,
      value: "-30%",
      label: "Water Conservation",
      description: "Reduction in water usage through smart irrigation",
      color: "sky-blue"
    },
    {
      icon: Leaf,
      value: "-15%",
      label: "Pesticide Reduction",
      description: "Decreased chemical usage with precision application",
      color: "accent"
    },
    {
      icon: Users,
      value: "5000+",
      label: "Farmers Empowered",
      description: "Growing community of smart farmers",
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${impactImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Measurable{" "}
            <span className="text-primary bg-gradient-to-r from-farm-green to-sky-blue bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Real results from farmers who have embraced smart agriculture practices with our advisory system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="glass-hero text-center group hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`mx-auto mb-6 w-20 h-20 rounded-full bg-${stat.color}/10 flex items-center justify-center glow-${stat.color === 'primary' ? 'green' : stat.color === 'sky-blue' ? 'blue' : 'yellow'} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-10 h-10 text-${stat.color}`} />
                </div>
                
                <div className={`text-5xl font-bold text-${stat.color} mb-2 animate-glow`}>
                  {stat.value}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {stat.label}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Success Stories */}
        <div className="glass-hero text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Transforming Lives, One Farm at a Time
          </h3>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            "Since adopting the Smart Farm Advisory System, I've seen remarkable improvements in my crop yield while using fewer resources. 
            The real-time recommendations have helped me make better decisions and increase my farm's profitability."
          </p>
          <div className="mt-6">
            <p className="font-semibold text-primary">— Rajesh Kumar, Progressive Farmer</p>
            <p className="text-sm text-muted-foreground">Maharashtra, India</p>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="glass-feature text-center">
            <div className="text-3xl font-bold text-primary mb-2">50M+</div>
            <p className="text-muted-foreground">Liters of water saved</p>
          </div>
          <div className="glass-feature text-center">
            <div className="text-3xl font-bold text-accent mb-2">25%</div>
            <p className="text-muted-foreground">Reduction in carbon footprint</p>
          </div>
          <div className="glass-feature text-center">
            <div className="text-3xl font-bold text-secondary mb-2">1000+</div>
            <p className="text-muted-foreground">Hectares under smart farming</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;