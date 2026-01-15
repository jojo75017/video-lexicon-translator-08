import React from 'react';
import { Shield, Lock, CreditCard, CheckCircle } from 'lucide-react';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      label: 'Paiement Sécurisé',
      sublabel: 'Cryptage SSL 256-bit',
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      icon: Lock,
      label: '100% Confidentiel',
      sublabel: 'Données protégées',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: CreditCard,
      label: 'Stripe & PayPal',
      sublabel: 'Paiement flexible',
      color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30'
    },
    {
      icon: CheckCircle,
      label: 'Garantie 30 Jours',
      sublabel: 'Satisfait ou remboursé',
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
    }
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.color}`}>
                <badge.icon className="w-6 h-6" />
              </div>
              <p className="font-semibold text-sm text-foreground">{badge.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.sublabel}</p>
            </div>
          ))}
        </div>
        
        {/* Partenaires de paiement */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 opacity-60">
          <div className="flex items-center gap-2">
            <svg className="h-8 w-auto" viewBox="0 0 50 21" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M25.517.5c4.143 0 7.5 3.357 7.5 7.5s-3.357 7.5-7.5 7.5-7.5-3.357-7.5-7.5 3.357-7.5 7.5-7.5zm-8.017 15h16.034c.544 0 .983.439.983.983v3.034c0 .544-.439.983-.983.983H17.5c-.544 0-.983-.439-.983-.983v-3.034c0-.544.439-.983.983-.983z"/>
            </svg>
          </div>
          <div className="text-sm font-medium text-muted-foreground">Visa</div>
          <div className="text-sm font-medium text-muted-foreground">Mastercard</div>
          <div className="text-sm font-medium text-muted-foreground">PayPal</div>
          <div className="text-sm font-medium text-muted-foreground">Apple Pay</div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
