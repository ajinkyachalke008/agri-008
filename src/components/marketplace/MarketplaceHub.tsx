import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Store } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const MarketplaceHub = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-cyber">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('marketplace.title')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('marketplace.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="cyber-card p-8 border-2 border-primary/20 hover:border-primary/50 group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10 border-2 border-primary/30 group-hover:animate-pulseGlow">
                <ShoppingCart className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold font-cyber">{t('marketplace.buy.title')}</h3>
              <p className="text-muted-foreground">
                {t('marketplace.buy.description')}
              </p>
              <Link to="/marketplace/buy" className="w-full">
                <Button size="lg" className="w-full font-cyber">
                  {t('marketplace.buy.cta')} →
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="cyber-card p-8 border-2 border-secondary/20 hover:border-secondary/50 group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-secondary/10 border-2 border-secondary/30 group-hover:animate-pulseGlow">
                <Store className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold font-cyber">{t('marketplace.sell.title')}</h3>
              <p className="text-muted-foreground">
                {t('marketplace.sell.description')}
              </p>
              <Link to="/marketplace/sell" className="w-full">
                <Button size="lg" variant="outline" className="w-full font-cyber border-secondary/30 hover:border-secondary">
                  {t('marketplace.sell.cta')} →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};