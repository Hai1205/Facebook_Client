import { FileIcon, X } from "lucide-react";

interface FilePreviewProps {
  filePreview: string;
  imageFile: File | null;
  handleCancelFile: () => void;
}

export function FilePreview({
  filePreview,
  imageFile,
  handleCancelFile,
}: FilePreviewProps) {
  return (
    <div className="px-2 py-1 border-t border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          {imageFile ? (
            <div className="relative h-10 w-10">
              <img
                src={filePreview}
                alt="Preview"
                className="h-10 w-10 object-cover rounded"
              />
            </div>
          ) : (
            <>
              <FileIcon size={16} />
              <span className="truncate max-w-[150px]">{filePreview}</span>
            </>
          )}
        </div>
        <button
          onClick={handleCancelFile}
          className="text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
