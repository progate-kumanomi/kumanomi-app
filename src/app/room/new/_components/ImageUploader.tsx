"use client";

import UploadIcon from "@/components/UploadIcon";
import { useImageCrop } from "@/hooks/useImageCrop";
import { useImageUpload } from "@/hooks/useImageUpload";
import React, { useRef, useState } from "react";
import { CropModal } from "./CropModal";

export function ImageUploader({ onImageUploaded }: { onImageUploaded: (path: string) => void }) {
    const [imgSrc, setImgSrc] = useState("");
    const [croppedBlob, setCroppedBlob] = useState<Blob>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const { crop, setCrop, completedCrop, setCompletedCrop, handleImageLoaded, resetCrop, getCroppedImg } =
        useImageCrop();
    const { isUploading, uploadImage } = useImageUpload();

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        resetCrop();
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || "");
            setIsModalOpen(true);
        });
        reader.readAsDataURL(file);
    };

    const handleUnselectFile = () => {
        setImgSrc("");
        resetCrop();
        setCroppedBlob(undefined);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!imgRef.current || !completedCrop) return;

        try {
            const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
            setCroppedBlob(croppedImageBlob);
            const uploadedPath = await uploadImage(croppedImageBlob);
            if (uploadedPath) {
                onImageUploaded(uploadedPath);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error processing image:", error);
        }
    };

    const handleClickDropZone = () => {
        inputRef.current?.click();
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                processFile(file);
            }
        }
    };

    const openEditModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                onChange={handleSelectFile}
                ref={inputRef}
                style={{ display: 'none' }}
            />

            {/* ドロップゾーン */}
            <div
                onClick={handleClickDropZone}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors duration-200 aspect-3/4 flex flex-col items-center justify-center
                    ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-400 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                    }
                `}
            >
                {croppedBlob ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-full">
                        <img
                            src={URL.createObjectURL(croppedBlob)}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain rounded"
                        />
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal();
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                編集
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnselectFile();
                                }}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                画像をクリア
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg px-4 py-3 shadow-md flex flex-row items-center gap-3 cursor-pointer hover:shadow-lg hover:bg-gray-50 transition-all border border-gray-200">
                        <UploadIcon className="w-5 h-5" />
                        <span className="text-[#F37C88] font-medium">画像をアップロード</span>
                    </div>
                )}
            </div>

            <CropModal
                imgSrc={imgSrc}
                crop={crop}
                completedCrop={completedCrop}
                isUploading={isUploading}
                isOpen={isModalOpen}
                imgRef={imgRef}
                onCropChange={setCrop}
                onCropComplete={setCompletedCrop}
                onImageLoaded={handleImageLoaded}
                onUpload={handleUpload}
                onClose={closeModal}
            />
        </>
    );
}
