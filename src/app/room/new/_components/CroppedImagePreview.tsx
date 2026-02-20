"use client";

interface CroppedImagePreviewProps {
    blob: Blob;
    onEditClick: () => void;
}

export function CroppedImagePreview({ blob, onEditClick }: CroppedImagePreviewProps) {
    return (
        <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">クロップされた画像プレビュー:</h3>
            <img
                src={URL.createObjectURL(blob)}
                alt="Cropped Preview"
                className="mt-2 w-32 h-48 object-cover rounded-md border"
            />
            <button
                onClick={onEditClick}
                className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                クロップを修正
            </button>
        </div>
    );
}
