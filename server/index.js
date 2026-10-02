import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStudyPack } from './aiService.js';
import { SAMPLE_NOTES } from './sampleNotes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health & System Info Endpoint
app.get('/api/health', (req, res) => {
  const hasHfToken = Boolean(process.env.HF_TOKEN && process.env.HF_TOKEN.trim().length > 0);
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
  const hasOpenRouterKey = Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0);

  res.json({
    status: 'online',
    appName: 'StudyBuddy AI',
    theme: 'Hacktoberfest 2026 - Build for a Friend',
    defaultModel: process.env.DEFAULT_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
    activeProvider: process.env.AI_PROVIDER || 'auto',
    apiKeysConfigured: {
      huggingface: hasHfToken,
      groq: hasGroqKey,
      openrouter: hasOpenRouterKey,
      ollama: process.env.OLLAMA_HOST || 'http://localhost:11434'
    },
    supportedModels: [
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B Instruct', provider: 'Hugging Face', type: 'Open-Weight (Default)' },
      { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'Llama 3.3 70B Instruct', provider: 'Hugging Face', type: 'Open-Weight' },
      { id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B', name: 'DeepSeek R1 Distill Qwen 32B', provider: 'Hugging Face', type: 'Open-Weight' }
    ]
  });
});

// Live HF Router Models Endpoint
app.get('/api/models', async (req, res) => {
  try {
    const hfRes = await fetch('https://router.huggingface.co/v1/models');
    if (!hfRes.ok) {
      throw new Error(`HF Router API returned HTTP ${hfRes.status}`);
    }
    const data = await hfRes.json();
    const liveModels = (data.data || [])
      .filter(m => m.providers && m.providers.some(p => p.status === 'live'))
      .map(m => {
        const liveProviders = m.providers.filter(p => p.status === 'live');
        return {
          id: m.id,
          name: m.id,
          displayName: m.id.split('/').pop(),
          providerCount: liveProviders.length,
          hasLiveProvider: true
        };
      });

    return res.json({ success: true, models: liveModels });
  } catch (err) {
    console.warn('[HF Models Fetch Error]:', err.message);
    const fallbackModels = [
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen/Qwen2.5-72B-Instruct', displayName: 'Qwen2.5-72B-Instruct', providerCount: 1, hasLiveProvider: true },
      { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'meta-llama/Llama-3.3-70B-Instruct', displayName: 'Llama-3.3-70B-Instruct', providerCount: 1, hasLiveProvider: true },
      { id: 'deepseek-ai/DeepSeek-R1', name: 'deepseek-ai/DeepSeek-R1', displayName: 'DeepSeek-R1', providerCount: 1, hasLiveProvider: true }
    ];
    return res.json({ success: true, models: fallbackModels, fallback: true });
  }
});

// Sample Notes Endpoint
app.get('/api/sample-notes', (req, res) => {
  res.json(SAMPLE_NOTES);
});

// Generate Study Pack Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { notes, provider, model } = req.body;

    if (!notes || typeof notes !== 'string') {
      return res.status(400).json({ error: 'Please provide valid study notes text.' });
    }

    if (notes.trim().length === 0) {
      return res.status(400).json({ error: 'Notes cannot be empty. Please paste your study notes.' });
    }

    const studyPack = await generateStudyPack({ notes, provider, model });
    return res.json({ success: true, data: studyPack });
  } catch (error) {
    console.error('Error in /api/generate:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while generating the Study Pack.'
    });
  }
});

// Serve frontend build in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), err => {
    if (err) {
      res.status(200).send('StudyBuddy AI Backend Server Running. (Client build not compiled yet)');
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 StudyBuddy AI Server running on http://localhost:${PORT}`);
  console.log(`🎯 Theme: Hacktoberfest 2026 - Build for a Friend`);
  console.log(`🤖 Open-Weight AI Provider: ${process.env.AI_PROVIDER || 'auto'}\n`);
});
