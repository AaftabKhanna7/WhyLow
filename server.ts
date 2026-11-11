import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI generation timed out')), ms))
  ]);
}

// Fallback comfort messages library in case API key is missing or calls fail
const fallbackComfortNotes = [
  {
    title: "You are doing much better than you give yourself credit for",
    letter: "Take a slow, deep breath right now. Drop your shoulders down from your ears. Unclench your jaw. Whatever is weighing on your heart today, it does not define your tomorrow. It is completely okay to feel sad, heavy, or tired. You don't have to fix everything right this second. For now, simply existing, resting, and being gentle with yourself is more than enough.",
    gentleTip: "Drink a cup of warm water or tea, wrap yourself in your softest blanket, and remember that tonight is just a pause, not the whole story.",
    comfortTag: "Warm Hug"
  },
  {
    title: "Storms run out of rain, always",
    letter: "When sadness visits, it can feel like a heavy cloud has settled inside your chest. But remember: clouds pass through the sky; they are not the sky itself. Your capacity for joy, warmth, and peace is still right there beneath the surface. You've made it through 100% of your hardest days before, and this tender moment will pass into gentler waters too.",
    gentleTip: "Place one hand over your heart. Feel the steady rhythm keeping you alive. You are safe here.",
    comfortTag: "Reassurance"
  },
  {
    title: "Permission to set down the heavy backpack",
    letter: "You've been carrying so much invisible weight lately—trying to be strong, trying to keep up, trying to please everyone or stay afloat. Right here, in this quiet moment, you have permission to drop the backpack. You don't need to perform or produce. You are worthy of love, care, and softness just as you are.",
    gentleTip: "Step away from screens for five minutes. Look out the nearest window and find three things you notice: a leaf, a color, the shape of the sky.",
    comfortTag: "Gentle Release"
  }
];

const wholesomeSmiles = [
  {
    fact: "Sea otters hold hands when they sleep so they don't drift away from each other in the ocean currents.",
    type: "Animal Fact"
  },
  {
    fact: "Cows have best friends and get measurably stressed when they are separated from them, but light up with joy when reunited.",
    type: "Animal Fact"
  },
  {
    fact: "A group of pugs is officially called a 'grumble', and a group of flamingos is called a 'flamboyance'.",
    type: "Delight"
  },
  {
    fact: "In Sweden, there is a rabbit show-jumping competition called 'Kaninhop' where fluffy bunnies happily leap over tiny colorful hurdles.",
    type: "Wholesome Story"
  },
  {
    fact: "Squirrels plant thousands of new trees each year simply by forgetting where they buried their acorns.",
    type: "Nature Miracle"
  },
  {
    fact: "Puppies will often fake-sneeze while play-fighting to signal to the other puppy, 'Hey, don't worry, I'm just playing and I like you!'",
    type: "Animal Fact"
  }
];

// Endpoint: Generate personalized comfort letter/pep talk
app.post('/api/comfort', async (req, res) => {
  const { moodCategory, ventText, needType, customName } = req.body;
  const name = customName?.trim() || 'friend';
  const category = moodCategory || 'general sadness';
  const need = needType || 'gentle-hug';

  if (!ai) {
    const randomFallback = fallbackComfortNotes[Math.floor(Math.random() * fallbackComfortNotes.length)];
    return res.json({
      success: true,
      data: {
        title: randomFallback.title,
        letter: randomFallback.letter.replace('Take a slow', `Dearest ${name}, take a slow`),
        gentleTip: randomFallback.gentleTip,
        comfortTag: randomFallback.comfortTag,
        isAiGenerated: false
      }
    });
  }

  try {
    const prompt = `You are a deeply compassionate, soothing, gentle presence whose purpose is to provide warm, comforting companionship to someone feeling sad, overwhelmed, or down.
User's name: ${name}
What they are experiencing: ${category}
${ventText ? `Their feelings or what they shared: "${ventText}"` : 'They are feeling sad and need comfort and warmth.'}
Tone desired: ${need === 'pep-talk' ? 'Gently uplifting, hopeful, strengthening, validating' : need === 'distraction-story' ? 'Cozy, whimsical, heartwarming micro-story of comforting warmth' : 'Deeply tender, reassuring, validating, cozy like a warm blanket on a rainy day'}.

Rules:
1. Speak directly to them with unconditional warmth and tenderness. Never sound clinical, dismissive, toxic positive, or robotic.
2. Acknowledge that their sadness makes sense and they are not broken for feeling this way.
3. Keep the letter between 120 and 200 words—easy to read for someone who is exhausted.
4. Provide a very small, achievable physical gentle tip (e.g., sip water, stretch neck, notice feet on floor).
5. Give a poetic, comforting title (4-8 words).
6. Return purely valid JSON with keys: "title", "letter", "gentleTip", "comfortTag".`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      4000
    );

    const text = response.text || '';
    let parsed: { title?: string; letter?: string; gentleTip?: string; comfortTag?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        title: "A Gentle Safe Haven For You",
        letter: text || fallbackComfortNotes[0].letter,
        gentleTip: "Take one slow breath in through your nose, and softly sigh it out.",
        comfortTag: "Warmth"
      };
    }

    return res.json({
      success: true,
      data: {
        title: parsed.title || "Here for you right now",
        letter: parsed.letter || fallbackComfortNotes[0].letter,
        gentleTip: parsed.gentleTip || fallbackComfortNotes[0].gentleTip,
        comfortTag: parsed.comfortTag || "Comfort Note",
        isAiGenerated: true
      }
    });
  } catch (error) {
    console.error('Gemini comfort generation error / fallback triggered:', error);
    const randomFallback = fallbackComfortNotes[Math.floor(Math.random() * fallbackComfortNotes.length)];
    return res.json({
      success: true,
      data: {
        title: randomFallback.title,
        letter: randomFallback.letter.replace('Take a slow', `Dearest ${name}, take a slow`),
        gentleTip: randomFallback.gentleTip,
        comfortTag: randomFallback.comfortTag,
        isAiGenerated: false
      }
    });
  }
});

// Endpoint: Spark of joy / Wholesome uplifting surprise
app.post('/api/spark', async (req, res) => {
  const { category } = req.body;
  if (!ai) {
    const randomItem = wholesomeSmiles[Math.floor(Math.random() * wholesomeSmiles.length)];
    return res.json({ success: true, item: randomItem, isAiGenerated: false });
  }

  try {
    const prompt = `Give me a heartwarming, delightful, genuine micro-fact or short cozy observation that brings an instant gentle smile to someone feeling down.
Category preference: ${category || 'animals or everyday beauty'}.
Format strictly as JSON with keys:
"fact": string (1-2 sentences of pure wholesome sweetness, factual or poetic everyday wonder),
"type": string (e.g. "Wholesome Fact", "Cozy Thought", "Animal Delight")`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      3500
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      item: {
        fact: parsed.fact || wholesomeSmiles[0].fact,
        type: parsed.type || "Gentle Wonder"
      },
      isAiGenerated: true
    });
  } catch {
    const randomItem = wholesomeSmiles[Math.floor(Math.random() * wholesomeSmiles.length)];
    return res.json({ success: true, item: randomItem, isAiGenerated: false });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Sunsprout Comfort Sanctuary running on port ${port}`);
  });
}

startServer();
