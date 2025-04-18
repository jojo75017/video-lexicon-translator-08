
import React, { useEffect, useRef } from 'react';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import MainTabList from './tabs/MainTabList';
import SubTabList from './tabs/SubTabList';
import { activateSection } from '@/utils/navigationHelpers';
import { useLocation } from 'react-router-dom';

const TabNavigation = () => {
  const { 
    activeTab, 
    mainTabs, 
    subTabs, 
    handleTabChange 
  } = useTabNavigation();
  
  const location = useLocation();
  const initialRender = useRef(true);

  // Activer l'onglet courant au premier rendu
  useEffect(() => {
    if (initialRender.current && activeTab) {
      console.log('Premier rendu de TabNavigation, activation de section:', activeTab);
      
      // Donner un peu de temps au DOM pour charger
      const timer = setTimeout(() => {
        activateSection(activeTab);
        console.log('TabNavigation: Activation initiale de section:', activeTab);
        initialRender.current = false;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Activer l'onglet lors du changement d'onglet actif
  useEffect(() => {
    if (!initialRender.current && activeTab) {
      console.log('Changement d\'onglet actif détecté:', activeTab);
      setTimeout(() => {
        activateSection(activeTab);
      }, 200);
    }
  }, [activeTab]);

  // Gérer les changements d'URL pour la navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    
    if (hash) {
      console.log(`Hash détecté dans l'URL: ${hash}, activation de la section`);
      setTimeout(() => {
        activateSection(hash);
      }, 200);
    }
  }, [location]);

  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale et sous-navigation</h2>
      <MainTabList 
        mainTabs={mainTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      <SubTabList 
        tabs={subTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

export default TabNavigation;
