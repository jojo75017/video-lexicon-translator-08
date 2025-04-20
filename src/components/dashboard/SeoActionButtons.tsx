
import React from 'react';
import { NewProjectButton } from '../seo/buttons/NewProjectButton';
import { RankingButton } from '../seo/buttons/RankingButton';
import { HealthButton } from '../seo/buttons/HealthButton';
import { AlertsButton } from '../seo/buttons/AlertsButton';
import { DailyUpdatesButton } from '../seo/buttons/DailyUpdatesButton';
import { OrganizeButton } from '../seo/buttons/OrganizeButton';
import MapButton from '../seo/buttons/MapButton';
import { Card } from '@/components/ui/card';
import { FileText, Eye, PieChart, Map, Bell, BarChart2, FolderTree, Languages, Upload, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SeoActionButtons = () => {
  return (
    <Card className="p-6 shadow-lg mb-8 border-0 bg-gradient-to-br from-light-green-50 to-light-green-100">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-primary-600 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800">Outils SEO essentiels</h2>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">9 outils disponibles</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4">
        <ToolButton 
          icon={<FileText className="h-5 w-5 text-emerald-600" />}
          label="Nouveau"
          component={<NewProjectButton />}
        />
        <ToolButton 
          icon={<BarChart2 className="h-5 w-5 text-blue-600" />}
          label="Positions"
          component={<RankingButton />}
        />
        <ToolButton 
          icon={<Eye className="h-5 w-5 text-indigo-600" />}
          label="Audit"
          component={<HealthButton />}
        />
        <ToolButton 
          icon={<Map className="h-5 w-5 text-amber-600" />}
          label="Carte"
          component={<MapButton />}
        />
        <ToolButton 
          icon={<Bell className="h-5 w-5 text-rose-600" />}
          label="Alertes"
          component={<AlertsButton />}
        />
        <ToolButton 
          icon={<PieChart className="h-5 w-5 text-purple-600" />}
          label="Mises à jour"
          component={<DailyUpdatesButton />}
        />
        <ToolButton 
          icon={<FolderTree className="h-5 w-5 text-teal-600" />}
          label="Structure"
          component={<OrganizeButton />}
        />
        <Link to="/translation" className="block">
          <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm transition-all duration-200 cursor-pointer hover:border-indigo-300 hover:shadow-md hover:translate-y-[-2px] relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">Nouveau</span>
            <div className="mb-2 p-2.5 bg-indigo-100 rounded-full shadow-inner">
              <Languages className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-indigo-700">Traduction</span>
            <span className="text-xs text-indigo-500 flex items-center mt-1">
              <Upload className="h-3 w-3 mr-1" />
              URL/Fichier
            </span>
          </div>
        </Link>

        {/* Nouveau bouton Title & Meta avec mise en évidence */}
        <Link to="/keyword-meta" className="block">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm transition-all duration-200 cursor-pointer hover:border-blue-300 hover:shadow-md hover:translate-y-[-2px] relative">
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">SEO</span>
            <div className="mb-2 p-2.5 bg-blue-100 rounded-full shadow-inner">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-700">Title & Meta</span>
            <span className="text-xs text-blue-500 flex items-center mt-1">
              60/155 caract.
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-6 flex justify-center">
        <Button 
          variant="secondary"
          className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700"
          asChild
        >
          <Link to="/keyword-meta" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Optimiser vos balises Title & Meta
          </Link>
        </Button>
      </div>
    </Card>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  component: React.ReactNode;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, component }) => {
  // Enhanced professional styling
  return (
    <div className="group relative">
      <div className="absolute inset-0 z-10 opacity-0">
        {component}
      </div>
      <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm transition-all duration-200 cursor-pointer group-hover:border-gray-200 group-hover:shadow-md group-hover:translate-y-[-2px]">
        <div className="mb-2 p-2.5 bg-gray-50 rounded-full shadow-inner">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
};

export default SeoActionButtons;
