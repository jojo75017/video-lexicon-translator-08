
import { ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  group: string;
  link?: string;
  isNew?: boolean;
  highlighted?: boolean;
  color?: string; // Added to make Tab compatible with TabItemType
}

export interface TabItemType {
  id: string;
  icon: ReactNode;
  label: string;
  color: string;
  group: string;
  isNew?: boolean;
  link?: string;
  highlighted?: boolean;
}

export interface GroupedTabsType {
  [key: string]: TabItemType[];
}

export interface GroupLabelsType {
  [key: string]: string;
}
