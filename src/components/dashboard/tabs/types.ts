
export interface Tab {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  group: string;
  color: string;
  isNew?: boolean;
  highlighted?: boolean;
  link?: string;
}
