import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Flame, Snowflake, TrendingUp, DollarSign } from 'lucide-react';

interface CrmStatsProps {
  stats: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    leads: number;
    clients: number;
    converted: number;
    lost: number;
    totalRevenue: number;
  };
}

export const CrmStats: React.FC<CrmStatsProps> = ({ stats }) => {
  const cards = [
    { label: 'Total contacts', value: stats.total, icon: Users, color: 'text-primary' },
    { label: 'Prospects chauds 🔵', value: stats.hot, icon: Flame, color: 'text-blue-500' },
    { label: 'Prospects tièdes', value: stats.warm, icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Prospects froids ⚫', value: stats.cold, icon: Snowflake, color: 'text-gray-500' },
    { label: 'Clients actifs', value: stats.clients, icon: Users, color: 'text-emerald-500' },
    { label: 'Revenu total', value: `${stats.totalRevenue}€`, icon: DollarSign, color: 'text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
