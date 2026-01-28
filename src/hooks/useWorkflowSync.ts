import { useCallback, useEffect, useState } from 'react';
import { useWorkflowResults, WorkflowResult } from './useWorkflowResults';

export interface WorkflowData {
  title: string;
  authorName: string;
  description: string;
  targetAudience: string;
  genre: string;
  numberOfChapters: number;
  chapterLength: string;
  characters: Array<{ name: string; role: string; description?: string }>;
  chapters: Array<{ title: string; content?: string }>;
  kdpKeywords: string[];
  kdpCategories: string[];
  marketAnalysis: any;
  editorialAnalysis: any;
}

const WORKFLOW_DATA_KEY = 'ebook_workflow_sync_data';

export const useWorkflowSync = () => {
  const { results, getStepResult, hasStepResult, saveStepResult } = useWorkflowResults();
  const [syncedData, setSyncedData] = useState<Partial<WorkflowData>>({});

  // Load synced data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WORKFLOW_DATA_KEY);
      if (saved) {
        setSyncedData(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading workflow sync data:', e);
    }
  }, []);

  // Save synced data to localStorage
  const saveSyncedData = useCallback((data: Partial<WorkflowData>) => {
    setSyncedData(prev => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem(WORKFLOW_DATA_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving workflow sync data:', e);
      }
      return updated;
    });
  }, []);

  // Extract title from P1 (Editorial Director) result
  const getTitleFromP1 = useCallback((): string | null => {
    const p1Result = getStepResult('P1');
    if (!p1Result?.result) return null;
    
    try {
      const data = typeof p1Result.result === 'string' 
        ? JSON.parse(p1Result.result) 
        : p1Result.result;
      
      // Check various possible locations for the title
      if (data.analysis?.suggestionsTitle?.[0]?.titre) {
        return data.analysis.suggestionsTitle[0].titre;
      }
      if (data.titre) return data.titre;
      if (data.title) return data.title;
      
      return null;
    } catch {
      return null;
    }
  }, [getStepResult]);

  // Extract market data from P2 result
  const getMarketDataFromP2 = useCallback(() => {
    const p2Result = getStepResult('P2');
    if (!p2Result?.result) return null;
    
    try {
      const data = typeof p2Result.result === 'string' 
        ? JSON.parse(p2Result.result) 
        : p2Result.result;
      
      return {
        keywords: data.keywords || data.motsClésKDP || [],
        categories: data.categories || data.categoriesKDP || [],
        nicheScore: data.nicheScore || data.score,
        competition: data.competition,
      };
    } catch {
      return null;
    }
  }, [getStepResult]);

  // Extract chapters structure from P3 result
  const getStructureFromP3 = useCallback(() => {
    const p3Result = getStepResult('P3');
    if (!p3Result?.result) return null;
    
    try {
      const data = typeof p3Result.result === 'string' 
        ? JSON.parse(p3Result.result) 
        : p3Result.result;
      
      return {
        chapters: data.chapters || data.chapitres || [],
        characters: data.characters || data.personnages || [],
      };
    } catch {
      return null;
    }
  }, [getStepResult]);

  // Extract written content from P4 result
  const getContentFromP4 = useCallback(() => {
    const p4Result = getStepResult('P4');
    if (!p4Result?.result) return null;
    
    try {
      const data = typeof p4Result.result === 'string' 
        ? JSON.parse(p4Result.result) 
        : p4Result.result;
      
      return {
        chapters: data.chapters || data.chapitres || [],
        preface: data.preface,
        conclusion: data.conclusion,
      };
    } catch {
      return null;
    }
  }, [getStepResult]);

  // Sync data for a specific step
  const syncDataForStep = useCallback((stepId: string): Partial<WorkflowData> => {
    const data: Partial<WorkflowData> = { ...syncedData };

    // Always try to get latest data from previous steps
    if (stepId !== 'P1') {
      const title = getTitleFromP1();
      if (title) data.title = title;
    }

    if (['P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14'].includes(stepId)) {
      const marketData = getMarketDataFromP2();
      if (marketData) {
        data.marketAnalysis = marketData;
        data.kdpKeywords = marketData.keywords;
        data.kdpCategories = marketData.categories;
      }
    }

    if (['P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14'].includes(stepId)) {
      const structure = getStructureFromP3();
      if (structure) {
        data.chapters = structure.chapters;
        data.characters = structure.characters;
      }
    }

    if (['P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14'].includes(stepId)) {
      const content = getContentFromP4();
      if (content && content.chapters) {
        data.chapters = content.chapters;
      }
    }

    return data;
  }, [syncedData, getTitleFromP1, getMarketDataFromP2, getStructureFromP3, getContentFromP4]);

  // Update synced data when a step is completed
  const onStepComplete = useCallback((stepId: string, result: any, displayContent: string) => {
    // Save the step result
    saveStepResult(stepId, result, displayContent);
    
    // Update synced data based on what was completed
    let newData: Partial<WorkflowData> = {};
    
    if (stepId === 'P1') {
      const title = getTitleFromP1();
      if (title) newData.title = title;
    } else if (stepId === 'P2') {
      const marketData = getMarketDataFromP2();
      if (marketData) {
        newData.marketAnalysis = marketData;
        newData.kdpKeywords = marketData.keywords;
        newData.kdpCategories = marketData.categories;
      }
    } else if (stepId === 'P3') {
      const structure = getStructureFromP3();
      if (structure) {
        newData.chapters = structure.chapters;
        newData.characters = structure.characters;
      }
    } else if (stepId === 'P4') {
      const content = getContentFromP4();
      if (content) {
        newData.chapters = content.chapters;
      }
    }
    
    if (Object.keys(newData).length > 0) {
      saveSyncedData(newData);
    }
  }, [saveStepResult, getTitleFromP1, getMarketDataFromP2, getStructureFromP3, getContentFromP4, saveSyncedData]);

  // Clear all synced data
  const clearSyncedData = useCallback(() => {
    setSyncedData({});
    localStorage.removeItem(WORKFLOW_DATA_KEY);
  }, []);

  return {
    syncedData,
    saveSyncedData,
    syncDataForStep,
    onStepComplete,
    clearSyncedData,
    hasStepResult,
    getStepResult,
    getTitleFromP1,
    getMarketDataFromP2,
    getStructureFromP3,
    getContentFromP4,
  };
};
