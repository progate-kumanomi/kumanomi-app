"use client";

import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CropModalProps {
    imgSrc: string;
    crop: Crop | undefined;
    completedCrop: PixelCrop | undefined;
    isUploading: boolean;
    isOpen: boolean;
    imgRef: React.RefObject<HTMLImageElement | null>;
    onCropChange: (crop: Crop) => void;
    onCropComplete: (crop: PixelCrop) => void;
    onImageLoaded: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onUpload: () => Promise<void>;
    onClose: () => void;
}

export function CropModal({
    imgSrc,
    crop,
    completedCrop,
    isUploading,
    isOpen,
    imgRef,
    onCropChange,
    onCropComplete,
    onImageLoaded,
    onUpload,
    onClose,
}: CropModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                >
                    ✕
                </button>

                <div className="p-6 pb-4">
                    <h2 className="text-xl font-semibold">画像をクロップ</h2>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 min-h-0 max-h-[calc(90vh-220px)]">
                    {imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => onCropChange(percentCrop)}
                            onComplete={(c) => onCropComplete(c)}
                            aspect={2 / 3}
                            className="max-h-100 max-w-100"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoaded}
                                className='block max-h-[calc(90vh-220px)] max-w-100'
                            />
                        </ReactCrop>
                    )}
                </div>

                <div className="flex gap-3 justify-end p-6 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        キャンセル
                    </button>
                    <button
                        type="button"
                        onClick={onUpload}
                        disabled={!completedCrop || isUploading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isUploading ? "アップロード中..." : "確定してアップロード"}
                    </button>
                </div>
            </div>
        </div>
    );
}
