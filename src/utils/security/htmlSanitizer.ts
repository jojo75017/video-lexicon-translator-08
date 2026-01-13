/**
 * HTML Sanitizer utility to prevent XSS attacks
 * Removes dangerous HTML elements and attributes while preserving safe content
 */

// List of allowed HTML tags for safe rendering
const ALLOWED_TAGS = [
  'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'img',
  'blockquote', 'pre', 'code',
  'sub', 'sup', 'small', 'mark'
];

// Allowed attributes per tag
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  'table': ['border', 'cellpadding', 'cellspacing'],
  'th': ['colspan', 'rowspan', 'scope'],
  'td': ['colspan', 'rowspan'],
  '*': ['class', 'style', 'id'] // Allowed on all elements
};

// Dangerous patterns to remove from strings
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^>]*>/gi,
  /javascript:/gi,
  /data:/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick, onload, etc.
  /expression\s*\(/gi, // CSS expressions
  /url\s*\(\s*['"]?javascript/gi,
];

// Dangerous CSS properties
const DANGEROUS_CSS_PROPERTIES = [
  'behavior',
  'expression',
  '-moz-binding',
  'javascript',
];

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html;

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Parse and filter HTML elements
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized, 'text/html');
  
  // Process all elements
  const elements = doc.body.querySelectorAll('*');
  elements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    
    // Remove disallowed tags
    if (!ALLOWED_TAGS.includes(tagName)) {
      el.replaceWith(...Array.from(el.childNodes));
      return;
    }
    
    // Filter attributes
    const allowedAttrs = [
      ...(ALLOWED_ATTRIBUTES[tagName] || []),
      ...(ALLOWED_ATTRIBUTES['*'] || [])
    ];
    
    const attrsToRemove: string[] = [];
    for (const attr of Array.from(el.attributes)) {
      if (!allowedAttrs.includes(attr.name.toLowerCase())) {
        attrsToRemove.push(attr.name);
      } else {
        // Check for dangerous values
        const value = attr.value.toLowerCase();
        if (value.includes('javascript:') || 
            value.includes('data:') || 
            value.includes('vbscript:') ||
            /on\w+/.test(attr.name.toLowerCase())) {
          attrsToRemove.push(attr.name);
        }
      }
    }
    
    // Remove dangerous attributes
    attrsToRemove.forEach(attr => el.removeAttribute(attr));
    
    // Sanitize style attribute
    if (el.hasAttribute('style')) {
      const style = el.getAttribute('style') || '';
      const sanitizedStyle = sanitizeStyle(style);
      if (sanitizedStyle) {
        el.setAttribute('style', sanitizedStyle);
      } else {
        el.removeAttribute('style');
      }
    }
    
    // Sanitize href attributes
    if (el.hasAttribute('href')) {
      const href = el.getAttribute('href') || '';
      if (!isValidUrl(href)) {
        el.removeAttribute('href');
      } else if (el.tagName.toLowerCase() === 'a') {
        // Add security attributes to links
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
    
    // Sanitize src attributes
    if (el.hasAttribute('src')) {
      const src = el.getAttribute('src') || '';
      if (!isValidImageSrc(src)) {
        el.removeAttribute('src');
      }
    }
  });

  return doc.body.innerHTML;
}

/**
 * Sanitize CSS style string
 * @param style - The CSS style string to sanitize
 * @returns Sanitized CSS string
 */
function sanitizeStyle(style: string): string {
  if (!style) return '';
  
  // Remove dangerous CSS
  let sanitized = style.toLowerCase();
  for (const prop of DANGEROUS_CSS_PROPERTIES) {
    if (sanitized.includes(prop)) {
      return '';
    }
  }
  
  // Remove url() with javascript
  if (/url\s*\(\s*['"]?javascript/i.test(style)) {
    return '';
  }
  
  return style;
}

/**
 * Check if URL is valid and safe
 * @param url - URL to validate
 * @returns boolean
 */
function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  const trimmed = url.trim().toLowerCase();
  
  // Allow relative URLs
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./')) {
    return true;
  }
  
  // Allow mailto and tel
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return true;
  }
  
  // Block dangerous protocols
  if (trimmed.startsWith('javascript:') || 
      trimmed.startsWith('data:') || 
      trimmed.startsWith('vbscript:')) {
    return false;
  }
  
  // Allow http(s)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return true;
  }
  
  return false;
}

/**
 * Check if image src is valid
 * @param src - Image source to validate
 * @returns boolean
 */
function isValidImageSrc(src: string): boolean {
  if (!src) return false;
  
  const trimmed = src.trim().toLowerCase();
  
  // Allow relative paths
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return true;
  }
  
  // Allow https images
  if (trimmed.startsWith('https://')) {
    return true;
  }
  
  // Allow http images (with caution)
  if (trimmed.startsWith('http://')) {
    return true;
  }
  
  // Allow data:image for base64 images only (common for generated content)
  if (trimmed.startsWith('data:image/')) {
    return true;
  }
  
  return false;
}

/**
 * Escape HTML special characters to prevent XSS
 * Use this for text content that should not contain any HTML
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return text.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
}

/**
 * Create a safe HTML component wrapper
 * @param html - HTML content to render safely
 * @returns Object suitable for dangerouslySetInnerHTML
 */
export function createSafeHtml(html: string): { __html: string } {
  return { __html: sanitizeHtml(html) };
}
