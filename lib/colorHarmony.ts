export interface HarmonyInfo {
    score: number;      // 0-1.5 range
    type: string;       // 'complementary', 'analogous', 'monochrome', etc.
    confidence: number; // 0-1
}

// Map color names to color wheel degrees
const COLOR_WHEEL: Record<string, number> = {
    red: 0,
    orange: 30,
    yellow: 60,
    lime: 90,
    green: 120,
    turquoise: 150,
    cyan: 180,
    blue: 240,
    purple: 270,
    magenta: 300,
    pink: 330,
};

function getColorAngle(color: string): number | null {
    const lower = color.toLowerCase().trim();

    // Direct match
    if (COLOR_WHEEL[lower] !== undefined) {
        return COLOR_WHEEL[lower];
    }

    // Substring match (e.g., "dark blue" -> 240)
    for (const [key, angle] of Object.entries(COLOR_WHEEL)) {
        if (lower.includes(key)) {
            return angle;
        }
    }

    return null;
}

function normalizeAngleDifference(diff: number): number {
    // Always return the smaller angle difference (0-180)
    if (diff > 180) {
        return 360 - diff;
    }
    return diff;
}

export function colorHarmonyScore(colors: string[]): HarmonyInfo {
    if (colors.length === 0) {
        return { score: 0.5, type: 'no_colors', confidence: 0.5 };
    }

    if (colors.length === 1) {
        return { score: 0.7, type: 'monochrome', confidence: 0.8 };
    }

    // Extract angles for up to 3 colors
    const angles = colors
        .slice(0, 3)
        .map(getColorAngle)
        .filter((a): a is number => a !== null);

    if (angles.length < 2) {
        // Only 1 color detected or unknown colors
        return { score: 0.6, type: 'insufficient_data', confidence: 0.4 };
    }

    // Calculate differences between adjacent colors
    const diffs: number[] = [];
    for (let i = 0; i < angles.length - 1; i++) {
        const diff = Math.abs(angles[i] - angles[i + 1]);
        diffs.push(normalizeAngleDifference(diff));
    }

    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;

    // Classify harmony
    if (avgDiff < 30) {
        // Too close together - clashing colors
        return { score: 0.3, type: 'clashing', confidence: 0.9 };
    }

    if (avgDiff < 60) {
        // Analogous harmony (colors next to each other on wheel)
        return { score: 0.8, type: 'analogous', confidence: 0.85 };
    }

    if (avgDiff >= 150 && avgDiff <= 210) {
        // Complementary harmony (opposite on wheel)
        return { score: 1.2, type: 'complementary', confidence: 0.95 };
    }

    if (avgDiff >= 100 && avgDiff < 150) {
        // Triadic or split-complementary
        return { score: 1.0, type: 'triadic', confidence: 0.85 };
    }

    // Neutral/other harmony
    return { score: 0.9, type: 'neutral', confidence: 0.7 };
}
