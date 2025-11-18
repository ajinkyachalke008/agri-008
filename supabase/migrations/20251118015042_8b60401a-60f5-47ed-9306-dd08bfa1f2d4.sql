-- User Profiles Table (stores farm location & preferences)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  preferred_language TEXT DEFAULT 'en',
  
  -- Farm Location
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  district TEXT NOT NULL,
  taluka TEXT,
  village TEXT,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Farm Details
  farm_size DECIMAL(10, 2),
  farm_size_unit TEXT DEFAULT 'acres',
  primary_crops TEXT[],
  
  -- Notification Preferences
  weather_alerts_enabled BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  whatsapp_notifications BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT false,
  alert_types TEXT[] DEFAULT ARRAY['rain', 'storm', 'frost', 'heatwave', 'high_wind'],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather Alerts History Table
CREATE TABLE public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  title_mr TEXT,
  message TEXT NOT NULL,
  message_mr TEXT,
  temperature DECIMAL(5, 2),
  rainfall_mm DECIMAL(6, 2),
  wind_speed DECIMAL(5, 2),
  humidity INTEGER,
  recommendations JSONB,
  crop_specific_advice JSONB,
  sent_at TIMESTAMPTZ,
  sms_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  weather_data JSONB,
  forecast_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather Preferences
CREATE TABLE public.weather_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  min_severity TEXT DEFAULT 'medium',
  enabled BOOLEAN DEFAULT true,
  time_window_start TIME DEFAULT '06:00:00',
  time_window_end TIME DEFAULT '21:00:00',
  UNIQUE(user_id, alert_type)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own alerts" ON public.weather_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.weather_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own preferences" ON public.weather_notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON public.weather_notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, phone, email, district)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'), COALESCE(NEW.raw_user_meta_data->>'phone', ''), NEW.email, COALESCE(NEW.raw_user_meta_data->>'district', 'Pune'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();