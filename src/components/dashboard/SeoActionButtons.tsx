
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
    <Card className="p-8 shadow-xl bg-white border-0 mb-8">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Outils SEO essentiels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
