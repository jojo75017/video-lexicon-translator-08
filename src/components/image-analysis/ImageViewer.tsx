import React from 'react';

interface ImageViewerProps {
  url: string;
  format?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ url, format }) => {
  const handleRotate = () => {
    const img = document.querySelector('img');
    if (img) {
      img.style.transform = img.style.transform === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)';
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aperçu de l'image</title>
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
          }
        </style>
      </head>
      <body>
        <img src="${url}" alt="Aperçu de l'image" />
        <div class="image-info">
          Format: ${format || url.split(';')[0].split('/')[1].toUpperCase()}
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
          <button onclick="const img = document.querySelector('img'); img.style.transform = \`scale(\${(parseFloat(img.style.transform.match(/scale\\((.*?)\\)/)?.[1] || 1) * 1.2})\`">
            Zoom +
          </button>
          <button onclick="const img = document.querySelector('img'); img.style.transform = \`scale(\${(parseFloat(img.style.transform.match(/scale\\((.*?)\\)/)?.[1] || 1) / 1.2})\`">
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