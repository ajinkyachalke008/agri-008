import { Button } from "@/components/ui/button";
import { Smartphone, PlayCircle, MapPin, Wifi, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroImage from "@/assets/hero-farming.jpg";
import heroVideo from "@/assets/hero-video.mp4";
import { useLanguage } from "@/contexts/LanguageContext";
import LocationPermissionDialog from "./LocationPermissionDialog";
import LanguageSwitcher from "./LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const handleLocationPermission = () => {
    setShowLocationDialog(true);
  };

  const handleAllowLocation = () => {
    // In a real app, this would request browser geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationShared(true);
        toast({
          title: "Location shared",
          description: "You'll receive location-specific advisories.",
        });
        console.log("Location:", position.coords);
      },
      (error) => {
        toast({
          title: "Location access denied",
          description: "You can still use the app with general advisories.",
          variant: "destructive",
        });
        console.error("Geolocation error:", error);
      }
    );
    setShowLocationDialog(false);
  };

  const valueProps = [
    { icon: Smartphone, label: t('hero.valueProps.0') },
    { icon: Wifi, label: t('hero.valueProps.1') },
    { icon: Mic, label: t('hero.valueProps.2') },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={heroImage}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/20 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Language Switcher - Top Right */}
        <div className="absolute top-4 right-6 z-20">
          <LanguageSwitcher />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                {t('hero.title').split('—')[0]}{" "}
                <span className="text-primary bg-gradient-to-r from-farm-green to-farm-green-light bg-clip-text text-transparent">
                  {t('hero.title').includes('—') ? t('hero.title').split('—')[1] : 'Smarter Farming'}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Value Props Chips */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {valueProps.map((prop, index) => {
                const IconComponent = prop.icon;
                return (
                  <div
                    key={index}
                    className="glass-card px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 text-xs sm:text-sm font-medium animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    <span>{prop.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.cta.primary')}
                </Button>
              </Link>
              <Button 
                variant="glass" 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                onClick={handleLocationPermission}
              >
                {locationShared ? (
                  <>
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                    Location Shared
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('hero.cta.secondary')}
                  </>
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{t('hero.stats.yield')}</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.yieldLabel')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{t('hero.stats.water')}</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.waterLabel')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{t('hero.stats.pesticide')}</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.pesticideLabel')}</div>
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
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        {t('dashboard.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                        {t('dashboard.subtitle')}
                      </p>
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

      {/* Location Permission Dialog */}
      <LocationPermissionDialog
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onAllow={handleAllowLocation}
      />
    </section>
  );
};

export default Hero;