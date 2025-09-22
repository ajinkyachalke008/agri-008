import { Button } from "@/components/ui/button";
import { Smartphone, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farming.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/20 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                Smart Advisory for{" "}
                <span className="text-primary bg-gradient-to-r from-farm-green to-farm-green-light bg-clip-text text-transparent">
                  Smarter Farming
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl">
                Personalized, real-time farming advice for better yields and sustainability.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/signup">
                <Button variant="hero" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Button variant="glass" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">+20%</div>
                <div className="text-sm text-muted-foreground">Crop Yield</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">-30%</div>
                <div className="text-sm text-muted-foreground">Water Use</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">-15%</div>
                <div className="text-sm text-muted-foreground">Pesticide Use</div>
              </div>
            </div>
          </div>

          {/* Right Content - Glass Card with Phone Mockup */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="glass-hero floating">
              <div className="relative">
                <div className="w-64 h-80 sm:w-72 sm:h-88 lg:w-80 lg:h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl sm:rounded-3xl border border-glass-border flex items-center justify-center">
                  <div className="text-center space-y-3 sm:space-y-4 px-4">
                    <Smartphone className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto text-primary animate-glow" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">Smart Advisory Dashboard</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">Real-time insights at your fingertips</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="hidden sm:block absolute top-20 right-20 w-20 h-20 rounded-full bg-gradient-to-br from-farm-green/20 to-transparent backdrop-blur-sm floating" style={{ animationDelay: '2s' }}></div>
      <div className="hidden sm:block absolute bottom-40 left-20 w-16 h-16 rounded-full bg-gradient-to-br from-sky-blue/20 to-transparent backdrop-blur-sm floating" style={{ animationDelay: '4s' }}></div>
      <div className="hidden lg:block absolute top-40 left-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-warm-yellow/20 to-transparent backdrop-blur-sm floating" style={{ animationDelay: '6s' }}></div>
    </section>
  );
};

export default Hero;