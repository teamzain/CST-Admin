import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bunnyUploadService } from '@/api/bunny-upload';
import { toast } from 'sonner';

interface SignatureUploadProps {
    value?: string;
    onChange: (url: string | null) => void;
    label?: string;
    disabled?: boolean;
}

export const SignatureUpload = ({
    value,
    onChange,
    label = 'Signature',
    disabled = false,
}: SignatureUploadProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (PNG, JPG, etc.)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setIsLoading(true);
        try {
            const response = await bunnyUploadService.uploadFile(file, 'signature/');
            onChange(response.url);
            toast.success('Signature uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to upload signature'
            );
        } finally {
            setIsLoading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async () => {
        if (!value) return;

        setIsLoading(true);
        try {
            // Extract path from URL for deletion
            const urlParts = value.split('/');
            const filename = urlParts[urlParts.length - 1];
            const path = `signature/${filename}`;

            await bunnyUploadService.deleteFile(path);
            toast.success('Signature deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to delete signature'
            );
        } finally {
            // Always clear the signature from form, even if CDN delete fails
            onChange(null);
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">
                {label} {value && '(Uploaded)'}
            </label>

            {value ? (
                <div className="relative inline-block">
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-3">
                        <img
                            src={value}
                            alt="Signature"
                            className="max-h-32 max-w-xs object-contain"
                        />
                    </div>

                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={handleDelete}
                        disabled={isLoading || disabled}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <X className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        onChange={handleFileChange}
                        disabled={isLoading || disabled}
                        className="hidden"
                    />

                    <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || disabled}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Upload Signature
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF or WebP • Max 5MB
                    </p>
                </div>
            )}
        </div>
    );
};
