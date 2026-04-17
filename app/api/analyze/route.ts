import { NextRequest, NextResponse } from 'next/server';
import vision from '@google-cloud/vision';
import { analyzeStyle } from '@/lib/styleAnalyzer';
import { VisionAnalysisData, GoogleVisionColor } from '@/lib/types';

// Initialize Google Vision client with credentials from environment
const getVisionClient = () => {
    const credentials = process.env.GOOGLE_VISION_KEY ? JSON.parse(process.env.GOOGLE_VISION_KEY) : null;

    return new vision.ImageAnnotatorClient({
        credentials,
    });
};

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        if (typeof image !== 'string') {
            return NextResponse.json({ error: 'Image must be a base64 string' }, { status: 400 });
        }

        // Initialize client
        const client = getVisionClient();

        // Prepare request for Google Vision API
        const request = {
            image: { content: image },
            features: [
                { type: 'LABEL_DETECTION' as const, maxResults: 20 },
                { type: 'IMAGE_PROPERTIES' as const },
            ],
        };

        // Call Google Vision API
        const [result] = await client.annotateImage(request);

        // Extract results
        const labelAnnotations = result.labelAnnotations || [];
        const imagePropertiesAnnotation = result.imagePropertiesAnnotation || {};

        // Extract colors from imageProperties
        const colorAnnotations = imagePropertiesAnnotation.dominantColors || [];

        // Convert color objects to readable format
        const dominantColors = colorAnnotations.map((c: GoogleVisionColor) => {
            if (c.color && (c.color.red !== undefined || c.color.green !== undefined || c.color.blue !== undefined)) {
                // Try to match to named colors
                const red = c.color.red || 0;
                const green = c.color.green || 0;
                const blue = c.color.blue || 0;

                return getColorName(red, green, blue);
            }
            return 'Unknown';
        });

        // Format Vision API response
        const visionData: VisionAnalysisData = {
            labels: labelAnnotations.map((label) => ({
                description: label.description || '',
                confidence: (label.score || 0) * 100,
            })),
            imageProperties: {
                dominantColors: dominantColors.map((color, idx) => ({
                    color,
                    score: (colorAnnotations[idx]?.score || 0) * 100,
                    pixelFraction: (colorAnnotations[idx]?.pixelFraction || 0) * 100,
                })),
            },
        };

        // Analyze style using custom logic
        const analysisResult = analyzeStyle(visionData);

        return NextResponse.json(analysisResult);
    } catch (error) {
        console.error('Analysis error:', error);

        // Don't expose sensitive error details
        return NextResponse.json(
            { error: 'Failed to analyze image. Please try again with a different photo.' },
            { status: 500 }
        );
    }
}

// Helper function: Convert RGB to color name
function getColorName(r: number, g: number, b: number): string {
    // Normalize RGB values to 0-1
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    // Check for grayscale
    if (max === min) {
        if (lightness > 0.7) return 'White';
        if (lightness < 0.3) return 'Black';
        return 'Gray';
    }

    // Calculate hue
    let hue: number;
    const saturation = lightness > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

    if (max === red) {
        hue = ((green - blue) / (max - min) + (green < blue ? 6 : 0)) / 6;
    } else if (max === green) {
        hue = ((blue - red) / (max - min) + 2) / 6;
    } else {
        hue = ((red - green) / (max - min) + 4) / 6;
    }

    hue = hue * 360;

    // Map hue to color names
    if (hue < 15 || hue >= 345) return 'Red';
    if (hue < 45) return 'Orange';
    if (hue < 65) return 'Yellow';
    if (hue < 150) return 'Green';
    if (hue < 200) return 'Cyan';
    if (hue < 260) return 'Blue';
    if (hue < 290) return 'Purple';
    if (hue < 330) return 'Magenta';
    return 'Pink';
}
