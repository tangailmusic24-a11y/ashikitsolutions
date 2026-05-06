
-- 1) Server-side transaction creation RPC (prevents amount manipulation)
CREATE OR REPLACE FUNCTION public.create_transaction(
  _package_id text,
  _method text,
  _transaction_id text,
  _mobile text
)
RETURNS public.transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _price numeric;
  _name_en text;
  _user_name text;
  _row public.transactions;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _method IS NULL OR length(trim(_method)) = 0 THEN
    RAISE EXCEPTION 'method required';
  END IF;
  IF _transaction_id IS NULL OR length(trim(_transaction_id)) = 0 THEN
    RAISE EXCEPTION 'transaction_id required';
  END IF;
  IF _mobile IS NULL OR length(trim(_mobile)) = 0 THEN
    RAISE EXCEPTION 'mobile required';
  END IF;

  -- Look up canonical price from packages first, then shop_items
  SELECT price, name_en INTO _price, _name_en FROM public.packages WHERE id::text = _package_id;
  IF _price IS NULL THEN
    SELECT price, name_en INTO _price, _name_en FROM public.shop_items WHERE id::text = _package_id;
  END IF;
  IF _price IS NULL THEN
    RAISE EXCEPTION 'Invalid package_id';
  END IF;

  SELECT COALESCE(full_name, username, email) INTO _user_name FROM public.profiles WHERE user_id = _uid;

  INSERT INTO public.transactions (user_id, user_name, package_id, package_name, amount, method, transaction_id, mobile, status)
  VALUES (_uid, COALESCE(_user_name, ''), _package_id, COALESCE(_name_en, ''), _price, _method, _transaction_id, _mobile, 'pending')
  RETURNING * INTO _row;

  RETURN _row;
END;
$$;

REVOKE ALL ON FUNCTION public.create_transaction(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_transaction(text, text, text, text) TO authenticated;

-- Remove client INSERT capability so amount cannot be forged
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;

-- 2) Lock down SECURITY DEFINER helper functions from direct API calls
REVOKE EXECUTE ON FUNCTION public.get_email_by_username(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_username_exists(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 3) Restrict listing of shop-images bucket (public URLs still work; only listing blocked)
DROP POLICY IF EXISTS "Anyone can view shop images" ON storage.objects;
