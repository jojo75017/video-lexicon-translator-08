
import React from 'react';

interface TabGroupHeaderProps {
  label: string;
}

const TabGroupHeader: React.FC<TabGroupHeaderProps> = ({ label }) => {
  return (
    <div className="flex items-center justify-center">
      {label}
    </div>
  );
};

export default TabGroupHeader;
