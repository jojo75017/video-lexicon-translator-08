
// This file is now just an entry point that re-exports from the modular files
import { detectGeographicKeyword } from './titleGenerator';
import { generateSeoDescription, generateBothDescriptions, generateAIDescriptions, detectWebsiteTheme } from './description/generator';

// Re-export the main functions
export {
  detectGeographicKeyword,
  generateSeoDescription,
  generateBothDescriptions,
  generateAIDescriptions,
  detectWebsiteTheme
};
