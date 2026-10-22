ALTER TABLE public.v3_installment_orders ADD COLUMN IF NOT EXISTS paid_invoice_ids text[] NOT NULL DEFAULT '{}';
CREATE OR REPLACE FUNCTION public.claim_installment_invoice(order_uuid uuid, invoice_id text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE claimed uuid;
BEGIN
  IF invoice_id IS NULL OR invoice_id = '' THEN RETURN false; END IF;
  UPDATE public.v3_installment_orders SET paid_invoice_ids = array_append(paid_invoice_ids, invoice_id) WHERE id = order_uuid AND NOT (invoice_id = ANY(paid_invoice_ids)) RETURNING id INTO claimed;
  RETURN claimed IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_installment_invoice(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_installment_invoice(uuid, text) TO service_role;