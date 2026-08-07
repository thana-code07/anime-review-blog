import { ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";

export function ArticleThumbnailField({
  image,
  error,
  fileInputRef,
  onUploadClick,
  onFileChange,
}) {
  return (
    <div className="space-y-2">
      <Label className="text-brown-600">Thumbnail image</Label>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-40 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-brown-100 sm:h-44">
          {image ? (
            <img src={image} alt="" className="size-full object-cover" />
          ) : (
            <ImageIcon
              className="size-10 text-brown-400"
              strokeWidth={1.25}
              aria-hidden
            />
          )}
        </div>
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-brown-900 bg-white text-brown-900 hover:bg-brown-100"
            onClick={onUploadClick}
          >
            Upload thumbnail image
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  );
}
