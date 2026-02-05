import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface EbookBookMockup3DProps {
  coverUrl?: string;
  title?: string;
  author?: string;
}

export const EbookBookMockup3D: React.FC<EbookBookMockup3DProps> = ({
  coverUrl,
  title = 'Mon Livre',
  author = 'Auteur'
}) => {
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
    <Card className="border-orange-200/50 bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-orange-500" />
          Aperçu 3D du Livre
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-12">
        <div 
          className="book-container"
          style={{ 
            perspective: '1000px',
            perspectiveOrigin: 'center center'
          }}
        >
          <div 
            className="book"
            style={{
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: 'rotateY(-25deg) rotateX(5deg)',
              transition: 'transform 0.4s ease'
            }}
          >
            {/* Couverture principale */}
            <div 
              className="cover-front"
              style={{
                width: '240px',
                height: '340px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(12px)',
                borderRadius: '0 4px 4px 0',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)'
              }}
            >
              <img 
                src={coverUrl || defaultCover} 
                alt="Couverture"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tranche du livre */}
            <div 
              className="spine"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '24px',
                height: '340px',
                background: 'linear-gradient(to right, #1f1f1f, #2d2d2d, #1f1f1f)',
                transform: 'rotateY(-90deg) translateX(-12px)',
                transformOrigin: 'left center',
                borderRadius: '4px 0 0 4px'
              }}
            />

            {/* Pages du livre (tranche droite) */}
            <div 
              className="pages"
              style={{
                position: 'absolute',
                top: '3px',
                right: '-10px',
                width: '20px',
                height: '334px',
                background: 'linear-gradient(to right, #e8e8e0, #f5f5f0, #fafafa)',
                transform: 'rotateY(90deg) translateX(10px)',
                transformOrigin: 'left center',
                borderRadius: '0 2px 2px 0'
              }}
            />
          </div>
        </div>

        {/* Ombre portée */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{
            width: '180px',
            height: '20px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, transparent 70%)',
            filter: 'blur(8px)',
            transform: 'rotateX(80deg)'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default EbookBookMockup3D;
