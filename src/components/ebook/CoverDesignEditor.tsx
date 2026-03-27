import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import {
  Type, Square, Circle, Image as ImageIcon, Download, Trash2, Copy,
  ChevronUp, ChevronDown, Plus, Palette, Bold, Italic, AlignLeft,
  AlignCenter, AlignRight, Undo2, Redo2, ZoomIn, ZoomOut, Move,
  Layers, Eye, EyeOff, Lock, Unlock, RotateCcw, Upload, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// ===================== TYPES =====================

interface CoverElement {
  id: string;
  type: 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  name: string;
  // Text props
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textShadow?: string;
  // Shape props
  shapeType?: 'rect' | 'circle' | 'line' | 'triangle';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  // Image props
  imageUrl?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

interface CoverTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  bgColor: string;
  bgGradient?: string;
  elements: CoverElement[];
}

// ===================== CONSTANTS =====================

const CANVAS_W = 612; // 6 inches * 102 DPI (display)
const CANVAS_H = 936; // 9 inches * 104 DPI (display) — ~6x9 ratio
const EXPORT_SCALE = 3; // export at 3x for print quality

const FONTS = [
  'Georgia', 'Garamond', 'Playfair Display', 'Merriweather', 'Lora',
  'Montserrat', 'Raleway', 'Oswald', 'Roboto Slab', 'Libre Baskerville',
  'Cinzel', 'Cormorant Garamond', 'Crimson Text', 'EB Garamond',
  'Josefin Sans', 'Nunito', 'Poppins', 'Inter', 'DM Serif Display',
  'Bitter'
];

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#1a1a2e', '#16213e', '#0f3460', '#e94560',
  '#533483', '#2c3e50', '#c0392b', '#27ae60', '#f39c12', '#8e44ad',
  '#2980b9', '#d4a574', '#f5e6cc', '#2d2d2d', '#b8860b', '#708090'
];

const TEMPLATES: CoverTemplate[] = [
  {
    id: 'minimal-dark',
    name: 'Minimal Sombre',
    category: 'Moderne',
    thumbnail: '🌑',
    bgColor: '#1a1a2e',
    elements: [
      { id: 't1', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: CANVAS_H, rotation: 0, opacity: 1, visible: true, locked: true, name: 'Fond', shapeType: 'rect', fill: '#1a1a2e', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 't2', type: 'shape', x: 80, y: 400, width: CANVAS_W - 160, height: 3, rotation: 0, opacity: 0.5, visible: true, locked: false, name: 'Séparateur', shapeType: 'rect', fill: '#e94560', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 't3', type: 'text', x: 80, y: 300, width: CANVAS_W - 160, height: 80, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Titre', text: 'VOTRE TITRE', fontSize: 48, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF', letterSpacing: 4, lineHeight: 1.2 },
      { id: 't4', type: 'text', x: 80, y: 430, width: CANVAS_W - 160, height: 40, rotation: 0, opacity: 0.7, visible: true, locked: false, name: 'Sous-titre', text: 'Un sous-titre captivant', fontSize: 18, fontFamily: 'Montserrat', fontWeight: 'normal', fontStyle: 'italic', textAlign: 'center', color: '#FFFFFF', letterSpacing: 2 },
      { id: 't5', type: 'text', x: 80, y: 840, width: CANVAS_W - 160, height: 30, rotation: 0, opacity: 0.6, visible: true, locked: false, name: 'Auteur', text: 'NOM DE L\'AUTEUR', fontSize: 16, fontFamily: 'Montserrat', fontWeight: 'normal', textAlign: 'center', color: '#FFFFFF', letterSpacing: 6 },
    ]
  },
  {
    id: 'elegant-gold',
    name: 'Élégant Doré',
    category: 'Premium',
    thumbnail: '✨',
    bgColor: '#0f0f0f',
    bgGradient: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f0f 100%)',
    elements: [
      { id: 'e1', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: CANVAS_H, rotation: 0, opacity: 1, visible: true, locked: true, name: 'Fond', shapeType: 'rect', fill: '#0f0f0f', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'e2', type: 'shape', x: 30, y: 30, width: CANVAS_W - 60, height: CANVAS_H - 60, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Bordure dorée', shapeType: 'rect', fill: 'transparent', stroke: '#b8860b', strokeWidth: 2, borderRadius: 0 },
      { id: 'e3', type: 'shape', x: 40, y: 40, width: CANVAS_W - 80, height: CANVAS_H - 80, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Bordure intérieure', shapeType: 'rect', fill: 'transparent', stroke: '#b8860b', strokeWidth: 1, borderRadius: 0 },
      { id: 'e4', type: 'text', x: 60, y: 280, width: CANVAS_W - 120, height: 100, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Titre', text: 'VOTRE TITRE', fontSize: 52, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', color: '#b8860b', letterSpacing: 3 },
      { id: 'e5', type: 'shape', x: 200, y: 410, width: CANVAS_W - 400, height: 2, rotation: 0, opacity: 0.8, visible: true, locked: false, name: 'Ornement', shapeType: 'rect', fill: '#b8860b', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'e6', type: 'text', x: 60, y: 440, width: CANVAS_W - 120, height: 40, rotation: 0, opacity: 0.8, visible: true, locked: false, name: 'Sous-titre', text: 'Un sous-titre élégant', fontSize: 20, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', textAlign: 'center', color: '#d4a574' },
      { id: 'e7', type: 'text', x: 60, y: 830, width: CANVAS_W - 120, height: 30, rotation: 0, opacity: 0.7, visible: true, locked: false, name: 'Auteur', text: 'NOM DE L\'AUTEUR', fontSize: 14, fontFamily: 'Montserrat', fontWeight: 'normal', textAlign: 'center', color: '#b8860b', letterSpacing: 8 },
    ]
  },
  {
    id: 'romance-soft',
    name: 'Romance',
    category: 'Fiction',
    thumbnail: '💕',
    bgColor: '#f5e6cc',
    elements: [
      { id: 'r1', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: CANVAS_H, rotation: 0, opacity: 1, visible: true, locked: true, name: 'Fond', shapeType: 'rect', fill: '#f5e6cc', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'r2', type: 'text', x: 60, y: 250, width: CANVAS_W - 120, height: 120, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Titre', text: 'Titre\nRomantique', fontSize: 56, fontFamily: 'Playfair Display', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center', color: '#8e44ad', lineHeight: 1.1 },
      { id: 'r3', type: 'shape', x: 230, y: 400, width: CANVAS_W - 460, height: 2, rotation: 0, opacity: 0.5, visible: true, locked: false, name: 'Trait', shapeType: 'rect', fill: '#8e44ad', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'r4', type: 'text', x: 60, y: 420, width: CANVAS_W - 120, height: 40, rotation: 0, opacity: 0.8, visible: true, locked: false, name: 'Accroche', text: 'Une histoire d\'amour inoubliable', fontSize: 16, fontFamily: 'Lora', fontStyle: 'italic', textAlign: 'center', color: '#6b4c7a' },
      { id: 'r5', type: 'text', x: 60, y: 850, width: CANVAS_W - 120, height: 30, rotation: 0, opacity: 0.6, visible: true, locked: false, name: 'Auteur', text: 'Nom de l\'Auteur', fontSize: 16, fontFamily: 'Montserrat', textAlign: 'center', color: '#8e44ad', letterSpacing: 4 },
    ]
  },
  {
    id: 'thriller-bold',
    name: 'Thriller',
    category: 'Fiction',
    thumbnail: '🔥',
    bgColor: '#1a1a1a',
    elements: [
      { id: 'th1', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: CANVAS_H, rotation: 0, opacity: 1, visible: true, locked: true, name: 'Fond', shapeType: 'rect', fill: '#1a1a1a', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'th2', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: 6, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Barre rouge', shapeType: 'rect', fill: '#c0392b', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'th3', type: 'text', x: 40, y: 300, width: CANVAS_W - 80, height: 100, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Titre', text: 'DANGER\nIMMINENT', fontSize: 60, fontFamily: 'Oswald', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF', letterSpacing: 2, lineHeight: 1 },
      { id: 'th4', type: 'text', x: 40, y: 440, width: CANVAS_W - 80, height: 30, rotation: 0, opacity: 0.6, visible: true, locked: false, name: 'Tagline', text: 'LE TEMPS PRESSE', fontSize: 14, fontFamily: 'Montserrat', fontWeight: 'normal', textAlign: 'center', color: '#c0392b', letterSpacing: 8 },
      { id: 'th5', type: 'shape', x: 0, y: CANVAS_H - 6, width: CANVAS_W, height: 6, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Barre bas', shapeType: 'rect', fill: '#c0392b', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'th6', type: 'text', x: 40, y: 850, width: CANVAS_W - 80, height: 30, rotation: 0, opacity: 0.5, visible: true, locked: false, name: 'Auteur', text: 'NOM DE L\'AUTEUR', fontSize: 14, fontFamily: 'Montserrat', textAlign: 'center', color: '#FFFFFF', letterSpacing: 6 },
    ]
  },
  {
    id: 'dev-perso',
    name: 'Développement Personnel',
    category: 'Non-fiction',
    thumbnail: '🧠',
    bgColor: '#FFFFFF',
    elements: [
      { id: 'd1', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: CANVAS_H, rotation: 0, opacity: 1, visible: true, locked: true, name: 'Fond', shapeType: 'rect', fill: '#FFFFFF', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'd2', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: 300, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Bandeau', shapeType: 'rect', fill: '#2980b9', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'd3', type: 'text', x: 50, y: 80, width: CANVAS_W - 100, height: 120, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Titre', text: 'CHANGEZ\nVOTRE VIE', fontSize: 50, fontFamily: 'Montserrat', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF', lineHeight: 1.1 },
      { id: 'd4', type: 'text', x: 50, y: 220, width: CANVAS_W - 100, height: 40, rotation: 0, opacity: 0.9, visible: true, locked: false, name: 'Sous-titre', text: 'Les 7 habitudes qui transforment tout', fontSize: 16, fontFamily: 'Montserrat', textAlign: 'center', color: '#FFFFFF' },
      { id: 'd5', type: 'shape', x: 50, y: 350, width: CANVAS_W - 100, height: 3, rotation: 0, opacity: 0.3, visible: true, locked: false, name: 'Séparateur', shapeType: 'rect', fill: '#2980b9', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'd6', type: 'text', x: 50, y: 850, width: CANVAS_W - 100, height: 30, rotation: 0, opacity: 0.7, visible: true, locked: false, name: 'Auteur', text: 'Nom de l\'Auteur', fontSize: 16, fontFamily: 'Montserrat', textAlign: 'center', color: '#2980b9', letterSpacing: 4 },
    ]
  },
  {
    id: 'nature-zen',
    name: 'Nature & Bien-être',
    category: 'Non-fiction',
    thumbnail: '🌿',
    bgColor: '#f0f4f0',
    elements: [
      { id: 'n1', type: 'shape', x: 0, y: 0, width: CANVAS_W, height: CANVAS_H, rotation: 0, opacity: 1, visible: true, locked: true, name: 'Fond', shapeType: 'rect', fill: '#f0f4f0', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
      { id: 'n2', type: 'text', x: 60, y: 320, width: CANVAS_W - 120, height: 100, rotation: 0, opacity: 1, visible: true, locked: false, name: 'Titre', text: 'Harmonie\nIntérieure', fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center', color: '#27ae60', lineHeight: 1.2 },
      { id: 'n3', type: 'text', x: 60, y: 450, width: CANVAS_W - 120, height: 40, rotation: 0, opacity: 0.7, visible: true, locked: false, name: 'Sous-titre', text: 'Retrouvez la paix avec la nature', fontSize: 16, fontFamily: 'Lora', fontStyle: 'italic', textAlign: 'center', color: '#2d5a3e' },
      { id: 'n4', type: 'text', x: 60, y: 850, width: CANVAS_W - 120, height: 30, rotation: 0, opacity: 0.5, visible: true, locked: false, name: 'Auteur', text: 'Nom de l\'Auteur', fontSize: 14, fontFamily: 'Montserrat', textAlign: 'center', color: '#27ae60', letterSpacing: 5 },
    ]
  }
];

// ===================== COMPONENT =====================

interface CoverDesignEditorProps {
  ebookTitle?: string;
  authorName?: string;
  onCoverExported?: (dataUrl: string) => void;
}

export const CoverDesignEditor: React.FC<CoverDesignEditorProps> = ({
  ebookTitle = '',
  authorName = '',
  onCoverExported
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [elements, setElements] = useState<CoverElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [bgGradient, setBgGradient] = useState('');
  const [bgImage, setBgImage] = useState('');
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<CoverElement[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; handle: string; startX: number; startY: number; startW: number; startH: number; startEX: number; startEY: number } | null>(null);

  const selectedElement = elements.find(e => e.id === selectedId);

  // Push to history
  const pushHistory = useCallback((newElements: CoverElement[]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIdx + 1);
      return [...trimmed, newElements];
    });
    setHistoryIdx(prev => prev + 1);
  }, [historyIdx]);

  const updateElements = useCallback((newElements: CoverElement[]) => {
    setElements(newElements);
    pushHistory(newElements);
  }, [pushHistory]);

  const undo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setElements(history[historyIdx - 1]);
    }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setElements(history[historyIdx + 1]);
    }
  };

  // Generate unique ID
  const genId = () => `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  // Add elements
  const addText = () => {
    const el: CoverElement = {
      id: genId(), type: 'text', x: 100, y: 400, width: CANVAS_W - 200, height: 60,
      rotation: 0, opacity: 1, visible: true, locked: false, name: 'Texte',
      text: 'Nouveau texte', fontSize: 32, fontFamily: 'Montserrat', fontWeight: 'bold',
      textAlign: 'center', color: '#FFFFFF', letterSpacing: 0, lineHeight: 1.2
    };
    updateElements([...elements, el]);
    setSelectedId(el.id);
  };

  const addShape = (shapeType: 'rect' | 'circle' | 'line') => {
    const el: CoverElement = {
      id: genId(), type: 'shape', x: 150, y: 400,
      width: shapeType === 'line' ? 300 : 200, height: shapeType === 'line' ? 4 : 200,
      rotation: 0, opacity: 1, visible: true, locked: false,
      name: shapeType === 'rect' ? 'Rectangle' : shapeType === 'circle' ? 'Cercle' : 'Ligne',
      shapeType, fill: '#e94560', stroke: 'transparent', strokeWidth: 0, borderRadius: 0
    };
    updateElements([...elements, el]);
    setSelectedId(el.id);
  };

  const addImage = (url: string) => {
    const el: CoverElement = {
      id: genId(), type: 'image', x: 50, y: 50, width: CANVAS_W - 100, height: 400,
      rotation: 0, opacity: 1, visible: true, locked: false, name: 'Image',
      imageUrl: url, objectFit: 'cover'
    };
    updateElements([...elements, el]);
    setSelectedId(el.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Fichier image requis'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) addImage(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setBgImage(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  // Update single element
  const updateElement = (id: string, changes: Partial<CoverElement>) => {
    const newEls = elements.map(e => e.id === id ? { ...e, ...changes } : e);
    updateElements(newEls);
  };

  const deleteElement = (id: string) => {
    updateElements(elements.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateElement = (id: string) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const dup = { ...el, id: genId(), x: el.x + 20, y: el.y + 20, name: el.name + ' copie' };
    updateElements([...elements, dup]);
    setSelectedId(dup.id);
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const idx = elements.findIndex(e => e.id === id);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (newIdx < 0 || newIdx >= elements.length) return;
    const newEls = [...elements];
    [newEls[idx], newEls[newIdx]] = [newEls[newIdx], newEls[idx]];
    updateElements(newEls);
  };

  // Apply template
  const applyTemplate = (template: CoverTemplate) => {
    const newElements = template.elements.map(el => ({
      ...el,
      id: genId(),
      text: el.text?.replace('VOTRE TITRE', ebookTitle || 'VOTRE TITRE')
        .replace('Titre\nRomantique', ebookTitle || 'Titre\nRomantique')
        .replace('DANGER\nIMMINENT', ebookTitle || 'VOTRE TITRE')
        .replace('CHANGEZ\nVOTRE VIE', ebookTitle || 'VOTRE TITRE')
        .replace('Harmonie\nIntérieure', ebookTitle || 'Votre Titre')
        .replace("NOM DE L'AUTEUR", authorName || "NOM DE L'AUTEUR")
        .replace("Nom de l'Auteur", authorName || "Nom de l'Auteur")
    }));
    setBgColor(template.bgColor);
    setBgGradient(template.bgGradient || '');
    setBgImage('');
    updateElements(newElements);
    setSelectedId(null);
    toast.success(`Template "${template.name}" appliqué`);
  };

  // =================== DRAG & DROP ===================
  
  const getCanvasPos = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent, elId: string) => {
    e.stopPropagation();
    const el = elements.find(el => el.id === elId);
    if (!el || el.locked) return;
    setSelectedId(elId);
    const pos = getCanvasPos(e);
    setDragging({ id: elId, offsetX: pos.x - el.x, offsetY: pos.y - el.y });
  };

  const handleResizeStart = (e: React.MouseEvent, elId: string, handle: string) => {
    e.stopPropagation();
    const el = elements.find(el => el.id === elId);
    if (!el || el.locked) return;
    const pos = getCanvasPos(e);
    setResizing({ id: elId, handle, startX: pos.x, startY: pos.y, startW: el.width, startH: el.height, startEX: el.x, startEY: el.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    if (dragging) {
      setElements(prev => prev.map(el => el.id === dragging.id ? {
        ...el,
        x: Math.max(0, Math.min(CANVAS_W - el.width, pos.x - dragging.offsetX)),
        y: Math.max(0, Math.min(CANVAS_H - el.height, pos.y - dragging.offsetY))
      } : el));
    }
    if (resizing) {
      const dx = pos.x - resizing.startX;
      const dy = pos.y - resizing.startY;
      setElements(prev => prev.map(el => {
        if (el.id !== resizing.id) return el;
        let { x, y, width, height } = el;
        const h = resizing.handle;
        if (h.includes('e')) width = Math.max(30, resizing.startW + dx);
        if (h.includes('s')) height = Math.max(20, resizing.startH + dy);
        if (h.includes('w')) { width = Math.max(30, resizing.startW - dx); x = resizing.startEX + dx; }
        if (h.includes('n')) { height = Math.max(20, resizing.startH - dy); y = resizing.startEY + dy; }
        return { ...el, x, y, width, height };
      }));
    }
  }, [dragging, resizing, zoom]);

  const handleMouseUp = () => {
    if (dragging || resizing) pushHistory(elements);
    setDragging(null);
    setResizing(null);
  };

  // =================== EXPORT ===================

  const exportCover = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W * EXPORT_SCALE;
    canvas.height = CANVAS_H * EXPORT_SCALE;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

    // Background
    if (bgImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => { img.onload = () => resolve(); img.src = bgImage; });
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // Elements
    for (const el of elements) {
      if (!el.visible) continue;
      ctx.save();
      ctx.globalAlpha = el.opacity;
      if (el.rotation) {
        ctx.translate(el.x + el.width / 2, el.y + el.height / 2);
        ctx.rotate((el.rotation * Math.PI) / 180);
        ctx.translate(-(el.x + el.width / 2), -(el.y + el.height / 2));
      }

      if (el.type === 'shape') {
        if (el.shapeType === 'circle') {
          ctx.beginPath();
          ctx.ellipse(el.x + el.width / 2, el.y + el.height / 2, el.width / 2, el.height / 2, 0, 0, Math.PI * 2);
          if (el.fill && el.fill !== 'transparent') { ctx.fillStyle = el.fill; ctx.fill(); }
          if (el.stroke && el.stroke !== 'transparent' && el.strokeWidth) { ctx.strokeStyle = el.stroke; ctx.lineWidth = el.strokeWidth; ctx.stroke(); }
        } else {
          if (el.fill && el.fill !== 'transparent') { ctx.fillStyle = el.fill; ctx.fillRect(el.x, el.y, el.width, el.height); }
          if (el.stroke && el.stroke !== 'transparent' && el.strokeWidth) { ctx.strokeStyle = el.stroke; ctx.lineWidth = el.strokeWidth; ctx.strokeRect(el.x, el.y, el.width, el.height); }
        }
      }

      if (el.type === 'text' && el.text) {
        const style = `${el.fontStyle || ''} ${el.fontWeight || ''} ${el.fontSize}px ${el.fontFamily}`.trim();
        ctx.font = style;
        ctx.fillStyle = el.color || '#000';
        ctx.textAlign = el.textAlign || 'center';
        ctx.textBaseline = 'top';
        const lines = el.text.split('\n');
        const lh = (el.fontSize || 32) * (el.lineHeight || 1.2);
        const xPos = el.textAlign === 'center' ? el.x + el.width / 2 : el.textAlign === 'right' ? el.x + el.width : el.x;
        lines.forEach((line, i) => {
          if (el.letterSpacing) {
            // Manual letter spacing for canvas
            const chars = line.split('');
            let cx = xPos;
            if (el.textAlign === 'center') {
              const totalW = chars.reduce((w, c) => w + ctx.measureText(c).width + (el.letterSpacing || 0), 0);
              cx = xPos - totalW / 2;
            }
            ctx.textAlign = 'left';
            chars.forEach(c => {
              ctx.fillText(c, cx, el.y + i * lh);
              cx += ctx.measureText(c).width + (el.letterSpacing || 0);
            });
            ctx.textAlign = el.textAlign || 'center';
          } else {
            ctx.fillText(line, xPos, el.y + i * lh);
          }
        });
      }

      if (el.type === 'image' && el.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = el.imageUrl!; });
          ctx.drawImage(img, el.x, el.y, el.width, el.height);
        } catch {}
      }

      ctx.restore();
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    // Download
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `couverture-${(ebookTitle || 'ebook').replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
    onCoverExported?.(dataUrl);
    toast.success('Couverture exportée en haute résolution !');
  };

  // =================== RENDER HELPERS ===================

  const renderElement = (el: CoverElement) => {
    if (!el.visible) return null;
    const isSelected = selectedId === el.id;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      opacity: el.opacity,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      cursor: el.locked ? 'not-allowed' : 'move',
      outline: isSelected ? '2px solid hsl(var(--primary))' : 'none',
      outlineOffset: '1px',
      userSelect: 'none' as const,
      pointerEvents: 'all' as const,
    };

    let content: React.ReactNode = null;

    if (el.type === 'shape') {
      if (el.shapeType === 'circle') {
        content = <div style={{ ...baseStyle, borderRadius: '50%', background: el.fill, border: el.stroke && el.stroke !== 'transparent' ? `${el.strokeWidth}px solid ${el.stroke}` : 'none' }} onMouseDown={(e) => handleMouseDown(e, el.id)} />;
      } else {
        content = <div style={{ ...baseStyle, background: el.fill, border: el.stroke && el.stroke !== 'transparent' ? `${el.strokeWidth}px solid ${el.stroke}` : 'none', borderRadius: el.borderRadius }} onMouseDown={(e) => handleMouseDown(e, el.id)} />;
      }
    }

    if (el.type === 'text') {
      content = (
        <div
          style={{
            ...baseStyle,
            fontSize: el.fontSize,
            fontFamily: el.fontFamily,
            fontWeight: el.fontWeight as any,
            fontStyle: el.fontStyle,
            textAlign: el.textAlign,
            color: el.color,
            letterSpacing: el.letterSpacing,
            lineHeight: el.lineHeight,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start',
            textShadow: el.textShadow,
          }}
          onMouseDown={(e) => handleMouseDown(e, el.id)}
        >
          <span style={{ width: '100%', textAlign: el.textAlign }}>{el.text}</span>
        </div>
      );
    }

    if (el.type === 'image') {
      content = (
        <div style={baseStyle} onMouseDown={(e) => handleMouseDown(e, el.id)}>
          <img src={el.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: el.objectFit || 'cover', pointerEvents: 'none' }} />
        </div>
      );
    }

    return (
      <React.Fragment key={el.id}>
        {content}
        {isSelected && !el.locked && (
          <>
            {['nw','ne','sw','se','n','s','e','w'].map(handle => {
              const s: React.CSSProperties = {
                position: 'absolute',
                width: handle.length === 1 ? (handle === 'n' || handle === 's' ? 12 : 8) : 10,
                height: handle.length === 1 ? (handle === 'e' || handle === 'w' ? 12 : 8) : 10,
                background: 'hsl(var(--primary))',
                border: '2px solid white',
                borderRadius: 2,
                zIndex: 999,
                cursor: `${handle}-resize`,
              };
              if (handle.includes('n')) s.top = el.y - 5;
              if (handle.includes('s')) s.top = el.y + el.height - 5;
              if (handle.includes('w')) s.left = el.x - 5;
              if (handle.includes('e')) s.left = el.x + el.width - 5;
              if (handle === 'n' || handle === 's') s.left = el.x + el.width / 2 - 6;
              if (handle === 'e' || handle === 'w') s.top = el.y + el.height / 2 - 6;
              if (handle === 'nw' || handle === 'sw') s.left = el.x - 5;
              if (handle === 'ne' || handle === 'se') s.left = el.x + el.width - 5;
              if (handle === 'nw' || handle === 'ne') s.top = el.y - 5;
              if (handle === 'sw' || handle === 'se') s.top = el.y + el.height - 5;
              return <div key={handle} style={s} onMouseDown={(e) => handleResizeStart(e, el.id, handle)} />;
            })}
          </>
        )}
      </React.Fragment>
    );
  };

  // =================== JSX ===================

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Éditeur de Couverture</h2>
          <Badge variant="secondary" className="text-xs">Style Canva</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIdx <= 0}><Undo2 className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIdx >= history.length - 1}><Redo2 className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
          <Button onClick={exportCover} className="bg-primary text-primary-foreground gap-1">
            <Download className="h-4 w-4" /> Exporter PNG
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* LEFT PANEL: Tools + Templates */}
        <div className="w-72 flex-shrink-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
                <TabsTrigger value="elements" className="text-xs">Éléments</TabsTrigger>
                <TabsTrigger value="fond" className="text-xs">Fond</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-2 mt-2">
                {['Moderne', 'Premium', 'Fiction', 'Non-fiction'].map(cat => {
                  const tpls = TEMPLATES.filter(t => t.category === cat);
                  if (!tpls.length) return null;
                  return (
                    <div key={cat}>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">{cat}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {tpls.map(t => (
                          <button
                            key={t.id}
                            onClick={() => applyTemplate(t)}
                            className="border border-border rounded-lg p-2 hover:border-primary transition-colors text-left"
                            style={{ background: t.bgColor }}
                          >
                            <span className="text-lg">{t.thumbnail}</span>
                            <p className="text-[10px] font-medium mt-1" style={{ color: t.bgColor === '#FFFFFF' || t.bgColor === '#f5e6cc' || t.bgColor === '#f0f4f0' ? '#333' : '#fff' }}>{t.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="elements" className="space-y-3 mt-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Texte</p>
                  <Button variant="outline" size="sm" onClick={addText} className="w-full gap-2">
                    <Type className="h-4 w-4" /> Ajouter un texte
                  </Button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Formes</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => addShape('rect')} className="flex-1 gap-1"><Square className="h-4 w-4" /> Rect</Button>
                    <Button variant="outline" size="sm" onClick={() => addShape('circle')} className="flex-1 gap-1"><Circle className="h-4 w-4" /> Cercle</Button>
                    <Button variant="outline" size="sm" onClick={() => addShape('line')} className="flex-1 gap-1">— Ligne</Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Image</p>
                  <label className="w-full">
                    <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                      <span><Upload className="h-4 w-4" /> Importer une image</span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </TabsContent>

              <TabsContent value="fond" className="space-y-3 mt-2">
                <div>
                  <Label className="text-xs">Couleur de fond</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => { setBgColor(c); setBgImage(''); }}
                        className="w-7 h-7 rounded border border-border hover:scale-110 transition-transform"
                        style={{ background: c, outline: bgColor === c ? '2px solid hsl(var(--primary))' : 'none', outlineOffset: '2px' }}
                      />
                    ))}
                  </div>
                  <Input type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); setBgImage(''); }} className="mt-2 h-8" />
                </div>
                <div>
                  <Label className="text-xs">Image de fond</Label>
                  <label className="w-full mt-1">
                    <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                      <span><Upload className="h-4 w-4" /> Charger une image</span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} />
                  </label>
                  {bgImage && <Button variant="ghost" size="sm" onClick={() => setBgImage('')} className="mt-1 text-xs">Retirer l'image</Button>}
                </div>
              </TabsContent>
            </Tabs>

            {/* Layers Panel */}
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Layers className="h-3 w-3" /> Calques</p>
              <div className="space-y-1">
                {[...elements].reverse().map(el => (
                  <button
                    key={el.id}
                    onClick={() => setSelectedId(el.id)}
                    className={`w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded transition-colors ${selectedId === el.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                  >
                    {el.type === 'text' ? <Type className="h-3 w-3 flex-shrink-0" /> : el.type === 'shape' ? <Square className="h-3 w-3 flex-shrink-0" /> : <ImageIcon className="h-3 w-3 flex-shrink-0" />}
                    <span className="truncate flex-1">{el.name}</span>
                    {el.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                    {!el.visible && <EyeOff className="h-3 w-3 text-muted-foreground" />}
                  </button>
                ))}
                {elements.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-2">Aucun calque</p>}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* CENTER: Canvas */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-muted/30 rounded-xl border border-border">
          <div
            ref={containerRef}
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              position: 'relative',
              background: bgImage ? `url(${bgImage}) center/cover no-repeat` : bgGradient || bgColor,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}
          >
            {elements.map(renderElement)}
          </div>
        </div>

        {/* RIGHT PANEL: Properties */}
        <div className="w-64 flex-shrink-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            {selectedElement ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{selectedElement.name}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}>
                      {selectedElement.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateElement(selectedElement.id, { visible: !selectedElement.visible })}>
                      {selectedElement.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                {/* Position */}
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-[10px]">X</Label><Input type="number" value={Math.round(selectedElement.x)} onChange={e => updateElement(selectedElement.id, { x: +e.target.value })} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">Y</Label><Input type="number" value={Math.round(selectedElement.y)} onChange={e => updateElement(selectedElement.id, { y: +e.target.value })} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">Largeur</Label><Input type="number" value={Math.round(selectedElement.width)} onChange={e => updateElement(selectedElement.id, { width: +e.target.value })} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">Hauteur</Label><Input type="number" value={Math.round(selectedElement.height)} onChange={e => updateElement(selectedElement.id, { height: +e.target.value })} className="h-7 text-xs" /></div>
                </div>

                {/* Opacity & Rotation */}
                <div>
                  <Label className="text-[10px]">Opacité: {Math.round(selectedElement.opacity * 100)}%</Label>
                  <Slider value={[selectedElement.opacity * 100]} onValueChange={([v]) => updateElement(selectedElement.id, { opacity: v / 100 })} min={0} max={100} step={1} className="mt-1" />
                </div>
                <div>
                  <Label className="text-[10px]">Rotation: {selectedElement.rotation}°</Label>
                  <Slider value={[selectedElement.rotation]} onValueChange={([v]) => updateElement(selectedElement.id, { rotation: v })} min={-180} max={180} step={1} className="mt-1" />
                </div>

                {/* Text-specific */}
                {selectedElement.type === 'text' && (
                  <>
                    <div>
                      <Label className="text-[10px]">Texte</Label>
                      <textarea
                        value={selectedElement.text || ''}
                        onChange={e => updateElement(selectedElement.id, { text: e.target.value })}
                        className="w-full h-20 text-xs border border-border rounded px-2 py-1 bg-background text-foreground resize-none"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Police</Label>
                      <Select value={selectedElement.fontFamily} onValueChange={v => updateElement(selectedElement.id, { fontFamily: v })}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{FONTS.map(f => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-[10px]">Taille</Label><Input type="number" value={selectedElement.fontSize || 32} onChange={e => updateElement(selectedElement.id, { fontSize: +e.target.value })} className="h-7 text-xs" /></div>
                      <div><Label className="text-[10px]">Espacement</Label><Input type="number" value={selectedElement.letterSpacing || 0} onChange={e => updateElement(selectedElement.id, { letterSpacing: +e.target.value })} className="h-7 text-xs" /></div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant={selectedElement.fontWeight === 'bold' ? 'default' : 'outline'} size="icon" className="h-7 w-7" onClick={() => updateElement(selectedElement.id, { fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}><Bold className="h-3 w-3" /></Button>
                      <Button variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'} size="icon" className="h-7 w-7" onClick={() => updateElement(selectedElement.id, { fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}><Italic className="h-3 w-3" /></Button>
                      <Button variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'} size="icon" className="h-7 w-7" onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}><AlignLeft className="h-3 w-3" /></Button>
                      <Button variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'} size="icon" className="h-7 w-7" onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}><AlignCenter className="h-3 w-3" /></Button>
                      <Button variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'} size="icon" className="h-7 w-7" onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}><AlignRight className="h-3 w-3" /></Button>
                    </div>
                    <div>
                      <Label className="text-[10px]">Couleur</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {PRESET_COLORS.slice(0, 12).map(c => (
                          <button key={c} onClick={() => updateElement(selectedElement.id, { color: c })} className="w-6 h-6 rounded border border-border" style={{ background: c, outline: selectedElement.color === c ? '2px solid hsl(var(--primary))' : 'none', outlineOffset: '1px' }} />
                        ))}
                      </div>
                      <Input type="color" value={selectedElement.color || '#FFFFFF'} onChange={e => updateElement(selectedElement.id, { color: e.target.value })} className="mt-1 h-7" />
                    </div>
                  </>
                )}

                {/* Shape-specific */}
                {selectedElement.type === 'shape' && (
                  <>
                    <div>
                      <Label className="text-[10px]">Remplissage</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {PRESET_COLORS.slice(0, 12).map(c => (
                          <button key={c} onClick={() => updateElement(selectedElement.id, { fill: c })} className="w-6 h-6 rounded border border-border" style={{ background: c, outline: selectedElement.fill === c ? '2px solid hsl(var(--primary))' : 'none', outlineOffset: '1px' }} />
                        ))}
                      </div>
                      <Input type="color" value={selectedElement.fill || '#000'} onChange={e => updateElement(selectedElement.id, { fill: e.target.value })} className="mt-1 h-7" />
                    </div>
                    <div>
                      <Label className="text-[10px]">Bordure</Label>
                      <Input type="color" value={selectedElement.stroke || '#000'} onChange={e => updateElement(selectedElement.id, { stroke: e.target.value })} className="h-7" />
                      <Slider value={[selectedElement.strokeWidth || 0]} onValueChange={([v]) => updateElement(selectedElement.id, { strokeWidth: v })} min={0} max={10} step={1} className="mt-1" />
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex gap-1 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => duplicateElement(selectedElement.id)} className="flex-1 gap-1 text-xs"><Copy className="h-3 w-3" /> Dupliquer</Button>
                  <Button variant="outline" size="sm" onClick={() => moveLayer(selectedElement.id, 'up')} className="h-8 w-8 p-0"><ChevronUp className="h-3 w-3" /></Button>
                  <Button variant="outline" size="sm" onClick={() => moveLayer(selectedElement.id, 'down')} className="h-8 w-8 p-0"><ChevronDown className="h-3 w-3" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteElement(selectedElement.id)} className="h-8 w-8 p-0"><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Move className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Sélectionnez un élément pour le modifier</p>
                <p className="text-xs text-muted-foreground/60 mt-1">ou choisissez un template à gauche</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CoverDesignEditor;
