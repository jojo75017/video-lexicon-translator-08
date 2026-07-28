import React from 'react';
import ProBookTierBadge from './ProBookTierBadge';
import type { ProBookModule } from './proBookLimits';

interface Props {
  module: ProBookModule;
  children: React.ReactNode;
}

/**
 * Enveloppe visuelle unifiée pour les modules Documentaire, Atlas,
 * Cuisine et Voyage. Ajoute le badge de niveau (Standard/Pro) au-dessus
 * du générateur existant sans altérer sa logique.
 */
export const ProBookShell: React.FC<Props> = ({ module, children }) => {
  return (
    <div>
      <ProBookTierBadge module={module} />
      {children}
    </div>
  );
};

export default ProBookShell;
