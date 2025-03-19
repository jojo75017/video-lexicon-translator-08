
import { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon }) => null;

export default PageHeader;
