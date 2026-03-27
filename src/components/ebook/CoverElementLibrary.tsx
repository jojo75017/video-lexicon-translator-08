import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Star, Heart, Crown, Award, Shield, BookOpen, Feather,
  Flame, Zap, Sun, Moon, Cloud, Leaf, Flower2, Diamond,
  Hexagon, Pentagon, Triangle, Gem, Bookmark, Flag,
  CircleDot, Sparkles, Eye, Target, Compass, Anchor,
  Music, Camera, Pen, Coffee, Globe, Map, Rocket,
  Bell, Gift, Key, Lightbulb, Send, Wifi, Check
} from 'lucide-react';

// ===================== ELEMENT LIBRARY DATA =====================

export interface LibraryItem {
  id: string;
  name: string;
  category: string;
  type: 'svg-shape' | 'ornament' | 'badge' | 'divider' | 'frame' | 'icon';
  render: (color: string, size: number) => React.ReactNode;
  defaultWidth: number;
  defaultHeight: number;
}

const CATEGORIES = [
  { id: 'all', label: 'Tout', icon: '🎨' },
  { id: 'ornaments', label: 'Ornements', icon: '✨' },
  { id: 'dividers', label: 'Séparateurs', icon: '➖' },
  { id: 'badges', label: 'Badges', icon: '🏷️' },
  { id: 'frames', label: 'Cadres', icon: '🖼️' },
  { id: 'icons', label: 'Icônes', icon: '⭐' },
  { id: 'shapes', label: 'Formes', icon: '🔷' },
];

// SVG renderers for each library element
const LIBRARY_ITEMS: LibraryItem[] = [
  // ---- ORNEMENTS ----
  {
    id: 'ornament-flourish-1', name: 'Arabesque classique', category: 'ornaments', type: 'ornament',
    defaultWidth: 300, defaultHeight: 60,
    render: (color, size) => (
      <svg viewBox="0 0 300 60" width={size} height={size * 0.2}>
        <path d="M150 30 C120 10 80 10 40 30 C80 50 120 50 150 30 Z" fill="none" stroke={color} strokeWidth="1.5"/>
        <path d="M150 30 C180 10 220 10 260 30 C220 50 180 50 150 30 Z" fill="none" stroke={color} strokeWidth="1.5"/>
        <circle cx="150" cy="30" r="3" fill={color}/>
        <circle cx="40" cy="30" r="2" fill={color}/>
        <circle cx="260" cy="30" r="2" fill={color}/>
      </svg>
    )
  },
  {
    id: 'ornament-flourish-2', name: 'Volute élégante', category: 'ornaments', type: 'ornament',
    defaultWidth: 280, defaultHeight: 50,
    render: (color, size) => (
      <svg viewBox="0 0 280 50" width={size} height={size * 0.18}>
        <path d="M20 25 Q70 5 140 25 Q210 45 260 25" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 25 Q70 45 140 25 Q210 5 260 25" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="140" cy="25" r="4" fill={color}/>
      </svg>
    )
  },
  {
    id: 'ornament-star-burst', name: 'Étoile décorative', category: 'ornaments', type: 'ornament',
    defaultWidth: 100, defaultHeight: 100,
    render: (color, size) => (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {[0,45,90,135].map(a => (
          <line key={a} x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="1" transform={`rotate(${a} 50 50)`}/>
        ))}
        <circle cx="50" cy="50" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="3" fill={color}/>
      </svg>
    )
  },
  {
    id: 'ornament-diamond-row', name: 'Losanges en ligne', category: 'ornaments', type: 'ornament',
    defaultWidth: 260, defaultHeight: 30,
    render: (color, size) => (
      <svg viewBox="0 0 260 30" width={size} height={size * 0.12}>
        {[50,90,130,170,210].map(x => (
          <rect key={x} x={x-6} y="9" width="12" height="12" fill={color} transform={`rotate(45 ${x} 15)`}/>
        ))}
        <line x1="10" y1="15" x2="40" y2="15" stroke={color} strokeWidth="1"/>
        <line x1="220" y1="15" x2="250" y2="15" stroke={color} strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: 'ornament-laurel', name: 'Couronne laurier', category: 'ornaments', type: 'ornament',
    defaultWidth: 150, defaultHeight: 150,
    render: (color, size) => (
      <svg viewBox="0 0 150 150" width={size} height={size}>
        <path d="M45 120 Q30 80 45 40 Q55 60 50 80 Q48 100 45 120Z" fill={color} opacity="0.7"/>
        <path d="M35 110 Q20 75 40 35 Q45 55 42 75 Q40 95 35 110Z" fill={color} opacity="0.5"/>
        <path d="M105 120 Q120 80 105 40 Q95 60 100 80 Q102 100 105 120Z" fill={color} opacity="0.7"/>
        <path d="M115 110 Q130 75 110 35 Q105 55 108 75 Q110 95 115 110Z" fill={color} opacity="0.5"/>
        <circle cx="75" cy="30" r="4" fill={color}/>
      </svg>
    )
  },
  {
    id: 'ornament-corner', name: 'Coin décoratif', category: 'ornaments', type: 'ornament',
    defaultWidth: 80, defaultHeight: 80,
    render: (color, size) => (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <path d="M5 5 L5 35 Q5 5 35 5" fill="none" stroke={color} strokeWidth="2"/>
        <path d="M10 10 L10 30 Q10 10 30 10" fill="none" stroke={color} strokeWidth="1"/>
        <circle cx="5" cy="5" r="2" fill={color}/>
      </svg>
    )
  },

  // ---- SÉPARATEURS ----
  {
    id: 'divider-elegant', name: 'Trait élégant', category: 'dividers', type: 'divider',
    defaultWidth: 400, defaultHeight: 20,
    render: (color, size) => (
      <svg viewBox="0 0 400 20" width={size} height={size * 0.05}>
        <line x1="20" y1="10" x2="180" y2="10" stroke={color} strokeWidth="1"/>
        <circle cx="200" cy="10" r="4" fill={color}/>
        <line x1="220" y1="10" x2="380" y2="10" stroke={color} strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: 'divider-dots', name: 'Points séparateurs', category: 'dividers', type: 'divider',
    defaultWidth: 300, defaultHeight: 10,
    render: (color, size) => (
      <svg viewBox="0 0 300 10" width={size} height={size * 0.03}>
        {[30,60,90,120,150,180,210,240,270].map(x => (
          <circle key={x} cx={x} cy="5" r={x === 150 ? 3 : 1.5} fill={color}/>
        ))}
      </svg>
    )
  },
  {
    id: 'divider-wave', name: 'Vague ondulée', category: 'dividers', type: 'divider',
    defaultWidth: 400, defaultHeight: 30,
    render: (color, size) => (
      <svg viewBox="0 0 400 30" width={size} height={size * 0.075}>
        <path d="M10 15 Q60 0 110 15 Q160 30 210 15 Q260 0 310 15 Q360 30 390 15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'divider-arrows', name: 'Flèches centrales', category: 'dividers', type: 'divider',
    defaultWidth: 300, defaultHeight: 20,
    render: (color, size) => (
      <svg viewBox="0 0 300 20" width={size} height={size * 0.07}>
        <line x1="20" y1="10" x2="130" y2="10" stroke={color} strokeWidth="1"/>
        <polygon points="140,3 155,10 140,17" fill={color}/>
        <polygon points="160,3 145,10 160,17" fill={color}/>
        <line x1="170" y1="10" x2="280" y2="10" stroke={color} strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: 'divider-zigzag', name: 'Zigzag', category: 'dividers', type: 'divider',
    defaultWidth: 300, defaultHeight: 20,
    render: (color, size) => (
      <svg viewBox="0 0 300 20" width={size} height={size * 0.07}>
        <polyline points="10,15 30,5 50,15 70,5 90,15 110,5 130,15 150,5 170,15 190,5 210,15 230,5 250,15 270,5 290,15" fill="none" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  },

  // ---- BADGES ----
  {
    id: 'badge-ribbon', name: 'Ruban bestseller', category: 'badges', type: 'badge',
    defaultWidth: 140, defaultHeight: 160,
    render: (color, size) => (
      <svg viewBox="0 0 140 160" width={size} height={size * 1.14}>
        <circle cx="70" cy="65" r="50" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <circle cx="70" cy="65" r="38" fill="none" stroke={color} strokeWidth="1"/>
        <polygon points="45,115 70,100 95,115 95,155 70,140 45,155" fill={color} opacity="0.8"/>
        <text x="70" y="60" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">BEST</text>
        <text x="70" y="75" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">SELLER</text>
      </svg>
    )
  },
  {
    id: 'badge-circle', name: 'Badge cercle', category: 'badges', type: 'badge',
    defaultWidth: 120, defaultHeight: 120,
    render: (color, size) => (
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="2"/>
        <circle cx="60" cy="60" r="42" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 3"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
          <circle key={a} cx={60 + 50 * Math.cos(a * Math.PI / 180)} cy={60 + 50 * Math.sin(a * Math.PI / 180)} r="2" fill={color}/>
        ))}
      </svg>
    )
  },
  {
    id: 'badge-shield', name: 'Bouclier', category: 'badges', type: 'badge',
    defaultWidth: 100, defaultHeight: 120,
    render: (color, size) => (
      <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
        <path d="M50 10 L90 30 L90 70 Q90 100 50 115 Q10 100 10 70 L10 30 Z" fill={color} opacity="0.12" stroke={color} strokeWidth="2"/>
        <path d="M50 22 L80 38 L80 68 Q80 92 50 105 Q20 92 20 68 L20 38 Z" fill="none" stroke={color} strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: 'badge-star', name: 'Étoile prix', category: 'badges', type: 'badge',
    defaultWidth: 120, defaultHeight: 120,
    render: (color, size) => {
      const points = Array.from({length: 10}, (_, i) => {
        const r = i % 2 === 0 ? 50 : 25;
        const a = (i * 36 - 90) * Math.PI / 180;
        return `${60 + r * Math.cos(a)},${60 + r * Math.sin(a)}`;
      }).join(' ');
      return (
        <svg viewBox="0 0 120 120" width={size} height={size}>
          <polygon points={points} fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        </svg>
      );
    }
  },
  {
    id: 'badge-banner', name: 'Bannière', category: 'badges', type: 'badge',
    defaultWidth: 250, defaultHeight: 60,
    render: (color, size) => (
      <svg viewBox="0 0 250 60" width={size} height={size * 0.24}>
        <polygon points="20,5 230,5 240,30 230,55 20,55 10,30" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5"/>
        <line x1="40" y1="30" x2="210" y2="30" stroke={color} strokeWidth="0.5" opacity="0.4"/>
      </svg>
    )
  },

  // ---- CADRES ----
  {
    id: 'frame-simple', name: 'Cadre simple', category: 'frames', type: 'frame',
    defaultWidth: 500, defaultHeight: 800,
    render: (color, size) => (
      <svg viewBox="0 0 500 800" width={size} height={size * 1.6}>
        <rect x="20" y="20" width="460" height="760" fill="none" stroke={color} strokeWidth="2"/>
        <rect x="30" y="30" width="440" height="740" fill="none" stroke={color} strokeWidth="0.5"/>
      </svg>
    )
  },
  {
    id: 'frame-ornate', name: 'Cadre orné', category: 'frames', type: 'frame',
    defaultWidth: 500, defaultHeight: 800,
    render: (color, size) => (
      <svg viewBox="0 0 500 800" width={size} height={size * 1.6}>
        <rect x="25" y="25" width="450" height="750" fill="none" stroke={color} strokeWidth="2"/>
        <rect x="35" y="35" width="430" height="730" fill="none" stroke={color} strokeWidth="1"/>
        {/* Corner ornaments */}
        <circle cx="25" cy="25" r="6" fill={color}/>
        <circle cx="475" cy="25" r="6" fill={color}/>
        <circle cx="25" cy="775" r="6" fill={color}/>
        <circle cx="475" cy="775" r="6" fill={color}/>
        {/* Mid ornaments */}
        <circle cx="250" cy="25" r="4" fill={color}/>
        <circle cx="250" cy="775" r="4" fill={color}/>
        <circle cx="25" cy="400" r="4" fill={color}/>
        <circle cx="475" cy="400" r="4" fill={color}/>
      </svg>
    )
  },
  {
    id: 'frame-art-deco', name: 'Cadre Art Déco', category: 'frames', type: 'frame',
    defaultWidth: 500, defaultHeight: 800,
    render: (color, size) => (
      <svg viewBox="0 0 500 800" width={size} height={size * 1.6}>
        <rect x="20" y="20" width="460" height="760" fill="none" stroke={color} strokeWidth="3"/>
        <line x1="20" y1="60" x2="480" y2="60" stroke={color} strokeWidth="1"/>
        <line x1="20" y1="740" x2="480" y2="740" stroke={color} strokeWidth="1"/>
        <line x1="60" y1="20" x2="60" y2="780" stroke={color} strokeWidth="1"/>
        <line x1="440" y1="20" x2="440" y2="780" stroke={color} strokeWidth="1"/>
        <rect x="20" y="20" width="40" height="40" fill={color} opacity="0.2"/>
        <rect x="440" y="20" width="40" height="40" fill={color} opacity="0.2"/>
        <rect x="20" y="740" width="40" height="40" fill={color} opacity="0.2"/>
        <rect x="440" y="740" width="40" height="40" fill={color} opacity="0.2"/>
      </svg>
    )
  },

  // ---- ICÔNES ----
  ...[
    { id: 'icon-star', name: 'Étoile', Icon: Star },
    { id: 'icon-heart', name: 'Cœur', Icon: Heart },
    { id: 'icon-crown', name: 'Couronne', Icon: Crown },
    { id: 'icon-award', name: 'Récompense', Icon: Award },
    { id: 'icon-shield', name: 'Bouclier', Icon: Shield },
    { id: 'icon-book', name: 'Livre', Icon: BookOpen },
    { id: 'icon-feather', name: 'Plume', Icon: Feather },
    { id: 'icon-flame', name: 'Flamme', Icon: Flame },
    { id: 'icon-zap', name: 'Éclair', Icon: Zap },
    { id: 'icon-sun', name: 'Soleil', Icon: Sun },
    { id: 'icon-moon', name: 'Lune', Icon: Moon },
    { id: 'icon-leaf', name: 'Feuille', Icon: Leaf },
    { id: 'icon-diamond', name: 'Diamant', Icon: Diamond },
    { id: 'icon-gem', name: 'Gemme', Icon: Gem },
    { id: 'icon-sparkles', name: 'Étincelles', Icon: Sparkles },
    { id: 'icon-eye', name: 'Œil', Icon: Eye },
    { id: 'icon-target', name: 'Cible', Icon: Target },
    { id: 'icon-compass', name: 'Boussole', Icon: Compass },
    { id: 'icon-anchor', name: 'Ancre', Icon: Anchor },
    { id: 'icon-rocket', name: 'Fusée', Icon: Rocket },
    { id: 'icon-lightbulb', name: 'Ampoule', Icon: Lightbulb },
    { id: 'icon-key', name: 'Clé', Icon: Key },
    { id: 'icon-pen', name: 'Stylo', Icon: Pen },
    { id: 'icon-coffee', name: 'Café', Icon: Coffee },
    { id: 'icon-globe', name: 'Globe', Icon: Globe },
    { id: 'icon-camera', name: 'Caméra', Icon: Camera },
    { id: 'icon-music', name: 'Musique', Icon: Music },
    { id: 'icon-gift', name: 'Cadeau', Icon: Gift },
    { id: 'icon-send', name: 'Envoyer', Icon: Send },
    { id: 'icon-check', name: 'Validé', Icon: Check },
  ].map(({ id, name, Icon }) => ({
    id, name, category: 'icons', type: 'icon' as const,
    defaultWidth: 60, defaultHeight: 60,
    render: (color: string, size: number) => <Icon size={size} color={color} strokeWidth={1.5} />
  })),

  // ---- FORMES AVANCÉES ----
  {
    id: 'shape-hexagon', name: 'Hexagone', category: 'shapes', type: 'svg-shape',
    defaultWidth: 120, defaultHeight: 104,
    render: (color, size) => (
      <svg viewBox="0 0 120 104" width={size} height={size * 0.87}>
        <polygon points="60,2 116,27 116,77 60,102 4,77 4,27" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'shape-pentagon', name: 'Pentagone', category: 'shapes', type: 'svg-shape',
    defaultWidth: 120, defaultHeight: 114,
    render: (color, size) => {
      const pts = Array.from({length: 5}, (_, i) => {
        const a = (i * 72 - 90) * Math.PI / 180;
        return `${60 + 55 * Math.cos(a)},${60 + 55 * Math.sin(a)}`;
      }).join(' ');
      return (
        <svg viewBox="0 0 120 120" width={size} height={size}>
          <polygon points={pts} fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        </svg>
      );
    }
  },
  {
    id: 'shape-cross', name: 'Croix', category: 'shapes', type: 'svg-shape',
    defaultWidth: 100, defaultHeight: 100,
    render: (color, size) => (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <rect x="35" y="5" width="30" height="90" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
        <rect x="5" y="35" width="90" height="30" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'shape-arrow-right', name: 'Flèche droite', category: 'shapes', type: 'svg-shape',
    defaultWidth: 150, defaultHeight: 80,
    render: (color, size) => (
      <svg viewBox="0 0 150 80" width={size} height={size * 0.53}>
        <polygon points="10,25 100,25 100,10 140,40 100,70 100,55 10,55" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'shape-cloud', name: 'Nuage', category: 'shapes', type: 'svg-shape',
    defaultWidth: 160, defaultHeight: 100,
    render: (color, size) => (
      <svg viewBox="0 0 160 100" width={size} height={size * 0.625}>
        <path d="M30 70 Q10 70 10 55 Q10 40 25 38 Q25 20 50 20 Q65 10 85 20 Q100 10 120 20 Q140 20 145 38 Q155 40 155 55 Q155 70 135 70 Z" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'shape-speech-bubble', name: 'Bulle dialogue', category: 'shapes', type: 'svg-shape',
    defaultWidth: 180, defaultHeight: 130,
    render: (color, size) => (
      <svg viewBox="0 0 180 130" width={size} height={size * 0.72}>
        <path d="M20 10 Q10 10 10 20 L10 80 Q10 90 20 90 L50 90 L40 115 L70 90 L160 90 Q170 90 170 80 L170 20 Q170 10 160 10 Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  },
];

// ===================== COMPONENT =====================

interface CoverElementLibraryProps {
  onAddElement: (item: LibraryItem, color: string) => void;
}

export const CoverElementLibrary: React.FC<CoverElementLibraryProps> = ({ onAddElement }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('#b8860b');

  const LIBRARY_COLORS = [
    '#b8860b', '#FFFFFF', '#000000', '#c0392b', '#e94560',
    '#8e44ad', '#2980b9', '#27ae60', '#f39c12', '#708090',
    '#d4a574', '#1a1a2e'
  ];

  const filteredItems = LIBRARY_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        <Input
          placeholder="Rechercher un élément..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="h-7 text-xs pl-7"
        />
      </div>

      {/* Color picker */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground mb-1">Couleur</p>
        <div className="flex flex-wrap gap-1">
          {LIBRARY_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className="w-5 h-5 rounded border border-border hover:scale-110 transition-transform"
              style={{
                background: c,
                outline: selectedColor === c ? '2px solid hsl(var(--primary))' : 'none',
                outlineOffset: '1px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-3 gap-1.5 max-h-[400px] overflow-y-auto pr-1">
        {filteredItems.map(item => (
          <button
            key={item.id}
            onClick={() => onAddElement(item, selectedColor)}
            className="flex flex-col items-center justify-center p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group aspect-square"
            title={item.name}
          >
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              {item.render(selectedColor, 40)}
            </div>
            <p className="text-[8px] text-muted-foreground mt-1 truncate w-full text-center group-hover:text-primary">
              {item.name}
            </p>
          </button>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4 italic">
          Aucun élément trouvé
        </p>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        {filteredItems.length} élément{filteredItems.length > 1 ? 's' : ''} disponible{filteredItems.length > 1 ? 's' : ''}
      </p>
    </div>
  );
};

export { LIBRARY_ITEMS };
export default CoverElementLibrary;
