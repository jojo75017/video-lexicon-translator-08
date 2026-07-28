import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as fabric from 'fabric';

export interface CoverCanvasHandle {
  getCanvas: () => fabric.Canvas | null;
  exportPNG: (multiplier?: number) => string;
  exportJSON: () => unknown;
  loadJSON: (json: unknown) => Promise<void>;
}

interface Props {
  width: number;
  height: number;
  bleed?: number;
  /** Zones de guide (wrap KDP : back / spine / front) */
  guides?: Array<{ x: number; y: number; w: number; h: number; label?: string; color?: string }>;
  onReady?: (canvas: fabric.Canvas) => void;
}

/**
 * Canvas Fabric.js dimensionné au format print-ready (px @ 300 DPI).
 * Le canvas est mis à l'échelle via CSS pour tenir dans l'écran ; les données restent en 300 DPI.
 */
export const CoverCanvas = forwardRef<CoverCanvasHandle, Props>(
  ({ width, height, bleed = 0, guides, onReady }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => fabricRef.current,
      exportPNG: (multiplier = 1) => {
        const c = fabricRef.current;
        if (!c) return '';
        return c.toDataURL({ format: 'png', quality: 1, multiplier });
      },
      exportJSON: () => fabricRef.current?.toJSON() ?? null,
      loadJSON: async (json: unknown) => {
        const c = fabricRef.current;
        if (!c || !json) return;
        await c.loadFromJSON(json);
        c.renderAll();
      },
    }));

    useEffect(() => {
      if (!canvasElRef.current) return;
      const c = new fabric.Canvas(canvasElRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
      });
      fabricRef.current = c;

      // Guides de bleed (rouge, pointillé)
      if (bleed > 0) {
        const bleedRect = new fabric.Rect({
          left: bleed,
          top: bleed,
          width: width - bleed * 2,
          height: height - bleed * 2,
          fill: 'transparent',
          stroke: '#e11d48',
          strokeDashArray: [12, 8],
          strokeWidth: 2,
          selectable: false,
          evented: false,
          excludeFromExport: true,
        });
        c.add(bleedRect);
      }

      // Guides de zones (wrap : dos / tranche / front)
      if (guides) {
        guides.forEach((g) => {
          const rect = new fabric.Rect({
            left: g.x,
            top: g.y,
            width: g.w,
            height: g.h,
            fill: 'transparent',
            stroke: g.color ?? '#3b82f6',
            strokeDashArray: [6, 6],
            strokeWidth: 2,
            selectable: false,
            evented: false,
            excludeFromExport: true,
          });
          c.add(rect);
          if (g.label) {
            const label = new fabric.Text(g.label, {
              left: g.x + 20,
              top: g.y + 20,
              fontSize: 40,
              fill: g.color ?? '#3b82f6',
              fontFamily: 'sans-serif',
              selectable: false,
              evented: false,
              excludeFromExport: true,
            });
            c.add(label);
          }
        });
      }

      onReady?.(c);
      c.renderAll();

      // Fit-to-viewport via CSS scale
      const fit = () => {
        if (!wrapperRef.current || !canvasElRef.current) return;
        const parentW = wrapperRef.current.clientWidth - 32;
        const parentH = window.innerHeight - 220;
        const scale = Math.min(parentW / width, parentH / height, 1);
        const el = canvasElRef.current.parentElement as HTMLDivElement | null;
        if (el) {
          el.style.transform = `scale(${scale})`;
          el.style.transformOrigin = 'top left';
          el.style.width = `${width}px`;
          el.style.height = `${height}px`;
        }
        if (wrapperRef.current) {
          wrapperRef.current.style.height = `${height * scale + 16}px`;
        }
      };
      fit();
      window.addEventListener('resize', fit);

      return () => {
        window.removeEventListener('resize', fit);
        c.dispose();
        fabricRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, bleed]);

    return (
      <div
        ref={wrapperRef}
        className="w-full overflow-auto bg-neutral-100 rounded-lg border border-neutral-200 p-4"
      >
        <div>
          <canvas ref={canvasElRef} className="shadow-xl" />
        </div>
      </div>
    );
  }
);

CoverCanvas.displayName = 'CoverCanvas';
