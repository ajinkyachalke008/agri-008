-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create crop_listings table
CREATE TABLE public.crop_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_organic BOOLEAN DEFAULT false,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'quintal',
  price_per_unit NUMERIC NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  taluka TEXT,
  delivery_available BOOLEAN DEFAULT false,
  harvest_date DATE NOT NULL,
  farm_name TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  storage_type TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active listings"
ON public.crop_listings
FOR SELECT
USING (status = 'active');

CREATE POLICY "Users can create their own listings"
ON public.crop_listings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
ON public.crop_listings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
ON public.crop_listings
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_crop_listings_updated_at
BEFORE UPDATE ON public.crop_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for crop images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crop-images', 'crop-images', true);

-- Storage policies for crop images
CREATE POLICY "Anyone can view crop images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'crop-images');

CREATE POLICY "Authenticated users can upload crop images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'crop-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own crop images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'crop-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own crop images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'crop-images' AND 
  auth.uid() IS NOT NULL
);