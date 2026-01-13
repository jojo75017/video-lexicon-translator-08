/**
 * Secure Storage utility for handling sensitive data
 * Provides warnings and best practices for localStorage usage
 */

// Keys that contain sensitive data
const SENSITIVE_KEYS = [
  'openai_api_key',
  'user_openai_key',
  'openaiKey',
  'instagramApiKey',
  'serpApiConfig',
  'subscriber_data',
  'access_code'
];

/**
 * Check if a key contains sensitive data
 */
function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.some(sensitiveKey => 
    key.toLowerCase().includes(sensitiveKey.toLowerCase()) ||
    key.toLowerCase().includes('api_key') ||
    key.toLowerCase().includes('apikey') ||
    key.toLowerCase().includes('token') ||
    key.toLowerCase().includes('secret') ||
    key.toLowerCase().includes('password')
  );
}

/**
 * Secure wrapper for localStorage.setItem
 * Uses sessionStorage for sensitive data (cleared when tab closes)
 * @param key - Storage key
 * @param value - Value to store
 * @param options - Storage options
 */
export function secureSetItem(
  key: string, 
  value: string, 
  options: { 
    useSessionStorage?: boolean;
    warnOnSensitive?: boolean;
  } = {}
): void {
  const { useSessionStorage = false, warnOnSensitive = true } = options;
  
  if (isSensitiveKey(key) && warnOnSensitive) {
    console.warn(
      `[Security] Storing sensitive data with key "${key}". ` +
      `Consider using sessionStorage or server-side storage for better security.`
    );
  }
  
  const storage = useSessionStorage ? sessionStorage : localStorage;
  storage.setItem(key, value);
}

/**
 * Secure wrapper for localStorage.getItem
 * @param key - Storage key
 * @param useSessionStorage - Whether to use sessionStorage instead
 */
export function secureGetItem(key: string, useSessionStorage = false): string | null {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  return storage.getItem(key);
}

/**
 * Secure wrapper for localStorage.removeItem
 * @param key - Storage key
 * @param useSessionStorage - Whether to use sessionStorage instead
 */
export function secureRemoveItem(key: string, useSessionStorage = false): void {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  storage.removeItem(key);
}

/**
 * Clear all sensitive data from storage
 * Call this on logout or when security is compromised
 */
export function clearSensitiveData(): void {
  const keysToRemove: string[] = [];
  
  // Check localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isSensitiveKey(key)) {
      keysToRemove.push(key);
    }
  }
  
  // Remove from localStorage
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Clear sessionStorage entirely as it contains more sensitive data
  const sessionKeysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && isSensitiveKey(key)) {
      sessionKeysToRemove.push(key);
    }
  }
  sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  
  console.log('[Security] Cleared sensitive data from storage');
}

/**
 * Generate a security warning message for API key storage
 */
export function getApiKeySecurityWarning(): string {
  return `⚠️ Avertissement de sécurité: Votre clé API est stockée localement dans votre navigateur. 
  Elle reste accessible dans ce navigateur uniquement. 
  Ne partagez jamais votre clé API et évitez d'utiliser des ordinateurs partagés.`;
}

/**
 * Validate that a string looks like an API key (basic format check)
 * @param key - The potential API key to validate
 * @param prefix - Expected prefix (e.g., 'sk-' for OpenAI)
 */
export function isValidApiKeyFormat(key: string, prefix?: string): boolean {
  if (!key || typeof key !== 'string') {
    return false;
  }
  
  const trimmed = key.trim();
  
  // Check minimum length
  if (trimmed.length < 20) {
    return false;
  }
  
  // Check prefix if provided
  if (prefix && !trimmed.startsWith(prefix)) {
    return false;
  }
  
  // Check for suspicious patterns (potential injection attempts)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /{|}|\[|\]/,
    /SELECT|INSERT|UPDATE|DELETE|DROP/i,
    /--|\|\||&&/
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Mask an API key for safe display
 * @param key - The API key to mask
 * @param visibleChars - Number of characters to show at start and end
 */
export function maskApiKey(key: string, visibleChars = 4): string {
  if (!key || key.length < visibleChars * 2 + 3) {
    return '***';
  }
  
  const start = key.slice(0, visibleChars);
  const end = key.slice(-visibleChars);
  const maskLength = Math.min(key.length - visibleChars * 2, 20);
  const mask = '*'.repeat(maskLength);
  
  return `${start}${mask}${end}`;
}
