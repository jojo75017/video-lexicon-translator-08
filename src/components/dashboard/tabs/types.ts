
import { ReactNode } from 'react';

// Base interface with common properties shared by all tab types
export interface BaseTabProps {
  id: string;
  label: string;
  icon: ReactNode;
  group: string;
  color: string;
  isNew?: boolean;
  link?: string;
  highlighted?: boolean;
}

// Tab interface extends BaseTabProps with description
export interface Tab extends BaseTabProps {
  description: string;
}

// TabItemType is just an alias of BaseTabProps for backward compatibility
export type TabItemType = BaseTabProps;

// Type for grouped tabs
export interface GroupedTabsType {
  [key: string]: TabItemType[];
}

// Type for group labels
export interface GroupLabelsType {
  [key: string]: string;
}
