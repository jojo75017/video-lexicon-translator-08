
import React from 'react';
import { NewProjectButton } from '../seo/buttons/NewProjectButton';
import { RankingButton } from '../seo/buttons/RankingButton';
import { DailyUpdatesButton } from '../seo/buttons/DailyUpdatesButton';
import { AlertsButton } from '../seo/buttons/AlertsButton';
import { HealthButton } from '../seo/buttons/HealthButton';
import { OrganizeButton } from '../seo/buttons/OrganizeButton';

const SeoActionButtons = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <NewProjectButton />
      <RankingButton />
      <DailyUpdatesButton />
      <AlertsButton />
      <HealthButton />
      <OrganizeButton />
    </div>
  );
};

export default SeoActionButtons;
