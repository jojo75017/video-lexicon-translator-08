
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Image, Code, Palette } from 'lucide-react';

interface ResourceBreakdown {
  js: number;
  css: number;
  images: number;
  fonts: number;
  other: number;
}

interface ResourcesChartProps {
  resources: ResourceBreakdown;
  totalSize: number;
}

const ResourcesChart: React.FC<ResourcesChartProps> = ({ resources, totalSize }) => {
  const formatSize = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)}MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(0)}KB`;
    return `${bytes}B`;
  };

  const chartData = [
    { name: 'JavaScript', value: resources.js, color: '#f59e0b', icon: Code },
    { name: 'Images', value: resources.images, color: '#10b981', icon: Image },
    { name: 'CSS', value: resources.css, color: '#3b82f6', icon: Palette },
    { name: 'Fonts', value: resources.fonts, color: '#8b5cf6', icon: FileText },
    { name: 'Autres', value: resources.other, color: '#6b7280', icon: FileText }
  ].filter(item => item.value > 0);

  const barData = chartData.map(item => ({
    name: item.name,
    size: item.value,
    percentage: ((item.value / totalSize) * 100).toFixed(1)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Répartition par type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatSize(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taille des ressources</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatSize} />
              <Tooltip 
                formatter={(value: number) => [formatSize(value), 'Taille']}
                labelFormatter={(label) => `Type: ${label}`}
              />
              <Bar dataKey="size" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Détails des ressources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {chartData.map((resource, index) => {
              const IconComponent = resource.icon;
              const percentage = ((resource.value / totalSize) * 100).toFixed(1);
              
              return (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <IconComponent className="h-6 w-6 mx-auto mb-2" style={{ color: resource.color }} />
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-gray-600">{formatSize(resource.value)}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesChart;
