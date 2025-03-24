
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsTabContent = () => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate mock traffic data
    const mockTrafficData = Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}/03`,
      visitors: Math.floor(Math.random() * 2000) + 500,
      pageviews: Math.floor(Math.random() * 5000) + 1000,
    }));
    
    // Generate mock source data
    const mockSourceData = [
      { name: 'Recherche organique', value: 45 },
      { name: 'Réseaux sociaux', value: 25 },
      { name: 'Accès direct', value: 15 },
      { name: 'Référencement', value: 10 },
      { name: 'Autres', value: 5 },
    ];
    
    // Generate mock device data
    const mockDeviceData = [
      { name: 'Mobile', value: 68 },
      { name: 'Desktop', value: 27 },
      { name: 'Tablette', value: 5 },
    ];
    
    setTrafficData(mockTrafficData);
    setSourceData(mockSourceData);
    setDeviceData(mockDeviceData);
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Analytics</h3>
      <p className="text-sm text-gray-600">
        Consultez les statistiques et analyses de trafic de votre site web.
      </p>
      
      {trafficData.length > 0 ? (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trafic des 30 derniers jours</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trafficData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} name="Visiteurs" />
                  <Line type="monotone" dataKey="pageviews" stroke="#82ca9d" name="Pages vues" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sources de trafic</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Appareils</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deviceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Pourcentage']}
                    />
                    <Bar dataKey="value" fill="#8884d8">
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistiques importantes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm text-blue-700">Taux de rebond</h4>
                <p className="text-2xl font-bold text-blue-900">42.8%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="text-sm text-green-700">Pages/Session</h4>
                <p className="text-2xl font-bold text-green-900">3.2</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="text-sm text-purple-700">Durée moyenne</h4>
                <p className="text-2xl font-bold text-purple-900">2:45</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h4 className="text-sm text-amber-700">Taux de conversion</h4>
                <p className="text-2xl font-bold text-amber-900">3.6%</p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-4">
          <p className="text-sm">Chargement des données d'analytics...</p>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsTabContent;
