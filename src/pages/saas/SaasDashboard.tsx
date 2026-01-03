import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Zap,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon,
  iconColor,
  iconBg
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center gap-1 text-sm">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-muted-foreground">{changeLabel}</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'create' | 'update' | 'delete' | 'view';
}

const recentActivities: RecentActivityItem[] = [
  { id: '1', user: 'John Doe', action: 'created', target: 'New Project', time: '2 min ago', type: 'create' },
  { id: '2', user: 'Jane Smith', action: 'upgraded to', target: 'Pro Plan', time: '15 min ago', type: 'update' },
  { id: '3', user: 'Mike Johnson', action: 'viewed', target: 'Analytics Dashboard', time: '1 hour ago', type: 'view' },
  { id: '4', user: 'Sarah Wilson', action: 'deleted', target: 'Old Template', time: '2 hours ago', type: 'delete' },
  { id: '5', user: 'Tom Brown', action: 'created', target: 'API Integration', time: '3 hours ago', type: 'create' },
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

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  { 
    id: 'new-project', 
    title: 'Create Project', 
    description: 'Start a new AI project',
    icon: Zap,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10'
  },
  { 
    id: 'invite', 
    title: 'Invite Team', 
    description: 'Add collaborators',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    id: 'analytics', 
    title: 'View Analytics', 
    description: 'Check performance',
    icon: Activity,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  { 
    id: 'upgrade', 
    title: 'Upgrade Plan', 
    description: 'Unlock more features',
    icon: TrendingUp,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
];

export const SaasDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$45,231"
          change={20.1}
          changeLabel="from last month"
          icon={DollarSign}
          iconColor="text-green-500"
          iconBg="bg-green-500/10"
        />
        <StatCard
          title="Active Users"
          value="2,350"
          change={15.3}
          changeLabel="from last month"
          icon={Users}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Conversion Rate"
          value="3.24%"
          change={-2.4}
          changeLabel="from last month"
          icon={TrendingUp}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Active Sessions"
          value="573"
          change={8.2}
          changeLabel="from last hour"
          icon={Activity}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>Your resource consumption this month</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Download Report</DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>API Requests</span>
                </div>
                <span className="font-medium">8,432 / 10,000</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Storage Used</span>
                </div>
                <span className="font-medium">4.2 GB / 10 GB</span>
              </div>
              <Progress value={42} className="h-2 [&>div]:bg-blue-500" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>AI Credits</span>
                </div>
                <span className="font-medium">156 / 500</span>
              </div>
              <Progress value={31} className="h-2 [&>div]:bg-green-500" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Team Members</span>
                </div>
                <span className="font-medium">3 / 5</span>
              </div>
              <Progress value={60} className="h-2 [&>div]:bg-amber-500" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
                    <Icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions from your team</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaasDashboard;
