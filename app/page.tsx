'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import ResultCard from '@/components/ResultCard';
import { AnalysisResult } from '@/lib/types';

export default function Home() {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async (base64: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze outfit');
            }

            const data: AnalysisResult = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Analysis error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        ✨ FitCheck AI
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Get instant style ratings & fashion advice for your outfit
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            ❌ {error}
                        </div>
                    )}

                    {!result ? (
                        <ImageUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
                    ) : (
                        <ResultCard result={result} onReset={handleReset} />
                    )}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-400 text-sm">
                    <p>💫 Built for the hackathon | Demo Mode Active</p>
                </div>
            </div>
        </main>
    );
}
