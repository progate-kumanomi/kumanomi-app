"use client";

import { useImageCrop } from "@/hooks/useImageCrop";
import { useImageUpload } from "@/hooks/useImageUpload";
import React, { useRef, useState } from "react";
import { CropModal } from "./CropModal";
import { CroppedImagePreview } from "./CroppedImagePreview";

export function ImageUploader({ onImageUploaded }: { onImageUploaded: (path: string) => void }) {
    const [imgSrc, setImgSrc] = useState("");
    const [croppedBlob, setCroppedBlob] = useState<Blob>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const { crop, setCrop, completedCrop, setCompletedCrop, handleImageLoaded, resetCrop, getCroppedImg } =
        useImageCrop();
    const { isUploading, uploadImage } = useImageUpload();

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            resetCrop();
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || "");
                setIsModalOpen(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleUnselectFile = () => {
        setImgSrc("");
        resetCrop();
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

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        handleUnselectFile();
    };

    return (
        <>
            <input type="file" accept="image/*" onChange={handleSelectFile} ref={inputRef} />

            {croppedBlob && (
                <CroppedImagePreview blob={croppedBlob} onEditClick={openModal} />
            )}

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
