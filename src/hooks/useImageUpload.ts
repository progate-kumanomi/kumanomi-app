import { uploadData } from 'aws-amplify/storage';
import { useState } from 'react';

export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (croppedBlob: Blob): Promise<string | null> => {
        try {
            setIsUploading(true);
            setError(null);

            const result = await uploadData({
                path: `rooms/${Date.now()}.jpg`,
                data: croppedBlob,
            }).result;

            return result.path;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMessage);
            console.error("Error uploading image:", err);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        isUploading,
        error,
        uploadImage,
        clearError,
    };
}
