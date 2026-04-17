import React from 'react';
import { Shield, Lock, CreditCard, CheckCircle } from 'lucide-react';

const TrustBadges: React.FC = () => {
  const badges = [
    { icon: Shield, label: 'Paiement Sécurisé', sublabel: 'Cryptage SSL 256-bit' },
    { icon: Lock, label: '100% Confidentiel', sublabel: 'Données protégées' },
    { icon: CreditCard, label: 'PayPal & Carte', sublabel: 'Paiement flexible' },
    { icon: CheckCircle, label: 'Garantie 30 Jours', sublabel: 'Satisfait ou remboursé' }
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10 text-primary">
                <badge.icon className="w-6 h-6" />
              </div>
              <p className="font-semibold text-sm text-foreground">{badge.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.sublabel}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 opacity-70">
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
