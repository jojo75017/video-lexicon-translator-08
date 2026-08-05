UPDATE sales_prospects
SET status = 'active',
    auto_send = true,
    current_step = 0,
    next_email_at = NOW(),
    completed = false
WHERE status = 'archived'
  AND unsubscribed = false;
