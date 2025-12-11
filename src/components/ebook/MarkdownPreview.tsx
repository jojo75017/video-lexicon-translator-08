import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

// Parse content to extract and render images from [IMAGE_URL:...] markers
const parseContentWithImages = (content: string): React.ReactNode[] => {
  if (!content) return [];
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Match both [IMAGE_URL:...] and [IMAGE:id:url] patterns
  const imageRegex = /\[IMAGE_URL:(https?:\/\/[^\]]+)\]|\[IMAGE:\d+:(https?:\/\/[^\]]+)\]|\[IMAGE:\d+:(data:image\/[^\]]+)\]/g;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    // Add text before the image
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push(
          <span key={`text-${lastIndex}`}>{textBefore}</span>
        );
      }
    }
    
    // Extract the URL (could be in match[1], match[2], or match[3])
    const imageUrl = match[1] || match[2] || match[3];
    
    if (imageUrl) {
      parts.push(
        <div key={`img-${match.index}`} className="my-4 flex justify-center">
          <img 
            src={imageUrl}
            alt="Image du chapitre"
            className="max-w-full h-auto rounded-lg shadow-md max-h-96 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText.trim()) {
      parts.push(
        <span key={`text-${lastIndex}`}>{remainingText}</span>
      );
    }
  }
  
  return parts;
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className = '' }) => {
  // Check if content has image markers
  const hasImageMarkers = /\[IMAGE_URL:|IMAGE:\d+:/.test(content);
  
  if (hasImageMarkers) {
    // Split content by image markers and render each part
    const parts = parseContentWithImages(content);
    
    return (
      <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
        {parts.map((part, index) => {
          if (React.isValidElement(part) && part.type === 'div') {
            // This is an image element
            return part;
          }
          // This is text content - render with ReactMarkdown
          const textContent = part?.toString() || '';
          return (
            <ReactMarkdown
              key={index}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-primary underline decoration-2 underline-offset-4 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-primary underline decoration-2 underline-offset-4 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-primary underline decoration-1 underline-offset-2 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-foreground leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-foreground">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-foreground">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 text-foreground">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 text-foreground">{children}</ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">{children}</blockquote>
                ),
                hr: () => (
                  <hr className="my-6 border-border" />
                ),
                u: ({ children }) => (
                  <span className="underline">{children}</span>
                ),
              }}
            >
              {textContent}
            </ReactMarkdown>
          );
        })}
      </div>
    );
  }
  
  // No image markers - render normally
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-primary underline decoration-2 underline-offset-4 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-primary underline decoration-2 underline-offset-4 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-primary underline decoration-1 underline-offset-2 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-foreground leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 text-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 text-foreground">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">{children}</blockquote>
          ),
          hr: () => (
            <hr className="my-6 border-border" />
          ),
          u: ({ children }) => (
            <span className="underline">{children}</span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
