import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Crown, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Subscriber { id: string; email: string; plan_type: string; plan_tier: string; status: string; created_at: string; }

export const SubscriberActivityPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [vipCount, setVipCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'admin').single();
          setIsAdmin(!!data);
        }
      } catch (error) { console.error('Error checking admin status:', error); }
    };
    checkAdmin();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const { count: total } = await supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { data: vipData } = await supabase.rpc('count_vip_subscribers');
      const { data: recentSubs, error } = await supabase.from('subscribers').select('id, email, plan_type, plan_tier, status, created_at').eq('status', 'active').order('created_at', { ascending: false }).limit(10);
      if (error) throw error;
      setTotalCount(total || 0); setVipCount(vipData || 0); setSubscribers(recentSubs || []);
    } catch (error) { console.error('Error fetching subscribers:', error); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (isAdmin) { fetchSubscribers(); const interval = setInterval(fetchSubscribers, 30000); return () => clearInterval(interval); }
  }, [isAdmin]);

  if (!isAdmin) return null;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  const maskEmail = (email: string) => { const [local, domain] = email.split('@'); if (local.length <= 2) return email; return `${local.slice(0, 2)}***@${domain}`; };
  const getPlanBadge = (planType: string, planTier: string) => {
    if (planTier === 'vip') return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">VIP 67€</Badge>;
    if (planType === 'lifetime') return <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">Lifetime</Badge>;
    if (planType === 'pro') return <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">Pro 47€</Badge>;
    return <Badge className="bg-muted text-muted-foreground text-[10px]">{planType}</Badge>;
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 right-4 z-[9999] p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setIsVisible(!isVisible)}
      >
        <Users className="w-6 h-6" />
        {totalCount > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-background">
            {totalCount > 99 ? '99+' : totalCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-16 right-4 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-foreground" />
                <span className="text-primary-foreground font-semibold text-sm">Abonnés Actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIsVisible(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-muted/50 grid grid-cols-2 gap-3">
              <div className="bg-card rounded-lg p-2 text-center border border-border">
                <div className="text-2xl font-bold text-foreground">{totalCount}</div>
                <div className="text-xs text-muted-foreground">Total abonnés</div>
              </div>
              <div className="bg-amber-500/5 rounded-lg p-2 text-center border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  <Crown className="w-4 h-4" />{vipCount}
                </div>
                <div className="text-xs text-amber-600/70">VIP (67€)</div>
              </div>
            </div>

            <div className="px-3 py-2 bg-muted/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Offre Fondateur:</span>
                <span className="font-bold text-green-600">Active (60 jours)</span>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-3 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2">Derniers abonnés:</div>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-4"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div></div>
                    ) : subscribers.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">Aucun abonné pour le moment</div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {subscribers.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-2 text-xs">
                            <div className="flex-1 min-w-0">
                              <div className="text-foreground truncate">{maskEmail(sub.email)}</div>
                              <div className="text-muted-foreground">{formatDate(sub.created_at)}</div>
                            </div>
                            {getPlanBadge(sub.plan_type, sub.plan_tier)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="px-3 py-2 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Actualisation auto: 30s</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary hover:text-primary/80" onClick={fetchSubscribers}>Actualiser</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubscriberActivityPopup;
