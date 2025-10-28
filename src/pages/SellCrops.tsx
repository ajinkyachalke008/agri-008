import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Upload, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { LocationSelector } from "@/components/marketplace/LocationSelector";
import { cropCategories, storageTypes, units } from "@/data/maharashtraLocations";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  cropName: z.string().min(1, "Crop name is required"),
  category: z.string().min(1, "Category is required"),
  isOrganic: z.boolean(),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.string().min(1, "Price is required"),
  district: z.string().min(1, "District is required"),
  taluka: z.string().optional(),
  deliveryAvailable: z.boolean(),
  harvestDate: z.date(),
  farmName: z.string().min(1, "Farm name is required"),
  farmerName: z.string().min(1, "Farmer name is required"),
  storageType: z.string().optional(),
});

export default function SellCrops() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: "",
      category: "",
      isOrganic: false,
      quantity: "",
      unit: "quintal",
      pricePerUnit: "",
      district: "",
      taluka: "",
      deliveryAvailable: false,
      harvestDate: new Date(),
      farmName: "",
      farmerName: "",
      storageType: "none",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast({
        title: language === 'mr' ? "जास्तीत जास्त 3 फोटो" : "Maximum 3 photos",
        variant: "destructive",
      });
      return;
    }
    setImages([...images, ...files]);
  };

  const handleSuggestPrice = async () => {
    const cropName = form.getValues("cropName");
    const category = form.getValues("category");
    const quantity = form.getValues("quantity");
    const unit = form.getValues("unit");
    const district = form.getValues("district");
    const isOrganic = form.getValues("isOrganic");

    if (!cropName || !category || !quantity || !district) {
      toast({
        title: language === 'mr' ? "कृपया सर्व आवश्यक फील्ड भरा" : "Please fill required fields",
        description: language === 'mr' 
          ? "पीक नाव, श्रेणी, प्रमाण आणि जिल्हा आवश्यक आहे"
          : "Crop name, category, quantity and district are required",
        variant: "destructive",
      });
      return;
    }

    setIsSuggestingPrice(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-price', {
        body: {
          cropName,
          category,
          quantity,
          unit,
          state: "Maharashtra",
          district,
          isOrganic,
        },
      });

      if (error) throw error;

      form.setValue("pricePerUnit", data.suggestedPrice.toString());
      toast({
        title: language === 'mr' ? "किंमत सुचवली" : "Price Suggested",
        description: `₹${data.suggestedPrice} per ${unit}. Range: ₹${data.minPrice}-₹${data.maxPrice}`,
      });
    } catch (error) {
      console.error("Price suggestion error:", error);
      toast({
        title: language === 'mr' ? "त्रुटी" : "Error",
        description: language === 'mr' ? "किंमत सुचवण्यात अयशस्वी" : "Failed to suggest price",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingPrice(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: language === 'mr' ? "कृपया लॉगिन करा" : "Please login",
          variant: "destructive",
        });
        return;
      }

      // Upload images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}_${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('crop-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('crop-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Create listing
      const { error } = await supabase.from('crop_listings').insert({
        user_id: user.id,
        crop_name: values.cropName,
        category: values.category,
        is_organic: values.isOrganic,
        quantity: parseFloat(values.quantity),
        unit: values.unit,
        price_per_unit: parseFloat(values.pricePerUnit),
        state: "Maharashtra",
        district: values.district,
        taluka: values.taluka,
        delivery_available: values.deliveryAvailable,
        harvest_date: format(values.harvestDate, 'yyyy-MM-dd'),
        farm_name: values.farmName,
        farmer_name: values.farmerName,
        storage_type: values.storageType,
        image_urls: imageUrls,
      });

      if (error) throw error;

      toast({
        title: language === 'mr' ? "यशस्वी!" : "Success!",
        description: language === 'mr' ? "तुमची पीक यशस्वीरित्या सूचीबद्ध झाली" : "Your crop has been listed successfully",
      });

      navigate('/marketplace/buy');
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: language === 'mr' ? "त्रुटी" : "Error",
        description: language === 'mr' ? "पीक सूचीबद्ध करण्यात अयशस्वी" : "Failed to create listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('marketplace.sell.formTitle')}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label>{language === 'mr' ? 'पीक फोटो (जास्तीत जास्त 3)' : 'Crop Photos (Max 3)'}</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="crop-images"
                    disabled={images.length >= 3}
                  />
                  <label htmlFor="crop-images" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {language === 'mr' ? 'फोटो अपलोड करण्यासाठी क्लिक करा' : 'Click to upload photos'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'mr' ? 'चांगला प्रकाश आणि स्वच्छ पार्श्वभूमी वापरा' : 'Use good lighting and clean background'}
                    </p>
                  </label>
                  {images.length > 0 && (
                    <p className="mt-2 text-sm">{images.length} {language === 'mr' ? 'फोटो निवडले' : 'photos selected'}</p>
                  )}
                </div>
              </div>

              {/* Crop Name */}
              <FormField
                control={form.control}
                name="cropName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'mr' ? 'पीक नाव' : 'Crop Name'} <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder={language === 'mr' ? 'उदा. गेहूं, धान, टमाटर' : 'e.g. Wheat, Rice, Tomato'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'mr' ? 'श्रेणी' : 'Category'} <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'mr' ? 'श्रेणी निवडा' : 'Select Category'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background">
                        {cropCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {language === 'mr' ? cat.labelHi : cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Organic Toggle */}
              <FormField
                control={form.control}
                name="isOrganic"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>{language === 'mr' ? 'सेंद्रिय पीक' : 'Organic Crop'}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Quantity and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'mr' ? 'प्रमाण' : 'Quantity'} <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'mr' ? 'एकक' : 'Unit'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
                          {units.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {language === 'mr' ? unit.labelHi : unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Price with AI Suggestion */}
              <FormField
                control={form.control}
                name="pricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'mr' ? 'प्रति एकक किंमत (₹)' : 'Price Per Unit (₹)'} <span className="text-destructive">*</span></FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSuggestPrice}
                        disabled={isSuggestingPrice}
                      >
                        {isSuggestingPrice ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        <span className="ml-2">{language === 'mr' ? 'AI सूचना' : 'AI Suggest'}</span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <LocationSelector
                district={form.watch("district")}
                taluka={form.watch("taluka") || ""}
                onDistrictChange={(value) => form.setValue("district", value)}
                onTalukaChange={(value) => form.setValue("taluka", value)}
              />

              {/* Storage Type */}
              <FormField
                control={form.control}
                name="storageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'mr' ? 'साठवण प्रकार' : 'Storage Type'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background">
                        {storageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {language === 'mr' ? type.labelHi : type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Delivery Toggle */}
              <FormField
                control={form.control}
                name="deliveryAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>{language === 'mr' ? 'डिलिव्हरी उपलब्ध' : 'Delivery Available'}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Harvest Date */}
              <FormField
                control={form.control}
                name="harvestDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{language === 'mr' ? 'कापणी तारीख' : 'Harvest Date'} <span className="text-destructive">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>{language === 'mr' ? 'तारीख निवडा' : 'Pick a date'}</span>}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Farm Name */}
              <FormField
                control={form.control}
                name="farmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'mr' ? 'शेताचे नाव' : 'Farm Name'} <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder={language === 'mr' ? 'उदा. श्री कृषि फार्म' : 'e.g. Shri Krishi Farm'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Farmer Name */}
              <FormField
                control={form.control}
                name="farmerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'mr' ? 'शेतकऱ्याचे नाव' : 'Farmer Name'} <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder={language === 'mr' ? 'उदा. राजेश पाटील' : 'e.g. Rajesh Patil'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {language === 'mr' ? 'पीक सूचीबद्ध करा' : 'List Crop'}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
