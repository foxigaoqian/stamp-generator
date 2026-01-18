
import { Component, ElementRef, ViewChild, effect, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StampConfig {
  shape: 'circle' | 'rectangle';
  color: string;
  topText: string;
  bottomText: string;
  centerText: string;
  centerImage: string | null;
  borderWidth: number;
  fontSize: number;
  isGrunge: boolean;
}

@Component({
  selector: 'app-stamp-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-slate-200">
      <canvas #canvas width="400" height="400" class="max-w-full h-auto"></canvas>
      <div class="mt-4 text-sm text-slate-500 italic">
        {{ config().shape === 'circle' ? '400x400px' : '400x250px' }}
      </div>
    </div>
  `
})
export class StampPreviewComponent {
  config = input.required<StampConfig>();
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  constructor() {
    effect(() => {
      this.drawStamp(this.config());
    });
  }

  download() {
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = `stamp-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  private drawStamp(config: StampConfig) {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Set Styles
    ctx.strokeStyle = config.color;
    ctx.fillStyle = config.color;
    ctx.lineWidth = config.borderWidth;
    ctx.font = `bold ${config.fontSize}px 'Courier Prime', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (config.shape === 'circle') {
      this.drawCircleStamp(ctx, centerX, centerY, config);
    } else {
      this.drawRectStamp(ctx, centerX, centerY, config);
    }

    // Draw Center Image if exists
    if (config.centerImage) {
      this.drawCenterImage(ctx, centerX, centerY, config);
    } else if (config.centerText) {
      // Draw center text if no image
      ctx.font = `bold ${config.fontSize * 1.5}px 'Courier Prime', monospace`;
      ctx.fillText(config.centerText.toUpperCase(), centerX, centerY);
    }

    if (config.isGrunge) {
      this.applyGrunge(ctx, width, height, config.color);
    }
  }

  private drawCircleStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, config: StampConfig) {
    const radius = 180;
    
    // Outer Circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 10, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Reset Line Width for text/other elements
    ctx.lineWidth = 1;

    // Top Text
    if (config.topText) {
      this.drawTextAlongArc(ctx, config.topText.toUpperCase(), cx, cy, radius - 35, Math.PI, -Math.PI, true, config.fontSize);
    }

    // Bottom Text
    if (config.bottomText) {
      this.drawTextAlongArc(ctx, config.bottomText.toUpperCase(), cx, cy, radius - 35, 0, Math.PI * 2, false, config.fontSize);
    }
  }

  private drawRectStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, config: StampConfig) {
    const rectW = 360;
    const rectH = 200;
    const x = cx - rectW / 2;
    const y = cy - rectH / 2;

    // Outer Rect
    ctx.strokeRect(x, y, rectW, rectH);

    // Inner Rect
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + 10, rectW - 20, rectH - 20);

    // Reset Line Width
    ctx.lineWidth = 1;

    // Top Text
    if (config.topText) {
      ctx.fillText(config.topText.toUpperCase(), cx, y + 45);
    }

    // Bottom Text
    if (config.bottomText) {
      ctx.fillText(config.bottomText.toUpperCase(), cx, y + rectH - 45);
    }
  }

  private drawCenterImage(ctx: CanvasRenderingContext2D, cx: number, cy: number, config: StampConfig) {
    const img = new Image();
    img.src = config.centerImage!;
    img.onload = () => {
      const size = config.shape === 'circle' ? 100 : 80;
      
      // Create a temporary canvas to tint the image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tCtx = tempCanvas.getContext('2d')!;

      // Draw image
      tCtx.drawImage(img, 0, 0, size, size);

      // Composite operation to tint
      tCtx.globalCompositeOperation = 'source-in';
      tCtx.fillStyle = config.color;
      tCtx.fillRect(0, 0, size, size);

      // Draw tinted image back to main canvas
      ctx.drawImage(tempCanvas, cx - size / 2, cy - size / 2);
    };
  }

  private drawTextAlongArc(
    ctx: CanvasRenderingContext2D,
    str: string,
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    isTop: boolean,
    fontSize: number
  ) {
    ctx.save();
    ctx.textAlign = 'center';
    
    // Approximate character width angle based on font size and radius
    // This is a simplification; for production perfect kerning, we'd measure each char.
    const anglePerChar = (fontSize * 0.6) / radius; 
    const totalAngle = anglePerChar * str.length;
    
    // Start drawing from the center of the arc space
    let currentAngle = isTop ? -Math.PI / 2 - (totalAngle / 2) : Math.PI / 2 - (totalAngle / 2);

    // Adjust for centering logic manually if needed, but the loop below handles distribution
    // Let's use a simpler method: Rotate canvas per character
    
    // Center alignment offset
    const startRotation = isTop ? -totalAngle / 2 : totalAngle / 2;

    ctx.translate(cx, cy);
    ctx.rotate(isTop ? -Math.PI / 2 : Math.PI / 2); // Rotate to top or bottom
    ctx.rotate(startRotation);

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        ctx.save();
        // If bottom text, we need to correct the orientation of letters
        if (!isTop) {
           ctx.rotate(-anglePerChar * i);
           ctx.translate(0, -radius);
            // Flip text upright for bottom
           ctx.translate(0, 0); 
           ctx.rotate(Math.PI); 
        } else {
           ctx.rotate(anglePerChar * i);
           ctx.translate(0, -radius);
        }
        
        ctx.fillText(char, 0, 0);
        ctx.restore();
    }
    ctx.restore();
  }

  // Simple noise generation for grunge effect
  private applyGrunge(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // If pixel is not transparent
      if (data[i + 3] > 0) {
         // Random chance to "erode" the pixel
         if (Math.random() > 0.95) {
             data[i + 3] = 0; // Make transparent
         } else if (Math.random() > 0.8) {
             // Reduce opacity slightly
             data[i+3] = Math.max(0, data[i+3] - 100);
         }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
