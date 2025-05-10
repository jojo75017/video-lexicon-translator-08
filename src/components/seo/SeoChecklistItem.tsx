
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface SeoChecklistItemProps {
  title: string;
  status: 'success' | 'error' | 'warning' | 'info';
  description?: string;
  advice?: string;
  value?: string | number | null;
  className?: string;
}

const SeoChecklistItem: React.FC<SeoChecklistItemProps> = ({
  title,
  status,
  description,
  advice,
  value,
  className
}) => {
  const { t } = useTranslation();
  
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-100';
      case 'error':
        return 'bg-red-50 border-red-100';
      case 'warning':
        return 'bg-orange-50 border-orange-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      getBackgroundColor(),
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div>
          <h4 className="font-medium mb-1 text-gray-800">{title}</h4>
          
          {value && (
            <div className="font-medium text-lg mb-1">
              {value}
            </div>
          )}
          
          {description && (
            <p className="text-sm text-gray-600 mb-1.5">
              {description}
            </p>
          )}
          
          {advice && (
            <div className="text-sm mt-2 p-2 bg-white bg-opacity-50 rounded border border-opacity-50">
              <span className="font-medium">{t('common.advice', 'Conseil')}:</span> {advice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoChecklistItem;
