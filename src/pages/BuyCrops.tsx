import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Package, Truck, Leaf, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cropCategories, maharashtraDistricts } from "@/data/maharashtraLocations";

interface CropListing {
  id: string;
  crop_name: string;
  category: string;
  is_organic: boolean;
  quantity: number;
  unit: string;
  price_per_unit: number;
  district: string;
  taluka: string;
  delivery_available: boolean;
  harvest_date: string;
  farm_name: string;
  farmer_name: string;
  storage_type: string;
  image_urls: string[];
}

export default function BuyCrops() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('crop_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: language === 'mr' ? "त्रुटी" : "Error",
        description: language === 'mr' ? "सूची लोड करण्यात अयशस्वी" : "Failed to load listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.farmer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    const matchesDistrict = districtFilter === "all" || listing.district === districtFilter;
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t('marketplace.buy.pageTitle')}
        </h1>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'mr' ? 'पीक किंवा शेतकरी शोधा' : 'Search crops or farmer'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'mr' ? 'सर्व श्रेणी' : 'All Categories'} />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">{language === 'mr' ? 'सर्व श्रेणी' : 'All Categories'}</SelectItem>
                {cropCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {language === 'mr' ? cat.labelHi : cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'mr' ? 'सर्व जिल्हे' : 'All Districts'} />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">{language === 'mr' ? 'सर्व जिल्हे' : 'All Districts'}</SelectItem>
                {maharashtraDistricts.map((district) => (
                  <SelectItem key={district.name} value={district.name}>
                    {language === 'mr' ? district.nameHi : district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{language === 'mr' ? 'लोड होत आहे...' : 'Loading...'}</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{language === 'mr' ? 'कोणतीही सूची आढळली नाही' : 'No listings found'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-all">
                {listing.image_urls.length > 0 && (
                  <img
                    src={listing.image_urls[0]}
                    alt={listing.crop_name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{listing.crop_name}</h3>
                    {listing.is_organic && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Leaf className="h-3 w-3 mr-1" />
                        {language === 'mr' ? 'सेंद्रिय' : 'Organic'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-2xl font-bold text-primary">
                    ₹{listing.price_per_unit} / {listing.unit}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{listing.quantity} {listing.unit} {language === 'mr' ? 'उपलब्ध' : 'available'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.taluka ? `${listing.taluka}, ` : ''}{listing.district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{language === 'mr' ? 'कापणी:' : 'Harvested:'} {new Date(listing.harvest_date).toLocaleDateString()}</span>
                    </div>
                    {listing.delivery_available && (
                      <div className="flex items-center gap-2 text-primary">
                        <Truck className="h-4 w-4" />
                        <span>{language === 'mr' ? 'होम डिलिव्हरी उपलब्ध' : 'Home Delivery Available'}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium">{listing.farmer_name}</p>
                    <p className="text-xs text-muted-foreground">{listing.farm_name}</p>
                  </div>

                  <Button className="w-full">
                    {language === 'mr' ? 'संपर्क साधा' : 'Contact Seller'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
