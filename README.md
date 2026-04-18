# FitCheck-AI 👔✨
A web application that analyzes outfit photos and provides instant style ratings, vibe descriptions, and improvement suggestions.

---

## 📁 Project Structure

```
FitCheck-AI/
├── 🖥️  FRONTEND (User Interface)
│   ├── app/
│   │   └── page.tsx          # Main landing page
│   └── components/
│       ├── ImageUpload.tsx    # Image upload & camera component
│       └── ResultCard.tsx     # Results display component
│
├── ⚙️  BACKEND (API & Logic)
│   ├── app/api/
│   │   └── analyze/
│   │       └── route.ts       # API endpoint for outfit analysis
│   └── lib/
│       ├── styleAnalyzer.ts   # Core fashion analysis engine
│       ├── colorHarmony.ts    # Color harmony scoring
│       └── types.ts           # TypeScript type definitions
│
├── 📦 Configuration
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.js         # Next.js config
│   └── tailwind.config.ts     # Tailwind CSS config
│
└── 🧪 Testing
    └── test-vision.js         # API endpoint tester (Node.js)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm

### Setup & Run

```bash
# 1. Navigate to project directory
cd "c:\Users\Hackathons\Medo AI\code_base\FitCheck-AI"

# 2. Install dependencies (first time only)
npm install

# 3. Start development server (Frontend + Backend together)
npm run dev
```

**Output:** Server starts at `http://localhost:3000`

---

## 🎯 How It Works

### Frontend (User Side)
- **page.tsx** → Main page with title and layout
- **ImageUpload.tsx** → File upload + camera capture
- **ResultCard.tsx** → Display analysis results

**To Access:** Open `http://localhost:3000` in browser

### Backend (Analysis Side)
- **app/api/analyze/route.ts** → API endpoint (`POST /api/analyze`)
  - Accepts base64 image
  - Runs analysis logic
  - Returns JSON result

- **lib/styleAnalyzer.ts** → Main analysis engine
  - Extracts clothing items
  - Detects vibe (casual, formal, streetwear, etc.)
  - Generates improvement suggestions
  - Calculates style rating (0-10)

- **lib/colorHarmony.ts** → Color harmony scoring
  - Analyzes color combinations
  - Calculates harmony score
  - Detects color harmony types

---

## 🧪 Testing

### Test Backend Without Frontend

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Test API
node test-vision.js "C:\path\to\your\image.jpg"
```

**Expected Output:** JSON with rating, vibe, suggestions, colors, items

---

## 🛠️ Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start dev server (Frontend + Backend) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `node test-vision.js <image>` | Test API directly |

---

## 📝 API Endpoint

### POST `/api/analyze`

**Request:**
```json
{
  "image": "base64_encoded_image_string"
}
```

**Response:**
```json
{
  "rating": 7.5,
  "vibe": "Casual Everyday",
  "suggestions": ["Add more color variety", "Consider accessories"],
  "detectedItems": ["jeans", "shirt", "sneakers"],
  "dominantColors": ["Blue", "White", "Gray"]
}
```

---

## 🎨 Tech Stack

- **Frontend:** React 18 + Next.js 14 + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Logic:** Custom rule-based fashion analyzer
- **Vision:** Demo mode (Ready for real Vision API integration)

---

## 📱 Features

✅ Image upload (file or camera)
✅ Real-time style analysis
✅ Rating system (0-10)
✅ Vibe detection (7 categories)
✅ Color harmony analysis
✅ Personalized suggestions
✅ Mobile responsive

---

## 🚢 Deployment

**Vercel (Recommended for Next.js):**
```bash
npm install -g vercel
vercel
```

---

**Team Note:** All code runs from single `npm run dev` command. Frontend and Backend are integrated in Next.js.
