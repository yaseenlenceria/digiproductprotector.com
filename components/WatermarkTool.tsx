import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Type, Image as ImageIcon, Sliders } from 'lucide-react';

const WatermarkTool: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [watermarkText, setWatermarkText] = useState("© DigiProtector");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('center');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawWatermark = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw original image
    ctx.drawImage(image, 0, 0);

    // Configure watermark style
    ctx.globalAlpha = opacity;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(watermarkText);
    const textWidth = textMetrics.width;
    const textHeight = fontSize; // Approximate

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    const padding = 40;

    switch (position) {
      case 'bottom-right':
        x = canvas.width - (textWidth / 2) - padding;
        y = canvas.height - (textHeight / 2) - padding;
        break;
      case 'bottom-left':
        x = (textWidth / 2) + padding;
        y = canvas.height - (textHeight / 2) - padding;
        break;
      case 'top-right':
        x = canvas.width - (textWidth / 2) - padding;
        y = (textHeight / 2) + padding;
        break;
      case 'top-left':
        x = (textWidth / 2) + padding;
        y = (textHeight / 2) + padding;
        break;
      case 'center':
      default:
        // Already center
        break;
    }

    // Optional: Draw shadow for better visibility
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(watermarkText, x, y);

  }, [image, watermarkText, fontSize, opacity, color, position]);

  useEffect(() => {
    drawWatermark();
  }, [drawWatermark]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'protected-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Visual Sentinel</h2>
          <p className="text-slate-400">Apply robust watermarks to your creative assets locally.</p>
        </div>
        {image && (
            <button 
              onClick={downloadImage}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-brand-900/50"
            >
              <Download size={20} />
              Save Protected Asset
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Controls Panel */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl flex flex-col gap-6 overflow-y-auto">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Upload Asset</label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-8 group-hover:border-brand-500 group-hover:bg-slate-700/50 transition-all">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-slate-400 group-hover:text-brand-400 mb-2" />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200">Click to upload image</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 text-brand-400">
                <Sliders size={18} />
                <h3 className="font-semibold text-white">Configuration</h3>
             </div>
             
             <div className="space-y-2">
               <label className="text-xs text-slate-400 uppercase tracking-wider">Watermark Text</label>
               <div className="relative">
                 <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                    type="text" 
                    value={watermarkText} 
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                 />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Font Size</label>
                  <input 
                    type="number" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Color</label>
                  <div className="flex items-center gap-2 h-10">
                     <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-full bg-transparent cursor-pointer rounded overflow-hidden"
                    />
                  </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider">Opacity ({Math.round(opacity * 100)}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={opacity} 
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-brand-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
             </div>

             <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider">Position</label>
                <div className="grid grid-cols-3 gap-2">
                   {['top-left', 'center', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                      <button 
                        key={pos}
                        onClick={() => setPosition(pos as any)}
                        className={`text-xs py-2 rounded border ${position === pos ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                      >
                        {pos.replace('-', ' ')}
                      </button>
                   ))}
                </div>
             </div>

          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 bg-slate-900/50 rounded-2xl border border-slate-700 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            {image ? (
              <div className="relative max-w-full max-h-full shadow-2xl shadow-black">
                <canvas ref={canvasRef} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600">
                <ImageIcon size={64} className="mb-4 opacity-20" />
                <p>Upload an image to start watermarking</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WatermarkTool;
