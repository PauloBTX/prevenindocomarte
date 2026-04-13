"use client";

import * as React from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, RotateCw, X } from "lucide-react";
import getCroppedImg from "@/lib/crop-image";

interface PhotoCropperModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
}

export function PhotoCropperModal({ 
  open, 
  imageSrc, 
  onClose, 
  onCropComplete 
}: PhotoCropperModalProps) {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation: number) => {
    setRotation(rotation);
  };

  const onMediaLoaded = () => {
    // Optional: handle media load
  };

  const handleCropComplete = (activeArea: Area, pixelArea: Area) => {
    setCroppedAreaPixels(pixelArea);
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (croppedImage) {
        onCropComplete(croppedImage);
        onClose();
      }
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent 
        className="sm:max-w-xl w-[95vw] h-[90vh] sm:h-[80vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl"
        showCloseButton={false} // We will add our own custom close for better positioning
      >
        <DialogHeader className="p-4 border-b bg-white relative shrink-0">
          <DialogTitle className="text-center sm:text-left text-slate-800 font-bold pr-10">Ajustar Foto 3x4</DialogTitle>
          <button 
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        <div className="flex-1 relative bg-slate-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={2 / 3} // 180x270
            onCropChange={onCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
          />
        </div>

        <DialogFooter className="p-4 sm:p-6 bg-white border-t flex flex-col gap-6 z-10 h-auto shrink-0 mt-auto">
          {/* Controls Container */}
          <div className="flex flex-col gap-6 w-full">
            {/* Zoom & Rotation Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
              {/* Zoom Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Zoom</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{zoom.toFixed(1)}x</span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => onZoomChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#002855] hover:accent-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Rotation Control */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Orientação</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium active:scale-95 transition-transform"
                    onClick={() => setRotation(prev => (prev - 90) % 360)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> -90°
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium active:scale-95 transition-transform"
                    onClick={() => setRotation(prev => (prev + 90) % 360)}
                  >
                    <RotateCw className="w-4 h-4 mr-2" /> +90°
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full border-t pt-5">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full sm:w-1/3 h-12 text-slate-500 font-bold hover:bg-slate-50"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                className="w-full sm:flex-1 h-12 bg-[#002855] hover:bg-[#003875] text-white font-bold rounded-2xl shadow-lg shadow-[#002855]/20 transition-all active:scale-[0.98]"
              >
                Confirmar Recorte e Salvar
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
