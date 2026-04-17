'use client';

import { AnalysisResult } from '@/lib/types';

interface ResultCardProps {
    result: AnalysisResult;
    onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
    const getRatingColor = (rating: number) => {
        if (rating >= 8) return 'text-green-600';
        if (rating >= 6) return 'text-blue-600';
        if (rating >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getRatingEmoji = (rating: number) => {
        if (rating >= 8) return '🔥';
        if (rating >= 6) return '😎';
        if (rating >= 4) return '👍';
        return '🤔';
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {/* Rating Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-xl">
                <div className="text-center">
                    <div className={`text-6xl mb-2 ${getRatingEmoji(result.rating)}`}></div>
                    <p className="text-lg opacity-90 mb-2">Style Rating</p>
                    <div className={`text-5xl font-bold ${getRatingColor(result.rating)}`}>
                        {result.rating.toFixed(1)}/10
                    </div>
                </div>
            </div>

            {/* Vibe Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">✨</span>
                    <h3 className="text-lg font-semibold text-gray-700">Your Vibe</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{result.vibe}</p>
            </div>

            {/* Detected Items */}
            <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">👕</span>
                    <h3 className="text-lg font-semibold text-gray-700">Detected Items</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {result.detectedItems.map((item, idx) => (
                        <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎨</span>
                    <h3 className="text-lg font-semibold text-gray-700">Dominant Colors</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {result.dominantColors.map((color, idx) => {
                        const colorMap: { [key: string]: string } = {
                            red: 'bg-red-400',
                            blue: 'bg-blue-400',
                            green: 'bg-green-400',
                            yellow: 'bg-yellow-400',
                            orange: 'bg-orange-400',
                            purple: 'bg-purple-400',
                            pink: 'bg-pink-400',
                            black: 'bg-gray-800',
                            white: 'bg-gray-200 border-2 border-gray-400',
                            gray: 'bg-gray-400',
                            navy: 'bg-blue-900',
                            gold: 'bg-yellow-600',
                            olive: 'bg-green-800',
                        };
                        const bgClass = colorMap[color.toLowerCase()] || 'bg-gray-400';

                        return (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-full ${bgClass} shadow-md`}></div>
                                <span className="text-xs text-gray-600 font-medium">{color}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💡</span>
                    <h3 className="text-lg font-semibold text-gray-700">Improvement Tips</h3>
                </div>
                <ul className="space-y-3">
                    {result.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex gap-3 text-gray-700">
                            <span className="flex-shrink-0 text-purple-600 font-bold">→</span>
                            <span>{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
                ↺ Analyze Another Outfit
            </button>
        </div>
    );
}
