import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import SchemeCard from "@/components/schemes/SchemeCard";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SchemesDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [schemes, setSchemes] = useState<any[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch all schemes
  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('government_schemes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchemes(data || []);
      setFilteredSchemes(data || []);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      toast({
        title: "Error",
        description: "Failed to load schemes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredSchemes(schemes);
    } else {
      setFilteredSchemes(schemes.filter(s => s.category === selectedCategory));
    }
  }, [selectedCategory, schemes]);

  // AI Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredSchemes(schemes);
      return;
    }

    try {
      setSearching(true);
      const { data, error } = await supabase.functions.invoke('search-schemes', {
        body: { query: searchQuery, language, limit: 20 }
      });

      if (error) throw error;

      const searchResults = data.results.map((r: any) => r.scheme);
      setFilteredSchemes(searchResults);
      
      toast({
        title: "Search completed",
        description: `Found ${searchResults.length} schemes`
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const categories = [
    { value: "all", label: t("schemes.dashboard.categories.all") },
    { value: "crop_insurance", label: t("schemes.dashboard.categories.insurance") },
    { value: "irrigation", label: t("schemes.dashboard.categories.irrigation") },
    { value: "machinery", label: t("schemes.dashboard.categories.machinery") },
    { value: "financial_aid", label: t("schemes.dashboard.categories.financial") },
    { value: "soil_health", label: t("schemes.dashboard.categories.soilHealth") },
    { value: "renewable_energy", label: t("schemes.dashboard.categories.energy") }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <LanguageSwitcher />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {t("schemes.dashboard.pageTitle")}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t("schemes.dashboard.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("schemes.hub.search")
            )}
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full flex-wrap h-auto gap-2 bg-muted/50">
            {categories.map(cat => (
              <TabsTrigger key={cat.value} value={cat.value} className="flex-1 min-w-fit">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results */}
        <div>
          <p className="text-muted-foreground mb-4">
            {filteredSchemes.length} {t("schemes.dashboard.allSchemes")}
          </p>
          
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("schemes.dashboard.search.noResults")}</p>
              <p className="text-sm text-muted-foreground mt-2">{t("schemes.dashboard.search.tryDifferent")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SchemesDashboard;