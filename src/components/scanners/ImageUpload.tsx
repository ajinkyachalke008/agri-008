import { useRef, useState } from "react";
import { Camera, Upload, FolderOpen, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { compressImage, validateImage } from "@/lib/imageProcessing";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  isAnalyzing?: boolean;
}

const ImageUpload = ({ onImageSelect, isAnalyzing }: ImageUploadProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const validation = validateImage(file);
    if (!validation.valid) {
      toast({
        title: "Invalid image",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      onImageSelect(compressed);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = () => {
    setPreview(null);
  };

  if (preview && !isAnalyzing) {
    return (
      <div className="glass-card p-6">
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
          <Button
            onClick={clearImage}
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center mt-4 text-sm opacity-70">
          {t('scanners.upload.ready')}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-6 text-center">
        {t('scanners.upload.title')}
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Camera */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium">{t('scanners.upload.camera')}</span>
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {/* Gallery */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 hover:from-secondary/30 hover:to-secondary/10 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-secondary" />
          </div>
          <span className="text-sm font-medium">{t('scanners.upload.gallery')}</span>
        </button>

        {/* Files */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 hover:from-accent/30 hover:to-accent/10 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm font-medium">{t('scanners.upload.files')}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Drag and drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-border/50 hover:border-primary/50'
        }`}
      >
        <p className="text-sm opacity-70">{t('scanners.upload.dragDrop')}</p>
        <p className="text-xs opacity-50 mt-2">{t('scanners.upload.supported')}</p>
      </div>
    </div>
  );
};

export default ImageUpload;
