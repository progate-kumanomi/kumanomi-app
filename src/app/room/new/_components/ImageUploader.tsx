"use client";

import { uploadData } from 'aws-amplify/storage';
import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export function ImageUploader({ onImageUploaded }: { onImageUploaded: (path: string) => void }) {
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [croppedBlob, setCroppedBlob] = useState<Blob>();
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined);
            setCompletedCrop(undefined);
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
        setCrop(undefined);
        setCompletedCrop(undefined);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const initCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 100,
                },
                2 / 3,
                width,
                height
            ),
            width,
            height
        );
        setCrop(initCrop);
    };

    const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create blob from canvas'));
                }
            }, 'image/jpeg');
        });
    };

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            if (imgRef.current && completedCrop) {
                const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
                if (!croppedImageBlob) {
                    throw new Error('Failed to get cropped image blob');
                }
                setCroppedBlob(croppedImageBlob);
                const result = await uploadData({
                    path: `rooms/${Date.now()}.jpg`,
                    data: croppedImageBlob,
                }).result;
                onImageUploaded(result.path);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
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
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">クロップされた画像プレビュー:</h3>
                    <img
                        src={URL.createObjectURL(croppedBlob)}
                        alt="Cropped Preview"
                        className="mt-2 w-32 h-48 object-cover rounded-md border"
                    />
                    <button onClick={openModal} className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        クロップを修正
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <button
                            onClick={closeModal}
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
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={2 / 3}
                                    className="max-h-100 max-w-100"
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        onLoad={handleImageLoaded}
                                        className='block max-h-[calc(90vh-220px)] max-w-100'
                                    />
                                </ReactCrop>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end p-6 pt-4 border-t">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!completedCrop || isUploading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isUploading ? "アップロード中..." : "確定してアップロード"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
