import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, RotateCcw, Download, Eye } from 'lucide-react';

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
  const [rotation, setRotation] = useState({ x: 15, y: -25 });
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
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#grad)"/>
      <text x="200" y="280" font-family="Georgia, serif" font-size="28" fill="white" text-anchor="middle" font-weight="bold">${title}</text>
      <text x="200" y="320" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">${author}</text>
    </svg>
  `)}`;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-primary" />
            Prévisualisation 3D
          </span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? 'Pause' : 'Animer'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRotate}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8 perspective-1000">
          <div 
            className={`relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}
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
                width: '200px',
                height: '300px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Front cover */}
              <div 
                className="absolute inset-0 rounded-r-lg shadow-2xl overflow-hidden"
                style={{
                  transform: 'translateZ(15px)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <img 
                  src={coverUrl || defaultCover} 
                  alt="Couverture"
                  className="w-full h-full object-cover"
                />
                {/* Shine effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"
                />
              </div>

              {/* Spine */}
              <div 
                className="absolute bg-gradient-to-b from-violet-700 to-violet-900 rounded-l"
                style={{
                  width: '30px',
                  height: '300px',
                  left: '0px',
                  transform: 'rotateY(-90deg) translateX(-15px)',
                  transformOrigin: 'left center'
                }}
              >
                <div className="h-full flex items-center justify-center">
                  <span 
                    className="text-white text-xs font-bold tracking-wider"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)'
                    }}
                  >
                    {title.substring(0, 25)}
                  </span>
                </div>
              </div>

              {/* Back cover */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-violet-800 to-violet-950 rounded-l-lg"
                style={{
                  transform: 'translateZ(-15px) rotateY(180deg)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-1 bg-white/30 mb-2"></div>
                    <div className="w-24 h-1 bg-white/20 mb-4"></div>
                    <div className="space-y-1">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-1 bg-white/10 rounded" style={{ width: `${70 + Math.random() * 30}%` }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pages (top edge) */}
              <div 
                className="absolute bg-gradient-to-b from-gray-100 to-gray-200"
                style={{
                  width: '200px',
                  height: '30px',
                  top: '0px',
                  transform: 'rotateX(90deg) translateY(-15px)',
                  transformOrigin: 'top center'
                }}
              >
                {/* Page lines */}
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute h-full w-px bg-gray-300"
                    style={{ left: `${(i + 1) * 6}%` }}
                  />
                ))}
              </div>

              {/* Pages (bottom edge) */}
              <div 
                className="absolute bg-gradient-to-t from-gray-100 to-gray-200"
                style={{
                  width: '200px',
                  height: '30px',
                  bottom: '0px',
                  transform: 'rotateX(-90deg) translateY(15px)',
                  transformOrigin: 'bottom center'
                }}
              >
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute h-full w-px bg-gray-300"
                    style={{ left: `${(i + 1) * 6}%` }}
                  />
                ))}
              </div>

              {/* Pages (right edge) */}
              <div 
                className="absolute bg-gradient-to-l from-gray-100 to-gray-200"
                style={{
                  width: '30px',
                  height: '300px',
                  right: '0px',
                  transform: 'rotateY(90deg) translateX(15px)',
                  transformOrigin: 'right center'
                }}
              >
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-full h-px bg-gray-300"
                    style={{ top: `${(i + 1) * 4.5}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shadow */}
        <div className="flex justify-center -mt-4">
          <div 
            className="w-48 h-8 bg-black/20 rounded-full blur-xl"
            style={{ transform: 'rotateX(80deg)' }}
          />
        </div>

        <style>{`
          .perspective-1000 {
            perspective: 1000px;
          }
          .preserve-3d {
            transform-style: preserve-3d;
          }
          @keyframes float {
            0%, 100% {
              transform: rotateX(15deg) rotateY(-25deg) translateY(0px);
            }
            50% {
              transform: rotateX(15deg) rotateY(-25deg) translateY(-10px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default EbookBookMockup3D;
