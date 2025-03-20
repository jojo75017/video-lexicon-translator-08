
import { LucideIcon } from 'lucide-react';

export interface TabItemType {
  id: string;
  icon: LucideIcon;
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
