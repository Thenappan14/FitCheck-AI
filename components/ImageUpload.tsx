'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
    onAnalyze: (base64: string) => void;
    isLoading: boolean;
}

export default function ImageUpload({ onAnalyze, isLoading }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setPreview(result);
            // Pass base64 without the data URL prefix
            const base64 = result.split(',')[1];
            onAnalyze(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            // For now, just trigger file input - full camera integration can be enhanced
            fileInputRef.current?.click();
        } catch (err) {
            console.log('Camera not available, using file upload');
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Preview */}
            {preview && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                    <img src={preview} alt="Preview" className="w-full h-auto" />
                </div>
            )}

            {/* Upload Area */}
            <div className="flex flex-col gap-4">
                <label
                    htmlFor="file-input"
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isLoading
                            ? 'border-gray-300 bg-gray-50 opacity-50'
                            : 'border-blue-400 bg-blue-50 hover:border-blue-600 hover:bg-blue-100'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="hidden"
                    />
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-gray-700 font-semibold">Drop your outfit photo here</p>
                    <p className="text-gray-500 text-sm">or click to browse</p>
                </label>

                {/* Camera Button */}
                <button
                    onClick={handleCamera}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    📷 Take Photo
                </button>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="mt-6 text-center">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                    </div>
                    <p className="text-gray-600 mt-2">Analyzing your outfit...</p>
                </div>
            )}
        </div>
    );
}
