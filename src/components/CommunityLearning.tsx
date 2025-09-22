import { PlayCircle, MessageSquare, Users, BookOpen, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommunityLearning = () => {
  const learningFeatures = [
    {
      icon: PlayCircle,
      title: "Video Tutorials",
      description: "Step-by-step agricultural training videos in local languages",
      features: ["Crop management guides", "Equipment tutorials", "Best practices"],
      color: "primary"
    },
    {
      icon: MessageSquare,
      title: "Q&A Forum",
      description: "Connect with fellow farmers and agricultural experts",
      features: ["Ask questions", "Share experiences", "Get instant answers"],
      color: "secondary"
    },
    {
      icon: Users,
      title: "Expert Sessions",
      description: "Live sessions with agricultural scientists and specialists",
      features: ["Weekly webinars", "One-on-one consultations", "Seasonal workshops"],
      color: "accent"
    }
  ];

  const achievements = [
    { icon: BookOpen, count: "500+", label: "Training Modules" },
    { icon: Award, count: "95%", label: "Success Rate" },
    { icon: Globe, count: "12", label: "Languages Supported" }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Learn & Grow{" "}
            <span className="text-primary bg-gradient-to-r from-farm-green to-sky-blue bg-clip-text text-transparent">
              Together
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our thriving community of farmers, experts, and agricultural enthusiasts. 
            Learn new techniques, share knowledge, and grow together.
          </p>
        </div>

        {/* Learning Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {learningFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="glass-feature group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-full bg-${feature.color}/10 flex items-center justify-center mb-6 glow-${feature.color === 'primary' ? 'green' : feature.color === 'secondary' ? 'blue' : 'yellow'} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 text-${feature.color}`} />
                </div>
                
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-${feature.color} mr-3`}></div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={feature.color === 'primary' ? 'hero' : feature.color === 'secondary' ? 'farm' : 'glass'}
                  className="mt-6 w-full"
                >
                  Explore {feature.title}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Community Stats */}
        <div className="glass-hero">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Growing Knowledge Community
            </h3>
            <p className="text-lg text-muted-foreground">
              Empowering farmers with education and peer support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <IconComponent className="w-8 h-8 text-primary mr-3" />
                    <span className="text-4xl font-bold text-primary">{achievement.count}</span>
                  </div>
                  <p className="text-muted-foreground font-medium">{achievement.label}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Join Our Community
            </Button>
          </div>
        </div>

        {/* Knowledge Exchange */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="glass-feature">
            <h4 className="text-xl font-semibold text-foreground mb-4">
              📚 Latest Agricultural Research
            </h4>
            <p className="text-muted-foreground mb-4">
              Stay updated with the latest research findings, innovative techniques, and emerging trends in agriculture.
            </p>
            <Button variant="farm">
              Browse Research
            </Button>
          </div>
          
          <div className="glass-feature">
            <h4 className="text-xl font-semibold text-foreground mb-4">
              🌱 Success Stories
            </h4>
            <p className="text-muted-foreground mb-4">
              Read inspiring stories from farmers who have transformed their practices and achieved remarkable results.
            </p>
            <Button variant="farm">
              Read Stories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityLearning;