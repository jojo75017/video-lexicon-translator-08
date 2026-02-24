import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReferralStats {
  total_referrals: number;
  pending: number;
  converted: number;
  total_commission: number;
  unpaid_commission: number;
  paid_commission: number;
}

export function useReferral() {
  const [code, setCode] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCode = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.functions.invoke('track-referral', {
      body: { action: 'get_code', user_id: user.id },
    });
    if (data?.code) setCode(data.code);
  };

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.functions.invoke('track-referral', {
      body: { action: 'stats', user_id: user.id },
    });
    if (data) setStats(data);
  };

  const fetchReferrals = async () => {
    const { data } = await supabase
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setReferrals(data);
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchCode(), fetchStats(), fetchReferrals()]);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const getReferralLink = () => {
    if (!code) return '';
    return `${window.location.origin}/offres?ref=${code}`;
  };

  return { code, stats, referrals, loading, getReferralLink, refresh: loadAll };
}
