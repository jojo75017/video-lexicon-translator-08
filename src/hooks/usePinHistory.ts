
import { useState, useEffect } from 'react';
import { PinterestPin } from '@/types/pinterest';

export const usePinHistory = () => {
  const [history, setHistory] = useState<PinterestPin[]>([]);

  // Charger l'historique depuis le localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('pinHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  }, []);

  // Sauvegarder l'historique dans le localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pinHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
  }, [history]);

  // Ajouter un pin à l'historique
  const addPin = (pin: PinterestPin) => {
    setHistory(prevHistory => {
      // Vérifier si le pin existe déjà
      const exists = prevHistory.some(p => 
        p.title === pin.title && 
        p.description === pin.description &&
        ((p.image?.url === pin.image?.url) || (p.uploadedImage === pin.uploadedImage))
      );

      if (exists) {
        return prevHistory;
      }

      // Ajouter le nouveau pin au début de l'historique
      return [pin, ...prevHistory].slice(0, 20); // Limiter à 20 pins
    });
  };

  // Supprimer un pin de l'historique
  const removePin = (index: number) => {
    setHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
  };

  // Vider l'historique
  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addPin, removePin, clearHistory };
};
