
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  mobile TEXT DEFAULT '',
  address TEXT DEFAULT '',
  nid_number TEXT DEFAULT '',
  nid_front TEXT DEFAULT '',
  nid_back TEXT DEFAULT '',
  profile_picture TEXT DEFAULT '',
  cover_picture TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_bn TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  features_bn TEXT[] DEFAULT '{}',
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Packages viewable by everyone" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Admins can insert packages" ON public.packages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update packages" ON public.packages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete packages" ON public.packages FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_bn TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notices viewable by everyone" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Admins can insert notices" ON public.notices FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update notices" ON public.notices FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete notices" ON public.notices FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '',
  package_id TEXT NOT NULL DEFAULT '',
  package_name TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT '',
  transaction_id TEXT NOT NULL DEFAULT '',
  mobile TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update transactions" ON public.transactions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Shop items table
CREATE TABLE public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_bn TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT DEFAULT '',
  category TEXT DEFAULT '',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shop items viewable by everyone" ON public.shop_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert shop items" ON public.shop_items FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update shop items" ON public.shop_items FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete shop items" ON public.shop_items FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_shop_items_updated_at BEFORE UPDATE ON public.shop_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Social services table
CREATE TABLE public.social_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  service_type TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_bn TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  min_quantity INT NOT NULL DEFAULT 1,
  max_quantity INT NOT NULL DEFAULT 1000,
  unit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.social_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social services viewable by everyone" ON public.social_services FOR SELECT USING (true);
CREATE POLICY "Admins can insert social services" ON public.social_services FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update social services" ON public.social_services FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete social services" ON public.social_services FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_social_services_updated_at BEFORE UPDATE ON public.social_services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', true);

CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT
USING (bucket_id = 'user-uploads');

CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
