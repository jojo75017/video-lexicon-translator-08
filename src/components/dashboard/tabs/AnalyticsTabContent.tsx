
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, PieChart, TrendingUp, Users, 
  Globe, Clock, ArrowUpRight, ExternalLink 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sample data for charts
const visitData = [
  { name: 'Jan', visits: 400 },
  { name: 'Feb', visits: 300 },
  { name: 'Mar', visits: 600 },
  { name: 'Apr', visits: 800 },
  { name: 'May', visits: 700 },
  { name: 'Jun', visits: 900 },
  { name: 'Jul', visits: 1100 },
];

const pageViewData = [
  { name: 'Home', views: 1200 },
  { name: 'About', views: 800 },
  { name: 'Services', views: 1500 },
  { name: 'Blog', views: 2200 },
  { name: 'Contact', views: 600 },
];

const AnalyticsTabContent: React.FC = () => {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analyse du trafic</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">7 jours</Button>
          <Button variant="outline" size="sm">30 jours</Button>
          <Button variant="outline" size="sm">90 jours</Button>
          <Button variant="default" size="sm">Personnalisé</Button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Visiteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">24,892</div>
              <div className="text-xs text-green-500 flex items-center font-medium">
                +12.5%
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pages vues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">78,349</div>
              <div className="text-xs text-green-500 flex items-center font-medium">
                +8.2%
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Taux de rebond</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">36.5%</div>
              <div className="text-xs text-red-500 flex items-center font-medium">
                +2.1%
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">3m 42s</div>
              <div className="text-xs text-green-500 flex items-center font-medium">
                +0.8%
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
          </CardContent>
        </Card>
      </div>

      {/* Visitors trend chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendance des visites</CardTitle>
          <CardDescription>Nombre de visiteurs au cours du temps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visitData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#4f46e5" 
                  fillOpacity={1} 
                  fill="url(#visitGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two column layout for additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pages les plus visitées</CardTitle>
            <CardDescription>Nombre de vues par page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pageViewData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={50} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sources de trafic</CardTitle>
            <CardDescription>D'où viennent vos visiteurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {/* Traffic sources list */}
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-blue-500 mr-3" />
                    <span>Direct</span>
                  </div>
                  <div className="font-medium">42%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-green-500 mr-3" />
                    <span>Organic Search</span>
                  </div>
                  <div className="font-medium">28%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-500 mr-3" />
                    <span>Social Media</span>
                  </div>
                  <div className="font-medium">18%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-amber-500 mr-3" />
                    <span>Referral</span>
                  </div>
                  <div className="font-medium">12%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional information */}
      <Card>
        <CardHeader>
          <CardTitle>Insights et Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Opportunité de croissance</h3>
              <p className="text-sm text-blue-700">
                Vos articles de blog génèrent 45% de vos visiteurs. Envisagez d'augmenter votre fréquence de publication pour accroître votre audience.
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <h3 className="font-medium text-amber-800 mb-2">Attention requise</h3>
              <p className="text-sm text-amber-700">
                Le taux de rebond sur mobile est 15% plus élevé que sur desktop. Optimisez l'expérience mobile pour améliorer l'engagement.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              Exporter le rapport complet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTabContent;
