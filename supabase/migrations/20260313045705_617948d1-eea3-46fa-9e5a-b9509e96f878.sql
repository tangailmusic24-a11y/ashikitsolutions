
-- 1. Fix profiles: restrict SELECT to owner + admin only
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 2. Create RPC for username lookup (used by login, no auth required)
CREATE OR REPLACE FUNCTION public.get_email_by_username(_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE username = _username LIMIT 1;
$$;

-- 3. Fix transactions: force status='pending' on insert
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
  );

-- 4. Storage: make user-uploads private
UPDATE storage.buckets SET public = false WHERE id = 'user-uploads';

-- 5. Fix storage SELECT policy to owner + admin only
DROP POLICY IF EXISTS "Anyone can view uploads" ON storage.objects;

CREATE POLICY "Owner or admin can view files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- 6. Create a separate public bucket for shop images
INSERT INTO storage.buckets (id, name, public)
  VALUES ('shop-images', 'shop-images', true)
  ON CONFLICT (id) DO NOTHING;

-- 7. RLS for shop-images bucket
CREATE POLICY "Anyone can view shop images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-images');

CREATE POLICY "Admins can upload shop images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'shop-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update shop images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'shop-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete shop images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'shop-images'
    AND public.has_role(auth.uid(), 'admin')
  );
