import { useNavigate } from "react-router-dom";
import { Leaf, Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "./ui/button";

const ScannerHub = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-cyber">
            <span className="neon-text">{t('scanners.hub.title')}</span>
          </h2>
          <p className="text-lg opacity-80">
            {t('scanners.hub.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Soil Scanner Card - High-Tech Terminal */}
          <div className="cyber-card group cursor-pointer relative overflow-hidden"
               onClick={() => navigate('/scan/soil')}>
            {/* Scan Line */}
            <div className="scan-line opacity-0 group-hover:opacity-100"></div>
            
            <div className="relative rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              
              {/* Holographic Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/50 animate-neonBorder"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/50 animate-neonBorder"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 group-hover:animate-pulseGlow transition-all border-2 border-amber-300/50">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 font-cyber group-hover:text-primary transition-colors">
                  {t('scanners.hub.soil.title')}
                </h3>
                <p className="opacity-80 mb-6">
                  {t('scanners.hub.soil.description')}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm border border-primary/30 backdrop-blur-sm">
                    {t('scanners.benefits.instant')}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm border border-primary/30 backdrop-blur-sm">
                    {t('scanners.benefits.organic')}
                  </span>
                </div>

                <Button className="w-full btn-primary group-hover:shadow-lg group-hover:shadow-primary/50 transition-all font-cyber">
                  {t('scanners.hub.soil.cta')} →
                </Button>
              </div>
            </div>
          </div>

          {/* Disease Scanner Card - High-Tech Terminal */}
          <div className="cyber-card group cursor-pointer relative overflow-hidden"
               onClick={() => navigate('/scan/disease')}>
            {/* Scan Line */}
            <div className="scan-line opacity-0 group-hover:opacity-100"></div>
            
            <div className="relative rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              
              {/* Holographic Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-secondary/50 animate-neonBorder"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-secondary/50 animate-neonBorder"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 group-hover:animate-pulseGlow transition-all border-2 border-green-300/50">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 font-cyber group-hover:text-secondary transition-colors">
                  {t('scanners.hub.disease.title')}
                </h3>
                <p className="opacity-80 mb-6">
                  {t('scanners.hub.disease.description')}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm border border-secondary/30 backdrop-blur-sm">
                    {t('scanners.benefits.expert')}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm border border-secondary/30 backdrop-blur-sm">
                    {t('scanners.benefits.safe')}
                  </span>
                </div>

                <Button className="w-full btn-primary group-hover:shadow-lg group-hover:shadow-secondary/50 transition-all font-cyber">
                  {t('scanners.hub.disease.cta')} →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScannerHub;