import React, { useRef } from 'react';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
        }
    };

    return (
        <div className="mx-auto max-w-lg">
            <div
                className="border-2 border-dashed border-gray-300 p-8 text-center rounded-md transition-colors cursor-pointer"
                onClick={handleClick}
            >
                <div className="flex flex-col items-center justify-center">
                    <svg
                        className="mb-3 h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-gray-700">Click to select an image</p>
                    <p className="text-xs text-gray-500">JPG or PNG</p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="mt-4 text-center text-xs text-gray-500 italic">
                For the best results, use a top-down image.
            </div>



        </div>
    );
};

export default ImageUploader;
