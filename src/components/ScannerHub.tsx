import { useNavigate } from "react-router-dom";
import { Leaf, Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "./ui/button";

const ScannerHub = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('scanners.hub.title')}
          </h2>
          <p className="text-lg opacity-80">
            {t('scanners.hub.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Soil Scanner Card */}
          <div className="glass-card group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
               onClick={() => navigate('/scan/soil')}>
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">
                  {t('scanners.hub.soil.title')}
                </h3>
                <p className="opacity-80 mb-6">
                  {t('scanners.hub.soil.description')}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    {t('scanners.benefits.instant')}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    {t('scanners.benefits.organic')}
                  </span>
                </div>

                <Button className="w-full btn-primary group-hover:shadow-lg">
                  {t('scanners.hub.soil.cta')}
                </Button>
              </div>
            </div>
          </div>

          {/* Disease Scanner Card */}
          <div className="glass-card group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
               onClick={() => navigate('/scan/disease')}>
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">
                  {t('scanners.hub.disease.title')}
                </h3>
                <p className="opacity-80 mb-6">
                  {t('scanners.hub.disease.description')}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    {t('scanners.benefits.expert')}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    {t('scanners.benefits.safe')}
                  </span>
                </div>

                <Button className="w-full btn-primary group-hover:shadow-lg">
                  {t('scanners.hub.disease.cta')}
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
