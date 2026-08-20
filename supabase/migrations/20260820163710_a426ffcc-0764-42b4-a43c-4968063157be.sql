-- Mise à jour des logs d'envoi de l'étape 1 pour permettre le renvoi corrigé
UPDATE email_send_log
SET status = 'failed',
    error_message = COALESCE(error_message || ' | ', '') || 'correction - renvoi prévu le 2026-08-20'
WHERE template_name = 'rappel-47-1'
  AND status IN ('sent', 'delivered');

-- Remise à zéro des prospects actifs pour recevoir à nouveau l'étape 1
UPDATE sales_prospects
SET current_step = 0,
    next_email_at = NOW(),
    last_email_sent_at = NULL,
    completed = false
WHERE status = 'active'
  AND unsubscribed = false
  AND auto_send = true
  AND completed = false;
