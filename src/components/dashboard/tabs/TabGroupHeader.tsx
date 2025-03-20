
import React from 'react';

interface TabGroupHeaderProps {
  label: string;
}

const TabGroupHeader: React.FC<TabGroupHeaderProps> = ({ label }) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 py-2 px-2 rounded-md">
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
};

export default TabGroupHeader;
