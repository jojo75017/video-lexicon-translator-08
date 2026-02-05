import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, Pause, Play } from 'lucide-react';

interface EbookBookMockup3DProps {
  coverUrl?: string;
  title?: string;
  author?: string;
}

export const EbookBookMockup3D: React.FC<EbookBookMockup3DProps> = ({
  coverUrl,
  title = 'Mon Ebook',
  author = 'Auteur'
}) => {
  const [rotation, setRotation] = useState({ x: 10, y: -20 });
  const [isAnimating, setIsAnimating] = useState(true);

  const handleRotate = () => {
    setRotation(prev => ({
      x: prev.x,
      y: prev.y + 45
    }));
  };

  const defaultCover = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ea580c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#grad)"/>
      <text x="200" y="280" font-family="Georgia, serif" font-size="28" fill="white" text-anchor="middle" font-weight="bold">${title}</text>
      <text x="200" y="320" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">${author}</text>
    </svg>
  `)}`;

  return (
    <Card className="border-orange-200/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-orange-500" />
            Aperçu 3D du Livre
          </span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="text-xs gap-1"
            >
              {isAnimating ? (
                <>
                  <Pause className="h-3 w-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  Animer
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRotate} title="Tourner">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8" style={{ perspective: '1200px' }}>
          <div 
            className={`relative ${isAnimating ? 'animate-float' : ''}`}
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease-out'
            }}
          >
            {/* Book container */}
            <div 
              className="relative"
              style={{
                width: '220px',
                height: '320px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Front cover */}
              <div 
                className="absolute inset-0 rounded-r-lg overflow-hidden"
                style={{
                  transform: 'translateZ(12px)',
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.1)'
                }}
              >
                <img 
                  src={coverUrl || defaultCover} 
                  alt="Couverture du livre"
                  className="w-full h-full object-cover"
                />
                {/* Shine effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"
                />
              </div>

              {/* Spine - with book title */}
              <div 
                className="absolute rounded-l"
                style={{
                  width: '24px',
                  height: '320px',
                  left: '0px',
                  background: 'linear-gradient(to right, #7c2d12, #9a3412, #c2410c)',
                  transform: 'rotateY(-90deg) translateX(-12px)',
                  transformOrigin: 'left center',
                  boxShadow: 'inset 2px 0 8px rgba(0,0,0,0.3)'
                }}
              >
                <div className="h-full flex items-center justify-center">
                  <span 
                    className="text-white/90 text-[10px] font-semibold tracking-wider uppercase"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {title.substring(0, 30)}
                  </span>
                </div>
              </div>

              {/* Back cover */}
              <div 
                className="absolute inset-0 rounded-l-lg"
                style={{
                  background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)',
                  transform: 'translateZ(-12px) rotateY(180deg)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-0.5 bg-white/40 mb-2 rounded"></div>
                    <div className="w-24 h-0.5 bg-white/30 mb-4 rounded"></div>
                    <div className="space-y-1.5">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-0.5 bg-white/20 rounded" style={{ width: `${65 + Math.random() * 35}%` }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white/50 text-[8px] uppercase tracking-widest">Livre de Cuisine</p>
                  </div>
                </div>
              </div>

              {/* Pages (right edge only - clean look) */}
              <div 
                className="absolute"
                style={{
                  width: '20px',
                  height: '316px',
                  top: '2px',
                  right: '-8px',
                  background: 'linear-gradient(to right, #fef3c7, #fefce8, #fffbeb)',
                  transform: 'rotateY(90deg) translateX(10px)',
                  transformOrigin: 'left center',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.05)'
                }}
              >
                {/* Page lines */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-full h-px bg-amber-200/50"
                    style={{ top: `${(i + 1) * 7.5}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Soft shadow underneath */}
        <div className="flex justify-center -mt-2">
          <div 
            className="w-40 h-6 bg-gradient-to-r from-transparent via-orange-900/20 to-transparent rounded-full blur-xl"
          />
        </div>

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: rotateX(10deg) rotateY(-20deg) translateY(0px);
            }
            50% {
              transform: rotateX(10deg) rotateY(-20deg) translateY(-8px);
            }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default EbookBookMockup3D;
