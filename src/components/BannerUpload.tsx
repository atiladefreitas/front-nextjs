import React, { useState } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { Button, IconButton, Typography } from "@material-tailwind/react";

interface BannerUploadProps {
  currentBanner?: string;
  onBannerChange: (file: File | null) => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({
  currentBanner,
  onBannerChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentBanner || null);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        resolve(false);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(true);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        alert("Invalid image file");
        resolve(false);
      };
    });
  };

  const handleFileSelect = async (file: File) => {
    try {
      setUploading(true);

      const isValid = await validateImage(file);
      if (!isValid) {
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      onBannerChange(file);
    } catch (error) {
      console.error("Error handling file:", error);
      alert("Error processing image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    handleFileSelect(event.target.files[0]);
  };

  const removeBanner = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onBannerChange(null);
  };

  return (
    <div className="space-y-2">
      <Typography variant="small" color="blue-gray" className="font-medium">
        Banner (opcional)
      </Typography>

      <div className="relative w-full h-60 ">
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Banner Preview"
              className="w-full h-[15rem] object-cover rounded-lg"
            />
            <IconButton
              className="absolute top-4 right-4 flex items-center justify-center h-[3rem] w-[3rem] opacity-80 hover:opacity-100"
              onClick={removeBanner}
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Adicionar imagem de banner
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Será exibido em 600x400
                  </span>
                </div>
              )}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerUpload;
