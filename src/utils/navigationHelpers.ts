// Helper functions for managing section navigation and activation

export const activateSection = (sectionId: string) => {
  console.log(`Activation de la section: ${sectionId}`);
  
  // First, hide ALL possible content containers to ensure clean state
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  document.querySelectorAll('[data-section]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // For TabsContent components, we need to set the CSS display property directly
  // BUT we shouldn't disable the active ones
  document.querySelectorAll('[role="tabpanel"]').forEach(el => {
    // Check if this panel is for the currently activated section
    const elValue = el.getAttribute('value');
    const dataValue = el.getAttribute('data-value');
    
    // Skip if this is the panel we want to show
    if (elValue === sectionId || dataValue === sectionId) {
      console.log(`Keeping panel visible: ${sectionId}`);
      (el as HTMLElement).style.display = 'block';
      return;
    }
    
    // Otherwise hide it
    (el as HTMLElement).style.display = 'none';
  });
  
  document.querySelectorAll('.tab-content').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Handle special case for ResultTabs
  if (['info', 'source', 'structure', 'performance', 'accessibility'].includes(sectionId)) {
    // Make sure the TabsTrigger for this section is marked as active
    const trigger = document.querySelector(`[role="tab"][data-state="active"][value="${sectionId}"]`);
    if (!trigger) {
      // If the trigger isn't active yet, find and click it
      const tabButton = document.querySelector(`[role="tab"][value="${sectionId}"]`);
      if (tabButton) {
        (tabButton as HTMLElement).click();
        console.log(`Clicked tab trigger for ${sectionId}`);
      }
    }
    
    // Force the specific TabsContent to be visible
    const content = document.querySelector(`[role="tabpanel"][value="${sectionId}"]`);
    if (content) {
      (content as HTMLElement).style.display = 'block';
      (content as HTMLElement).setAttribute('data-state', 'active');
      console.log(`Forced visibility of tab content: ${sectionId}`);
    }
    
    // 7. Specially handle for ResultTabs content by looking for TabsContent with matching data-value
    if (['info', 'source', 'structure'].includes(sectionId)) {
      // Find all ResultTabs content elements
      const resultsTabElements = document.querySelectorAll(`[role="tabpanel"][data-value="${sectionId}"], [role="tabpanel"][value="${sectionId}"]`);
      if (resultsTabElements.length > 0) {
        resultsTabElements.forEach(el => {
          (el as HTMLElement).style.display = 'block';
          console.log(`ResultTabs panel with value=${sectionId} displayed`);
        });
      }
      
      // Also try with direct ID match for ResultTabs
      const resultTabSection = document.getElementById(sectionId);
      if (resultTabSection) {
        resultTabSection.style.display = 'block';
        console.log(`ResultTabs section with ID ${sectionId} displayed`);
      }
    }
  }
  
  // Show the selected section with a small delay to ensure DOM is ready
  setTimeout(() => {
    // Try multiple selectors to ensure we find the right content
    
    // 1. Try by direct ID
    const elementById = document.getElementById(sectionId);
    if (elementById) {
      elementById.style.display = 'block';
      console.log(`Section ID ${sectionId} activated by ID`);
    }
    
    // 2. Try by data-section attribute
    const sectionElements = document.querySelectorAll(`[data-section="${sectionId}"]`);
    if (sectionElements.length > 0) {
      sectionElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      console.log(`Sections with data-section=${sectionId} activated (${sectionElements.length} found)`);
    }
    
    // 3. Try by data-tab-content attribute
    const tabContentElements = document.querySelectorAll(`[data-tab-content="${sectionId}"]`);
    if (tabContentElements.length > 0) {
      tabContentElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      console.log(`Elements with data-tab-content=${sectionId} displayed (${tabContentElements.length} found)`);
    }
    
    // 4. Try by tab panel with matching value
    const tabPanel = document.querySelector(`[role="tabpanel"][value="${sectionId}"]`);
    if (tabPanel) {
      (tabPanel as HTMLElement).style.display = 'block';
      console.log(`Tab panel ${sectionId} activated by value attribute`);
    }
    
    // 5. Try for elements with specific classes that match the sectionId
    const tabContentByClass = document.querySelectorAll(`.tab-content.${sectionId}`);
    if (tabContentByClass.length > 0) {
      tabContentByClass.forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      console.log(`Tab content with class ${sectionId} displayed (${tabContentByClass.length} found)`);
    }
    
    // 6. Try for TabsContent components from shadcn/ui
    const tabsContent = document.querySelector(`[data-state][role="tabpanel"][value="${sectionId}"]`);
    if (tabsContent) {
      (tabsContent as HTMLElement).style.display = 'block';
      console.log(`TabsContent with value=${sectionId} displayed`);
      
      // Make sure all active tabpanels with the same value are visible
      document.querySelectorAll(`[data-state="active"][role="tabpanel"][value="${sectionId}"]`).forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
    }
  }, 150); // Increased delay for more reliability
};

// Function to navigate to a section - updates URL hash and activates the section
export const navigateToSection = (sectionId: string) => {
  // Update hash to trigger listeners (but don't create a history entry)
  window.location.hash = sectionId;
  
  // Explicitly activate the section with delay
  setTimeout(() => {
    activateSection(sectionId);
  }, 250); // Increased delay for reliability
};

// Function to get the main tab category of a tab
export const getMainTabCategory = (tabId: string): string => {
  if (['hierarchy', 'wordcount', 'suggestions'].includes(tabId)) {
    return 'content';
  } else if (['seo', 'structure', 'backlinks'].includes(tabId)) {
    return 'seo';
  } else if (['performance', 'metrics'].includes(tabId)) {
    return 'performance';
  } else if (tabId === 'analytics') {
    return 'analytics';
  } else if (['info', 'source'].includes(tabId)) {
    return 'results';
  }
  
  // Return the tab itself if it's a main category
  return tabId;
};
