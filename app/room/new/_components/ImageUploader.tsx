import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export function ImageUploader({ onImageUploaded }: { onImageUploaded: (path: string) => void }) {
    const handleUploadSuccess = async (event: { key?: string }) => {
        const uploadedPath = await event.key;
        if (!uploadedPath) {
            console.error('Upload succeeded but no key returned');
            return;
        }
        onImageUploaded(uploadedPath);
    };

    return (
        <FileUploader
            path="rooms/"
            acceptedFileTypes={['image/*']}
            maxFileCount={1}
            isResumable={true}
            showThumbnails={true}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => console.error('Error uploading file:', error)}
        />
    );
}
