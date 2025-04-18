
import { useState, useEffect } from 'react';
import { PinterestPin } from '@/types/pinterest';
import { toast } from 'sonner';

export const usePinHistory = () => {
  const [pinHistory, setPinHistory] = useState<PinterestPin[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('pinHistory');
    if (savedHistory) {
      setPinHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (pin: PinterestPin) => {
    const newHistory = [pin, ...pinHistory.slice(0, 9)];
    setPinHistory(newHistory);
    localStorage.setItem('pinHistory', JSON.stringify(newHistory));
    toast.success('Pin sauvegardé dans l\'historique');
  };

  const removePin = (index: number) => {
    const newHistory = [...pinHistory];
    newHistory.splice(index, 1);
    setPinHistory(newHistory);
    localStorage.setItem('pinHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setPinHistory([]);
    localStorage.removeItem('pinHistory');
  };

  const restoreFromHistory = (historicPin: PinterestPin) => {
    setShowHistory(false);
    return historicPin;
  };

  // Pour la compatibilité avec l'ancien code
  const addPin = saveToHistory;
  
  return {
    history: pinHistory,  // Pour compatibilité avec l'ancien code
    pinHistory,
    showHistory,
    setShowHistory,
    saveToHistory,
    addPin,            // Alias pour saveToHistory
    removePin,
    clearHistory,
    restoreFromHistory
  };
};
