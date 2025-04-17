
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

  const restoreFromHistory = (historicPin: PinterestPin) => {
    setShowHistory(false);
    return historicPin;
  };

  return {
    pinHistory,
    showHistory,
    setShowHistory,
    saveToHistory,
    restoreFromHistory
  };
};
