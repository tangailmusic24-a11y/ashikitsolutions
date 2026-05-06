-- Transactions: deny direct insert (force going through create_transaction RPC)
DROP POLICY IF EXISTS "Deny direct insert on transactions" ON public.transactions;
CREATE POLICY "Deny direct insert on transactions"
ON public.transactions
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- Transactions: only admins can delete
DROP POLICY IF EXISTS "Admins can delete transactions" ON public.transactions;
CREATE POLICY "Admins can delete transactions"
ON public.transactions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.get_email_by_username(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_username_exists(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_transaction(text, text, text, text) FROM PUBLIC, anon;

-- Grant create_transaction to authenticated users only (RPC checks auth.uid() internally)
GRANT EXECUTE ON FUNCTION public.create_transaction(text, text, text, text) TO authenticated;

-- check_username_exists is needed by anon during signup flow — grant explicitly
GRANT EXECUTE ON FUNCTION public.check_username_exists(text) TO anon, authenticated;