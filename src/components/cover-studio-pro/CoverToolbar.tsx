import { Button } from '@/components/ui/button';
import { Type, Square, Circle, Image as ImageIcon, Trash2, Undo2, Redo2, Download } from 'lucide-react';
import * as fabric from 'fabric';

interface Props {
  canvas: fabric.Canvas | null;
  onExportPNG: () => void;
  onExportPDF: () => void;
}

export function CoverToolbar({ canvas, onExportPNG, onExportPDF }: Props) {
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('Titre du livre', {
      left: canvas.width! / 2 - 400,
      top: canvas.height! / 2 - 100,
      width: 800,
      fontSize: 120,
      fontFamily: 'Georgia',
      fontWeight: 'bold',
      fill: '#111827',
      textAlign: 'center',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addRect = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 200,
      top: 200,
      width: 400,
      height: 300,
      fill: '#008296',
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      radius: 200,
      fill: '#f59e0b',
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addImage = async (file: File) => {
    if (!canvas) return;
    const url = URL.createObjectURL(file);
    const img = await fabric.FabricImage.fromURL(url);
    // Adapt to canvas width (max 60%)
    const maxW = canvas.width! * 0.6;
    if (img.width! > maxW) img.scaleToWidth(maxW);
    img.set({ left: 100, top: 100 });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    active.forEach((o) => canvas.remove(o));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-b sticky top-0 z-10">
      <Button variant="outline" size="sm" onClick={addText} disabled={!canvas}>
        <Type className="w-4 h-4 mr-1" /> Texte
      </Button>
      <Button variant="outline" size="sm" onClick={addRect} disabled={!canvas}>
        <Square className="w-4 h-4 mr-1" /> Rectangle
      </Button>
      <Button variant="outline" size="sm" onClick={addCircle} disabled={!canvas}>
        <Circle className="w-4 h-4 mr-1" /> Cercle
      </Button>
      <label className="cursor-pointer">
        <Button variant="outline" size="sm" asChild disabled={!canvas}>
          <span>
            <ImageIcon className="w-4 h-4 mr-1" /> Image
          </span>
        </Button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) addImage(f);
            e.target.value = '';
          }}
        />
      </label>

      <div className="h-6 w-px bg-neutral-200 mx-1" />

      <Button variant="outline" size="sm" onClick={deleteSelected} disabled={!canvas}>
        <Trash2 className="w-4 h-4 mr-1" /> Supprimer
      </Button>
      <Button variant="outline" size="sm" disabled title="Undo (bientôt)">
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" disabled title="Redo (bientôt)">
        <Redo2 className="w-4 h-4" />
      </Button>

      <div className="flex-1" />

      <Button variant="outline" size="sm" onClick={onExportPNG} disabled={!canvas}>
        <Download className="w-4 h-4 mr-1" /> PNG 300 DPI
      </Button>
      <Button size="sm" onClick={onExportPDF} disabled={!canvas} className="bg-amber-500 hover:bg-amber-600">
        <Download className="w-4 h-4 mr-1" /> PDF print-ready
      </Button>
    </div>
  );
}
