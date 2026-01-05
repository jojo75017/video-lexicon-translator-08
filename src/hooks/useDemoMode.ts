import { useState, useCallback } from 'react';

export interface DemoLimits {
  canGeneratePlan: boolean;
  canViewChapters: boolean;
  canExport: boolean;
  canGenerateCover: boolean;
  canUseAdvancedFeatures: boolean;
  plansGenerated: number;
  maxPlansInDemo: number;
}

export const useDemoMode = (isAuthenticated: boolean) => {
  const [plansGenerated, setPlansGenerated] = useState(() => {
    const stored = localStorage.getItem('demo_plans_generated');
    return stored ? parseInt(stored, 10) : 0;
  });

  const isDemo = !isAuthenticated;

  const limits: DemoLimits = {
    canGeneratePlan: isDemo ? plansGenerated < 3 : true,
    canViewChapters: !isDemo,
    canExport: !isDemo,
    canGenerateCover: !isDemo,
    canUseAdvancedFeatures: !isDemo,
    plansGenerated,
    maxPlansInDemo: 3,
  };

  const incrementPlanCount = useCallback(() => {
    if (isDemo) {
      const newCount = plansGenerated + 1;
      setPlansGenerated(newCount);
      localStorage.setItem('demo_plans_generated', newCount.toString());
    }
  }, [isDemo, plansGenerated]);

  const resetDemoLimits = useCallback(() => {
    setPlansGenerated(0);
    localStorage.removeItem('demo_plans_generated');
  }, []);

  return {
    isDemo,
    limits,
    incrementPlanCount,
    resetDemoLimits,
  };
};
