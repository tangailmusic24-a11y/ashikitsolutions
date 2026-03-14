
CREATE OR REPLACE FUNCTION public.check_username_exists(_username text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE username = _username);
$$;
