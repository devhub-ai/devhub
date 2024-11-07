import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface UploadComponentProps {
    onFileChange: (file: File) => void;
}

export default function UploadComponent({ onFileChange }: UploadComponentProps) {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            onFileChange(selectedFile); // Notify the parent component about the file change
        }
    };

    return (
        <div
            className="w-full h-24 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={handleDivClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleDivClick();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label="Click to upload image"
        >
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
                {file ? file.name : 'Upload Image'}
            </p>
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                aria-hidden="true"
            />
        </div>
    );
}
