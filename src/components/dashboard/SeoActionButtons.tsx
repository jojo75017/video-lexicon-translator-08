
import React, { useState } from 'react';
import { NewProjectButton } from '../seo/buttons/NewProjectButton';
import { RankingButton } from '../seo/buttons/RankingButton';
import { DailyUpdatesButton } from '../seo/buttons/DailyUpdatesButton';
import { AlertsButton } from '../seo/buttons/AlertsButton';
import { HealthButton } from '../seo/buttons/HealthButton';
import { OrganizeButton } from '../seo/buttons/OrganizeButton';
import { MapButton } from '../seo/buttons/MapButton';
import MapModal from '../seo/MapModal';

const SeoActionButtons = () => {
  const [showMap, setShowMap] = useState(false);

  const handleOpenMap = () => {
    console.log("Opening map modal");
    setShowMap(true);
  };

  const handleCloseMap = () => {
    console.log("Closing map modal");
    setShowMap(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        <NewProjectButton />
        <RankingButton />
        <DailyUpdatesButton />
        <AlertsButton />
        <HealthButton />
        <OrganizeButton />
        <MapButton onClick={handleOpenMap} />
      </div>

      {/* Mount the MapModal only when needed */}
      {showMap && (
        <MapModal 
          isOpen={showMap}
          onClose={handleCloseMap}
          title="Créer une carte interactive"
        />
      )}
    </>
  );
};

export default SeoActionButtons;
