const fs = require('fs');
const path = require('path');

/**
 * Test Vision API with an image file
 * @param {string} imagePath - Path to the image file to test
 * @returns {Promise<Object>} - Analysis result from the API
 */
async function testVisionAPI(imagePath) {
    try {
        // Verify file exists
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file not found: ${imagePath}`);
        }

        // Read and encode image to base64
        console.log('📸 Reading image:', imagePath);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const fileSizeKB = (imageBuffer.length / 1024).toFixed(2);

        console.log(`✓ Image loaded (${fileSizeKB} KB)\n`);

        // Call the API
        console.log('🔗 Testing Vision API endpoint...');
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        // Display results
        console.log('✅ SUCCESS! Vision API Key is working!\n');
        console.log('═══════════════════════════════════');
        console.log(`📊 RATING:          ${result.rating}/10`);
        console.log(`🎨 VIBE:            ${result.vibe}`);
        console.log(`👕 DETECTED ITEMS:  ${result.detectedItems.join(', ')}`);
        console.log(`🌈 COLORS:          ${result.dominantColors.join(', ')}`);
        console.log('───────────────────────────────────');
        console.log('💡 SUGGESTIONS:');
        result.suggestions.forEach((suggestion, idx) => {
            console.log(`   ${idx + 1}. ${suggestion}`);
        });
        console.log('═══════════════════════════════════\n');

        return result;
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        process.exit(1);
    }
}

// Run test
const imagePath = process.argv[2];
if (!imagePath) {
    console.log('Usage: node test-vision.js <path-to-image>');
    console.log('Example: node test-vision.js ./outfit.jpg');
    process.exit(1);
}

testVisionAPI(imagePath);
