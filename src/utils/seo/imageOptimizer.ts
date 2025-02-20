
export interface OptimizedImage {
  originalSize: number;
  optimizedSize: number;
  url: string;
  width: number;
  height: number;
  format: string;
  suggestions: string[];
}

export const optimizeImage = async (imageFile: File): Promise<OptimizedImage> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const suggestions: string[] = [];

    reader.onload = (e) => {
      img.onload = () => {
        const originalSize = imageFile.size;
        let width = img.width;
        let height = img.height;

        // Vérifier la taille de l'image
        if (width > 1920 || height > 1920) {
          const ratio = Math.min(1920 / width, 1920 / height);
          width *= ratio;
          height *= ratio;
          suggestions.push("L'image est trop grande. Redimensionnée automatiquement.");
        }

        // Configuration du canvas
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Optimisation avec différentes qualités
        let quality = 0.8;
        let optimizedUrl = canvas.toDataURL('image/jpeg', quality);
        let optimizedSize = optimizedUrl.length * 0.75; // Approximation de la taille en bytes

        if (originalSize > 200000) { // Si plus de 200KB
          suggestions.push("L'image est lourde. Compression appliquée.");
          quality = 0.6;
          optimizedUrl = canvas.toDataURL('image/jpeg', quality);
          optimizedSize = optimizedUrl.length * 0.75;
        }

        resolve({
          originalSize,
          optimizedSize,
          url: optimizedUrl,
          width,
          height,
          format: imageFile.type,
          suggestions
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(imageFile);
  });
};
