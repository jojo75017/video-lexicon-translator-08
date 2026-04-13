import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Check } from 'lucide-react';

interface ActivityNotification {
  id: string;
  name: string;
  action: string;
  topic: string;
  time: string;
  avatar?: string;
}

const frenchFirstNames = [
  'Marie', 'Thomas', 'Julie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Hugo',
  'Léa', 'Antoine', 'Camille', 'Maxime', 'Chloé', 'Alexandre', 'Laura',
  'Nicolas', 'Sarah', 'Julien', 'Manon', 'Romain', 'Pauline', 'David',
  'Charlotte', 'Mathieu', 'Océane', 'François', 'Anaïs', 'Quentin'
];

const ebookTopics = [
  'la cuisine healthy', 'le développement personnel', 'la finance personnelle',
  'le jardinage bio', 'la méditation', 'l\'entrepreneuriat', 'le fitness',
  'la parentalité positive', 'l\'investissement immobilier', 'le marketing digital',
  'la productivité', 'les recettes véganes', 'le minimalisme', 'le yoga',
  'la gestion du stress', 'les cryptomonnaies', 'le freelancing',
  'l\'écriture créative', 'la photographie', 'le voyage solo'
];

const actions = [
  'vient de générer un ebook sur',
  'a créé son livre sur',
  'vient de publier un guide sur',
  'a terminé son ebook sur'
];

const generateNotification = (): ActivityNotification => {
  const name = frenchFirstNames[Math.floor(Math.random() * frenchFirstNames.length)];
  const topic = ebookTopics[Math.floor(Math.random() * ebookTopics.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const minutes = Math.floor(Math.random() * 5) + 1;
  
  return {
    id: Date.now().toString(),
    name,
    action,
    topic,
    time: `il y a ${minutes} min`,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=6366f1`
  };
};

interface LiveActivityNotificationsProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  intervalMs?: number;
  maxVisible?: number;
}

const LiveActivityNotifications: React.FC<LiveActivityNotificationsProps> = ({
  position = 'bottom-left',
  intervalMs = 25000,
  maxVisible = 1
}) => {
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Première notification après 5 secondes
    const initialTimeout = setTimeout(() => {
      setNotifications([generateNotification()]);
    }, 5000);

    // Notifications suivantes
    const interval = setInterval(() => {
      const newNotification = generateNotification();
      setNotifications(prev => {
        const updated = [newNotification, ...prev].slice(0, maxVisible);
        return updated;
      });

      // Auto-hide après 6 secondes
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 6000);
    }, intervalMs);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [intervalMs, maxVisible]);

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-2`}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: position.includes('left') ? -100 : 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.includes('left') ? -100 : 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative max-w-sm bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Barre de progression */}
            <motion.div 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-violet-500"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
            
            <div className="p-4 flex items-start gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img 
                  src={notification.avatar} 
                  alt={notification.name}
                  className="w-10 h-10 rounded-full bg-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <Check className="w-3 h-3 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-foreground">
                  <span className="font-semibold">{notification.name}</span>
                  {' '}{notification.action}{' '}
                  <span className="font-medium text-primary">{notification.topic}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{notification.time}</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>
              </div>

              {/* Close button */}
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">Fermer</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gradient-to-r from-primary/5 to-violet-500/5 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3 h-3 text-primary" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Rejoignez 847+ auteurs satisfaits
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityNotifications;
