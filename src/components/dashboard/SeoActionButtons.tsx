
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
    <Card className="p-6 shadow-md bg-white border-0 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-1 h-5 bg-green-500 rounded-full mr-3"></span>
        Outils SEO essentiels
      </h2>
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
