export interface AnalysisResult {
    rating: number;           // 0-10 with 1 decimal
    vibe: string;            // "Casual streetwear", "Business formal", etc.
    suggestions: string[];   // Array of 3 actionable tips
    detectedItems: string[]; // Clothing items detected (e.g., "jeans", "jacket")
    dominantColors: string[]; // Top colors in outfit
}

export interface VisionAnalysisData {
    labels: { description: string; confidence: number }[];
    imageProperties: {
        dominantColors: Array<{ color: string; score: number; pixelFraction: number }>;
    };
}

export interface GoogleVisionColor {
    color?: {
        red?: number;
        green?: number;
        blue?: number;
        alpha?: number;
    };
    score?: number;
    pixelFraction?: number;
}
