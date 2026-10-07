/** Shared canvas text layout for wrap exports and front thumbnails. */
export interface CoverTextStyle {
  align: 'left' | 'center' | 'right' | 'justify';
  underline?: boolean;
  lineHeight: number;
}

export function drawCoverText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  fontPx: number,
  style: CoverTextStyle,
): void {
  ctx.save();
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = Math.max(1, fontPx / 18);
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && ctx.measureText(candidate).width > width) {
        lines.push(current);
        current = word;
      } else current = candidate;
    }
    lines.push(current);
    lines.forEach((line, index) => {
      const naturalWidth = ctx.measureText(line).width;
      const justify = style.align === 'justify' && index < lines.length - 1 && line.includes(' ');
      const left = style.align === 'center' ? x + (width - naturalWidth) / 2 : style.align === 'right' ? x + width - naturalWidth : x;
      if (justify) {
        const parts = line.split(' ');
        const glyphWidth = parts.reduce((sum, word) => sum + ctx.measureText(word).width, 0);
        const gap = (width - glyphWidth) / (parts.length - 1);
        let cursor = x;
        for (const word of parts) {
          ctx.fillText(word, cursor, y);
          cursor += ctx.measureText(word).width + gap;
        }
      } else ctx.fillText(line, left, y);
      if (style.underline && line) {
        ctx.beginPath();
        ctx.moveTo(left, y + fontPx * 1.05);
        ctx.lineTo(left + (justify ? width : naturalWidth), y + fontPx * 1.05);
        ctx.stroke();
      }
      y += fontPx * style.lineHeight;
    });
  }
  ctx.restore();
}