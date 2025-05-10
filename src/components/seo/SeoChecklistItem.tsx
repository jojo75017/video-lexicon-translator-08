
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface SeoChecklistItemProps {
  title: string;
  status: 'success' | 'error' | 'warning' | 'info';
  description?: string;
  advice?: string;
  value?: string | number | null;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  impact?: number;
}

const SeoChecklistItem: React.FC<SeoChecklistItemProps> = ({
  title,
  status,
  description,
  advice,
  value,
  className,
  priority,
  impact
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
        return <Info className="h-5 w-5 text-blue-500" />;
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

  const getPriorityBadge = () => {
    if (!priority) return null;
    
    const badgeClass = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-green-100 text-green-800',
    }[priority] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClass} inline-block ml-2`}>
        {t(`common.priority.${priority}`, priority)}
      </span>
    );
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      getBackgroundColor(),
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center flex-wrap">
            <h4 className="font-medium text-gray-800">{title}</h4>
            {getPriorityBadge()}
            {impact && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {t('common.impact', 'Impact')}: {impact}%
              </span>
            )}
          </div>
          
          {value && (
            <div className="font-medium text-lg my-1">
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
