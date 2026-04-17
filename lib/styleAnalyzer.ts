import { VisionAnalysisData, AnalysisResult } from './types';
import { colorHarmonyScore, HarmonyInfo } from './colorHarmony';

const CLOTHING_KEYWORDS = [
    'shirt',
    'tshirt',
    't-shirt',
    'sweater',
    'hoodie',
    'hoody',
    'jacket',
    'coat',
    'blazer',
    'cardigan',
    'jeans',
    'pants',
    'shorts',
    'skirt',
    'dress',
    'suit',
    'tie',
    'shoe',
    'sneaker',
    'boot',
    'heel',
    'loafer',
    'sandal',
    'hat',
    'cap',
    'beanie',
    'scarf',
    'belt',
    'bag',
    'backpack',
    'vest',
    'tank',
    'top',
    'bottom',
    'jogger',
];

export function extractClothingItems(labels: Array<{ description: string; confidence: number }>): string[] {
    return labels
        .filter((label) => {
            const desc = label.description.toLowerCase();
            return CLOTHING_KEYWORDS.some((kw) => desc.includes(kw));
        })
        .slice(0, 5)
        .map((l) => l.description);
}

export function detectVibe(clothing: string[], colors: string[]): string {
    const clothingLower = clothing.map((c) => c.toLowerCase());
    const colorsLower = colors.map((c) => c.toLowerCase());

    // Formal detection (highest priority)
    if (clothingLower.some((c) => c.includes('suit') || c.includes('blazer') || c.includes('tie'))) {
        return 'Business Formal';
    }

    // Sporty/Athletic
    if (clothingLower.some((c) => c.includes('track') || c.includes('athletic') || c.includes('gym'))) {
        return 'Athletic/Sporty';
    }

    // Streetwear detection
    if (clothingLower.some((c) => c.includes('hoodie') || c.includes('hoody'))) {
        return 'Streetwear Vibes';
    }

    if (clothingLower.some((c) => c.includes('sneaker')) && clothingLower.some((c) => c.includes('hoodie'))) {
        return 'Streetwear Vibes';
    }

    // Casual detection
    if (clothingLower.some((c) => c.includes('jeans')) && clothingLower.some((c) => c.includes('shirt') || c.includes('tshirt'))) {
        return 'Casual Everyday';
    }

    // Relaxed/Chill
    if (clothingLower.some((c) => c.includes('sweater') || c.includes('cardigan'))) {
        return 'Cozy & Relaxed';
    }

    // Dress-focused
    if (clothingLower.some((c) => c.includes('dress'))) {
        if (colorsLower.some((c) => c.includes('black') || c.includes('navy') || c.includes('dark'))) {
            return 'Elegant';
        }
        return 'Dress & Dapper';
    }

    // Default
    return 'Eclectic Mix';
}

export function generateSuggestions(
    clothing: string[],
    colors: string[],
    harmonyInfo: HarmonyInfo
): string[] {
    const suggestions: string[] = [];
    const clothingLower = clothing.map((c) => c.toLowerCase());

    // Rule 1: Color harmony issues
    if (harmonyInfo.score < 0.8) {
        suggestions.push('Consider adding a neutral piece (white, black, or beige) to balance colors');
    }

    // Rule 2: Layering
    const hasLayer = clothingLower.some((c) => c.includes('jacket') || c.includes('sweater') || c.includes('cardigan') || c.includes('blazer'));
    if (!hasLayer && clothing.length < 4) {
        suggestions.push('Try layering with a jacket or cardigan for more visual depth');
    }

    // Rule 3: Footwear
    const hasFootwear = clothingLower.some((c) => c.includes('shoe') || c.includes('sneaker') || c.includes('boot') || c.includes('heel') || c.includes('loafer'));
    if (!hasFootwear) {
        suggestions.push('Choose shoes that match your outfit style to complete the look');
    }

    // Rule 4: Formal footwear mismatch
    const isFormal = clothingLower.some((c) => c.includes('suit') || c.includes('blazer') || c.includes('tie'));
    const hasCasualShoes = clothingLower.some((c) => c.includes('sneaker'));
    if (isFormal && hasCasualShoes) {
        suggestions.push('Pair formal wear with dress shoes instead of sneakers for cohesion');
    }

    // Rule 5: Accessories
    const hasAccessory = clothingLower.some((c) => c.includes('belt') || c.includes('bag') || c.includes('scarf') || c.includes('hat'));
    if (!hasAccessory && suggestions.length < 3) {
        suggestions.push('Add an accessory (belt, bag, or watch) to elevate the overall look');
    }

    // Rule 6: Color variety
    if (colors.length < 2 && suggestions.length < 3) {
        suggestions.push('Introduce another color or pattern to add visual interest');
    }

    // Return exactly 3 suggestions
    return suggestions.slice(0, 3);
}

export function calculateRating(clothing: string[], colors: string[], harmonyInfo: HarmonyInfo): number {
    let rating = 6.0; // Base score

    // Add harmony score (0.3 to 1.2)
    rating += harmonyInfo.score;

    // Bonus for variety (multiple clothing items)
    if (clothing.length >= 3) {
        rating += 0.5;
    } else if (clothing.length === 2) {
        rating += 0.25;
    }

    // Bonus for color variety
    if (colors.length >= 3) {
        rating += 0.5;
    } else if (colors.length === 2) {
        rating += 0.25;
    }

    // Cap at 0-10
    rating = Math.min(10, Math.max(0, parseFloat(rating.toFixed(1))));

    return rating;
}

export function analyzeStyle(visionData: VisionAnalysisData): AnalysisResult {
    // Extract clothing items
    const detectedItems = extractClothingItems(visionData.labels);

    // Extract dominant colors (top 3)
    const dominantColors = visionData.imageProperties.dominantColors.slice(0, 3).map((c) => c.color);

    // Calculate color harmony
    const harmonyInfo = colorHarmonyScore(dominantColors);

    // Detect vibe
    const vibe = detectVibe(detectedItems, dominantColors);

    // Generate suggestions
    const suggestions = generateSuggestions(detectedItems, dominantColors, harmonyInfo);

    // Calculate final rating
    const rating = calculateRating(detectedItems, dominantColors, harmonyInfo);

    return {
        rating,
        vibe,
        suggestions,
        detectedItems,
        dominantColors,
    };
}
