import { useState } from 'react';
import { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';

export function useImageCrop() {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const initCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 100,
                },
                3 / 4,
                width,
                height
            ),
            width,
            height
        );
        setCrop(initCrop);
    };

    const resetCrop = () => {
        setCrop(undefined);
        setCompletedCrop(undefined);
    };

    const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
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
            crop.width * scaleX,
            crop.height * scaleY
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

    return {
        crop,
        setCrop,
        completedCrop,
        setCompletedCrop,
        handleImageLoaded,
        resetCrop,
        getCroppedImg,
    };
}
