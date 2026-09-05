import { BookOpenText, FileStack, FileText, Image, Megaphone } from 'lucide-react';

export const EBOOK_LONG_FORM_OFFER = {
  price: 47,
  referencePrice: 197,
  paypalUrl: 'https://paypal.me/ebookstudio/47',
  stripePackId: 'ebook_version_longue',
  paypalProductKey: 'ebook_version_longue_47',
  modules: [
    {
      icon: BookOpenText,
      title: 'Moteur de Rédaction Longue Durée',
      description: 'Développez chaque chapitre en profondeur tout en conservant le fil directeur du livre.',
      status: 'Disponible avec la V4',
    },
    {
      icon: FileStack,
      title: 'Générateur de Plans SEO & Sommaires',
      description: 'Structurez vos idées en parties, chapitres et sous-chapitres clairs avant la rédaction.',
      status: 'Inclus',
    },
    {
      icon: Image,
      title: 'Créateur de Couvertures HD',
      description: 'Préparez une première de couverture éditable, adaptée à votre sujet et à votre lectorat.',
      status: 'Inclus',
    },
    {
      icon: FileText,
      title: 'Export Multi-formats',
      description: 'Finalisez votre ouvrage en PDF, EPUB et Word pour la publication ou la relecture.',
      status: 'Inclus',
    },
    {
      icon: Megaphone,
      title: 'Suite Marketing',
      description: 'Transformez votre livre en e-mails et pages de vente cohérents avec votre promesse.',
      status: 'Disponible avec la V4',
    },
  ],
} as const;
