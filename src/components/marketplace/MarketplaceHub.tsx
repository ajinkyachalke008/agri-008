import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Store } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const MarketplaceHub = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('marketplace.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('marketplace.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <ShoppingCart className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">{t('marketplace.buy.title')}</h3>
              <p className="text-muted-foreground">
                {t('marketplace.buy.description')}
              </p>
              <Link to="/marketplace/buy" className="w-full">
                <Button size="lg" className="w-full">
                  {t('marketplace.buy.cta')}
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Store className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">{t('marketplace.sell.title')}</h3>
              <p className="text-muted-foreground">
                {t('marketplace.sell.description')}
              </p>
              <Link to="/marketplace/sell" className="w-full">
                <Button size="lg" variant="outline" className="w-full">
                  {t('marketplace.sell.cta')}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
