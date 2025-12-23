-- Drop existing policies first (all possible names)
DROP POLICY IF EXISTS "Users can update their own crop images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own crop images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update crop images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete crop images" ON storage.objects;

-- Create secure UPDATE policy with ownership check
CREATE POLICY "Secure update crop images with ownership"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'crop-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'crop-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create secure DELETE policy with ownership check
CREATE POLICY "Secure delete crop images with ownership"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'crop-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update handle_new_user function to add input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_full_name TEXT;
  v_phone TEXT;
  v_district TEXT;
BEGIN
  -- Validate and sanitize full_name (max 100 chars, default to 'Farmer')
  v_full_name := COALESCE(
    LEFT(TRIM(NEW.raw_user_meta_data->>'full_name'), 100),
    'Farmer'
  );
  IF v_full_name = '' THEN
    v_full_name := 'Farmer';
  END IF;
  
  -- Validate and sanitize phone (only digits and +, max 15 chars)
  v_phone := COALESCE(
    REGEXP_REPLACE(LEFT(NEW.raw_user_meta_data->>'phone', 15), '[^0-9+]', '', 'g'),
    ''
  );
  
  -- Validate district (max 50 chars, default to 'Pune')
  v_district := COALESCE(
    LEFT(TRIM(NEW.raw_user_meta_data->>'district'), 50),
    'Pune'
  );
  IF v_district = '' THEN
    v_district := 'Pune';
  END IF;

  INSERT INTO public.user_profiles (user_id, full_name, phone, email, district)
  VALUES (NEW.id, v_full_name, v_phone, NEW.email, v_district);
  
  RETURN NEW;
END;
$function$;

-- Fix update_updated_at_column function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;