import { NextRequest, NextResponse } from 'next/server';
import { analyzeStyle } from '@/lib/styleAnalyzer';
import { VisionAnalysisData } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        if (typeof image !== 'string') {
            return NextResponse.json({ error: 'Image must be a base64 string' }, { status: 400 });
        }

        console.log('📸 Analyzing outfit...');

        // DEMO MODE: Return realistic mock data for hackathon demo
        // Replace this with actual vision API when ready
        const mockVisionData = generateMockAnalysis();

        // Analyze style using custom logic
        const analysisResult = analyzeStyle(mockVisionData);

        return NextResponse.json(analysisResult);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Analysis error:', errorMessage);

        return NextResponse.json(
            { error: `Analysis failed: ${errorMessage}` },
            { status: 500 }
        );
    }
}

// Demo function: Generate realistic mock analysis
function generateMockAnalysis(): VisionAnalysisData {
    const mockOutfits = [
        {
            labels: ['jeans', 'white shirt', 'sneakers', 'casual wear'],
            colors: ['Blue', 'White', 'Gray'],
        },
        {
            labels: ['dress', 'heels', 'accessories', 'elegant wear'],
            colors: ['Black', 'Gold', 'White'],
        },
        {
            labels: ['hoodie', 'cargo pants', 'sneakers', 'streetwear'],
            colors: ['Black', 'Olive', 'White'],
        },
        {
            labels: ['blazer', 'dress pants', 'dress shoes', 'formal wear'],
            colors: ['Navy', 'White', 'Black'],
        },
    ];

    // Pick random outfit
    const randomOutfit = mockOutfits[Math.floor(Math.random() * mockOutfits.length)];

    return {
        labels: randomOutfit.labels.map((desc) => ({
            description: desc,
            confidence: 75 + Math.random() * 20,
        })),
        imageProperties: {
            dominantColors: randomOutfit.colors.map((color) => ({
                color,
                score: 60 + Math.random() * 30,
                pixelFraction: 20 + Math.random() * 20,
            })),
        },
    };
}

