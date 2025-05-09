
import React from 'react';
import { PieChart } from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ResourcesChartProps } from './types';
import { formatSize, CHART_COLORS } from './utils';

const ResourcesChart: React.FC<ResourcesChartProps> = ({ 
  activeDevice, 
  resourcesData 
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <PieChart className="w-4 h-4 mr-2 text-blue-600" />
        <h4 className="font-medium">
          {activeDevice === 'mobile' ? 'Répartition des ressources (Mobile)' : 'Répartition des ressources (Desktop)'}
        </h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={resourcesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {resourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatSize(Number(value))} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="col-span-2 space-y-3">
          <h5 className="font-medium text-sm">Détail des ressources:</h5>
          {resourcesData.map((resource, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                ></div>
                <span>{resource.name}</span>
              </div>
              <span className="font-medium">{formatSize(resource.value)}</span>
            </div>
          ))}
          
          <div className="flex items-center justify-between text-sm font-bold pt-2 border-t mt-2">
            <span>Total</span>
            <span>
              {formatSize(resourcesData.reduce((sum, item) => sum + item.value, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesChart;
