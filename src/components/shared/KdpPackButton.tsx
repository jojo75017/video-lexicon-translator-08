import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { downloadKdpPack, type KdpPackOptions } from '@/lib/kdpPackZip';

interface KdpPackButtonProps {
  getOptions: () => KdpPackOptions | Promise<KdpPackOptions>;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  label?: string;
}

const KdpPackButton: React.FC<KdpPackButtonProps> = ({
  getOptions,
  className,
  size = 'default',
  label = 'Télécharger mon pack KDP',
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const opts = await getOptions();
      if (!opts.ebookTitle) {
        toast.error('Renseigne au moins un titre avant de générer le pack');
        return;
      }
      await downloadKdpPack(opts);
      toast.success('Pack KDP téléchargé ✨', {
        description: 'Décompresse le ZIP et suis le README pour publier sur Amazon KDP.',
      });
    } catch (e: any) {
      toast.error('Erreur lors de la génération du pack', {
        description: e?.message || 'Réessaie dans quelques secondes',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      size={size}
      className={`gap-2 bg-[#FF9E2D] hover:bg-[#008296] text-white font-bold shadow-lg shadow-orange-500/30 ring-2 ring-[#FF9E2D]/40 hover:ring-[#008296]/40 animate-pulse hover:animate-none ${className || ''}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-5 w-5" />}
      {loading ? 'Création du pack…' : `📦 ${label}`}
    </Button>
  );
};

export default KdpPackButton;
