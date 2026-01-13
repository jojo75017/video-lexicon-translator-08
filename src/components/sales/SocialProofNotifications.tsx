import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User } from 'lucide-react';

const firstNames = [
  'Marie', 'Thomas', 'Sophie', 'Nicolas', 'Julie', 'Pierre', 'Camille', 'Lucas',
  'Emma', 'Hugo', 'Léa', 'Antoine', 'Clara', 'Maxime', 'Chloé', 'Alexandre',
  'Laura', 'Julien', 'Sarah', 'Romain', 'Manon', 'Kevin', 'Pauline', 'Florian',
  'Anaïs', 'Guillaume', 'Marine', 'Quentin', 'Charlotte', 'Mathieu', 'Audrey',
  'Damien', 'Margot', 'Vincent', 'Océane', 'Benjamin', 'Justine', 'Clément'
];

const cities = [
  'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nantes', 'Nice', 'Lille',
  'Strasbourg', 'Montpellier', 'Rennes', 'Bruxelles', 'Genève', 'Lausanne', 'Liège',
  'Québec', 'Montréal', 'Casablanca', 'Dakar', 'Abidjan'
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomMinutes = () => Math.floor(Math.random() * 15) + 1;

interface Notification {
  id: number;
  name: string;
  city: string;
  minutes: number;
}

export const SocialProofNotifications: React.FC = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 8000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNotification = () => {
    const newNotification: Notification = {
      id: Date.now(),
      name: getRandomElement(firstNames),
      city: getRandomElement(cities),
      minutes: getRandomMinutes()
    };

    setNotification(newNotification);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Schedule next notification (random between 15-45 seconds)
    const nextDelay = Math.floor(Math.random() * 30000) + 15000;
    setTimeout(showNotification, nextDelay);
  };

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-24 left-4 z-50 max-w-xs"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-emerald-200 dark:border-emerald-800 p-4 flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {notification.name}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                vient de rejoindre EbookiaPro
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                📍 {notification.city} • il y a {notification.minutes} min
              </p>
            </div>

            {/* Pulse indicator */}
            <div className="flex-shrink-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofNotifications;
