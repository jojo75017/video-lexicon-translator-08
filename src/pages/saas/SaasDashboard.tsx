import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  BarChart3,
  FileText,
  Settings,
  Plus
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon: Icon, description }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        <div className={`flex items-center text-xs ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'positive' ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {change}
        </div>
        {description && (
          <span className="text-xs text-white/60">{description}</span>
        )}
      </div>
    </CardContent>
  </Card>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent transition-colors duration-200 text-left w-full"
  >
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
      <Icon className="h-6 w-6 text-primary-foreground" />
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </button>
);

interface RecentActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'create' | 'update' | 'delete' | 'view';
}

const recentActivities: RecentActivityItem[] = [
  { id: '1', user: 'Jean Dupont', action: 'a créé', target: 'Nouveau Projet', time: 'il y a 2 min', type: 'create' },
  { id: '2', user: 'Marie Martin', action: 'a mis à niveau vers', target: 'Plan Pro', time: 'il y a 15 min', type: 'update' },
  { id: '3', user: 'Pierre Durand', action: 'a consulté', target: 'Tableau Analytique', time: 'il y a 1 heure', type: 'view' },
  { id: '4', user: 'Sophie Leroy', action: 'a supprimé', target: 'Ancien Modèle', time: 'il y a 2 heures', type: 'delete' },
  { id: '5', user: 'Thomas Bernard', action: 'a créé', target: 'Intégration API', time: 'il y a 3 heures', type: 'create' },
];

const getActivityColor = (type: string) => {
  switch (type) {
    case 'create': return 'bg-green-500';
    case 'update': return 'bg-blue-500';
    case 'delete': return 'bg-red-500';
    case 'view': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

interface UsageMetric {
  name: string;
  current: number;
  max: number;
  unit: string;
}

const usageMetrics: UsageMetric[] = [
  { name: 'Appels API', current: 8432, max: 10000, unit: 'requêtes' },
  { name: 'Stockage', current: 2.4, max: 5, unit: 'Go' },
  { name: 'Membres équipe', current: 8, max: 10, unit: 'utilisateurs' },
  { name: 'Projets', current: 12, max: 25, unit: 'projets' },
];

export const SaasDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Bon retour ! Voici ce qui se passe aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            30 derniers jours
          </Button>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Utilisateurs"
          value="2,847"
          change="+12.5%"
          changeType="positive"
          icon={Users}
          description="vs mois dernier"
        />
        <StatCard
          title="Revenus"
          value="45 230€"
          change="+8.2%"
          changeType="positive"
          icon={CreditCard}
          description="vs mois dernier"
        />
        <StatCard
          title="Projets Actifs"
          value="142"
          change="+23.1%"
          changeType="positive"
          icon={TrendingUp}
          description="vs mois dernier"
        />
        <StatCard
          title="Taux de Croissance"
          value="98.5%"
          change="-0.4%"
          changeType="negative"
          icon={Activity}
          description="vs mois dernier"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Raccourcis courants pour accélérer votre workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <QuickAction
                title="Créer un Projet"
                description="Démarrer un nouveau projet"
                icon={Plus}
              />
              <QuickAction
                title="Voir Analytiques"
                description="Consulter les données de performance"
                icon={BarChart3}
              />
              <QuickAction
                title="Générer un Rapport"
                description="Exporter des rapports détaillés"
                icon={FileText}
              />
              <QuickAction
                title="Paramètres Équipe"
                description="Gérer les membres de l'équipe"
                icon={Settings}
              />
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisation</CardTitle>
            <CardDescription>Limites actuelles de votre plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.name}</span>
                  <span className="font-medium">
                    {metric.current} / {metric.max} {metric.unit}
                  </span>
                </div>
                <Progress value={(metric.current / metric.max) * 100} className="h-2" />
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Mettre à niveau le Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Dernières actions de votre équipe</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action} </span>
                    <span className="font-medium">{activity.target}</span>
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaasDashboard;
