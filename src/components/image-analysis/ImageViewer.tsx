import React from 'react';

interface ImageViewerProps {
  url: string;
  alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ url, alt }) => {
  const handleRotate = () => {
    const img = document.querySelector('img');
    if (img) {
      const currentRotation = img.style.transform.match(/rotate\((.*?)deg\)/) || ['', '0'];
      const newRotation = (parseInt(currentRotation[1]) + 90) % 360;
      img.style.transform = `rotate(${newRotation}deg) scale(${img.style.transform.match(/scale\((.*?)\)/)?.[1] || 1})`;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${alt || 'Aperçu de l\'image'}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f1f5f9;
            font-family: system-ui, -apple-system, sans-serif;
          }
          img {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transition: transform 0.3s ease;
          }
          .controls {
            margin-top: 20px;
            display: flex;
            gap: 10px;
          }
          button {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            background: #2563eb;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            transition: background 0.2s ease;
          }
          button:hover {
            background: #1d4ed8;
          }
          .image-info {
            margin-top: 10px;
            color: #666;
            font-size: 14px;
            background: white;
            padding: 8px 16px;
            border-radius: 6px;
          }
          .zoom-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            gap: 4px;
          }
        </style>
      </head>
      <body>
        <img src="${url}" alt="${alt || 'Image sans description'}" />
        <div class="image-info">
          ${alt ? `Description: ${alt}` : 'Aucune description disponible'}
        </div>
        <div class="controls">
          <button onclick="window.close()">Fermer</button>
          <button onclick="document.querySelector('img').requestFullscreen()">
            Plein écran
          </button>
          <button onclick="handleRotate()">
            Rotation
          </button>
        </div>
        <div class="zoom-controls">
          <button onclick="const img = document.querySelector('img'); img.style.transform = \`\${img.style.transform.replace(/scale\\(.*?\\)/, '')} scale(\${(parseFloat(img.style.transform.match(/scale\\((.*?)\\)/)?.[1] || 1) * 1.2})\`">
            Zoom +
          </button>
          <button onclick="const img = document.querySelector('img'); img.style.transform = \`\${img.style.transform.replace(/scale\\(.*?\\)/, '')} scale(\${(parseFloat(img.style.transform.match(/scale\\((.*?)\\)/)?.[1] || 1) / 1.2})\`">
            Zoom -
          </button>
        </div>
        <script>
          const handleRotate = ${handleRotate.toString()}
        </script>
      </body>
    </html>
  `;
};

export default ImageViewer;