
import React from 'react';
import { NewProjectButton } from '../seo/buttons/NewProjectButton';
import { RankingButton } from '../seo/buttons/RankingButton';
import { HealthButton } from '../seo/buttons/HealthButton';
import { AlertsButton } from '../seo/buttons/AlertsButton';
import { DailyUpdatesButton } from '../seo/buttons/DailyUpdatesButton';
import { OrganizeButton } from '../seo/buttons/OrganizeButton';
import MapButton from '../seo/buttons/MapButton';
import { Card } from '@/components/ui/card';

const SeoActionButtons = () => {
  return (
    <Card className="p-6 shadow-md mb-8 border-0 bg-gradient-to-br from-white to-gray-50">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800">Outils SEO essentiels</h2>
        </div>
        <span className="text-sm text-gray-500">7 outils disponibles</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <NewProjectButton />
        <RankingButton />
        <HealthButton />
        <MapButton />
        <AlertsButton />
        <DailyUpdatesButton />
        <OrganizeButton />
      </div>
    </Card>
  );
};

export default SeoActionButtons;
