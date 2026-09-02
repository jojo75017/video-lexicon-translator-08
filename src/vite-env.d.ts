/// <reference types="vite/client" />

declare module '*.pdf' {
  const src: string;
  export default src;
}

/** Pointeur d'asset généré par l'outil vidéo/image (format .asset.json). */
declare module '*.asset.json' {
  const value: { url: string; [key: string]: unknown };
  export default value;
}
