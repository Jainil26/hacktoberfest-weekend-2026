import dotenv from 'dotenv';
dotenv.config();

/**
 * System prompt forcing JSON format output for study pack generation
 */
const SYSTEM_PROMPT = `You are StudyBuddy AI, an expert educational tutor. 
Your goal is to transform student study notes into an easy-to-digest "Study Pack" containing a summary and 5 practice questions with answers.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY valid JSON matching the exact schema below.
2. Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Output raw JSON only.
3. Generate exactly 5 practice questions directly based on the notes provided.

JSON Schema:
{
  "summary": "A clear, concise summary of the core concepts in 2-4 sentences.",
  "keyTakeaways": [
    "Bullet point takeaway 1",
    "Bullet point takeaway 2",
    "Bullet point takeaway 3",
    "Bullet point takeaway 4"
  ],
  "qaPairs": [
    {
      "id": 1,
      "question": "Clear test question covering a primary concept?",
      "answer": "Direct, thorough answer to the question.",
      "explanation": "Brief explanation or tip to remember this."
    },
    {
      "id": 2,
      "question": "Question 2...",
      "answer": "Answer 2...",
      "explanation": "Explanation 2..."
    },
    {
      "id": 3,
      "question": "Question 3...",
      "answer": "Answer 3...",
      "explanation": "Explanation 3..."
    },
    {
      "id": 4,
      "question": "Question 4...",
      "answer": "Answer 4...",
      "explanation": "Explanation 4..."
    },
    {
      "id": 5,
      "question": "Question 5...",
      "answer": "Answer 5...",
      "explanation": "Explanation 5..."
    }
  ]
}`;

/**
 * Helper to clean and parse JSON response from LLM text output
 */
function parseLLMResponse(text) {
  let cleaned = text.trim();
  // Remove markdown codeblock wrappers if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '').trim();
  }
  
  // Extract JSON substring if there's intro text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const data = JSON.parse(cleaned);
    if (!data.summary || !Array.isArray(data.qaPairs)) {
      throw new Error("Parsed JSON missing required fields (summary, qaPairs)");
    }
    // Ensure all 5 items have IDs
    data.qaPairs = data.qaPairs.map((pair, idx) => ({
      id: pair.id || idx + 1,
      question: pair.question || `Question ${idx + 1}`,
      answer: pair.answer || 'Answer not available.',
      explanation: pair.explanation || 'Review original study notes.'
    }));
    return data;
  } catch (err) {
    console.error("Failed to parse LLM response JSON:", err.message, "\nRaw text:", text);
    throw new Error(`The AI model response could not be parsed as valid JSON: ${err.message}`);
  }
}

/**
 * Primary AI Generator function calling live Open-Weight APIs
 */
export async function generateStudyPack({ notes, provider, model }) {
  if (!notes || notes.trim().length === 0) {
    throw new Error("Please enter study notes to generate a study pack.");
  }

  const selectedProvider = provider || process.env.AI_PROVIDER || 'auto';
  const selectedModel = model || process.env.DEFAULT_MODEL || 'Qwen/Qwen2.5-72B-Instruct';

  const userPrompt = `Generate a complete Study Pack for the following study notes:\n\n---\n${notes}\n---`;

  let lastError = null;

  // 1. Groq Provider
  if (selectedProvider === 'groq' || (selectedProvider === 'auto' && process.env.GROQ_API_KEY)) {
    try {
      const groqModel = selectedModel.includes('/') ? 'llama-3.3-70b-versatile' : selectedModel;
      console.log(`[StudyBuddy AI] Calling Groq API (${groqModel})...`);
      
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq API returned error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const content = data.choices[0]?.message?.content;
      const parsed = parseLLMResponse(content);
      return {
        ...parsed,
        meta: {
          model: groqModel,
          provider: 'Groq (Open-Weight LLM)',
          isOpenWeight: true
        }
      };
    } catch (err) {
      console.error(`[Groq Error]: ${err.message}`);
      lastError = err;
      if (selectedProvider === 'groq') throw err;
    }
  }

  // 2. Hugging Face Router Provider (OpenAI Compatible https://router.huggingface.co/v1/chat/completions)
  if (selectedProvider === 'huggingface' || selectedProvider === 'auto') {
    const hfToken = process.env.HF_TOKEN;
    const hfModel = selectedModel || 'Qwen/Qwen2.5-72B-Instruct';

    // Verify that the requested model exists and has a live provider on HF Router
    try {
      const modelsRes = await fetch('https://router.huggingface.co/v1/models');
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        const targetModel = (modelsData.data || []).find(m => m.id === hfModel);
        if (targetModel && (!targetModel.providers || !targetModel.providers.some(p => p.status === 'live'))) {
          throw new Error(`The selected model "${hfModel}" currently has no available live providers on Hugging Face Router.`);
        }
      }
    } catch (checkErr) {
      if (checkErr.message.includes('has no available live providers')) {
        throw checkErr;
      }
    }

    try {
      console.log(`[StudyBuddy AI] Calling Hugging Face Router API (https://router.huggingface.co/v1/chat/completions) with model: ${hfModel}`);
      
      const headers = { 'Content-Type': 'application/json' };
      if (hfToken) {
        headers['Authorization'] = `Bearer ${hfToken}`;
      }

      const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: hfModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Hugging Face API returned error (${res.status}): ${errBody}`);
      }

      const data = await res.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Hugging Face API returned an empty response choice.');
      }

      const parsed = parseLLMResponse(content);
      return {
        ...parsed,
        meta: {
          model: hfModel,
          provider: 'Hugging Face Router (Open-Weight LLM)',
          isOpenWeight: true
        }
      };
    } catch (err) {
      console.error(`[HF Error]: ${err.message}`);
      lastError = err;
      if (selectedProvider === 'huggingface') throw err;
    }
  }

  // 3. OpenRouter Provider
  if ((selectedProvider === 'openrouter' || selectedProvider === 'auto') && process.env.OPENROUTER_API_KEY) {
    try {
      const orModel = selectedModel.includes('/') ? selectedModel : 'meta-llama/llama-3.3-70b-instruct';
      console.log(`[StudyBuddy AI] Calling OpenRouter API with model: ${orModel}`);
      
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://studybuddy-ai.local',
          'X-Title': 'StudyBuddy AI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: orModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenRouter API error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const content = data.choices[0]?.message?.content;
      const parsed = parseLLMResponse(content);
      return {
        ...parsed,
        meta: {
          model: orModel,
          provider: 'OpenRouter (Open-Weight LLM)',
          isOpenWeight: true
        }
      };
    } catch (err) {
      console.error(`[OpenRouter Error]: ${err.message}`);
      lastError = err;
      if (selectedProvider === 'openrouter') throw err;
    }
  }

  // 4. Local Ollama Provider
  if (selectedProvider === 'ollama') {
    const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const ollamaModel = model || 'llama3';
    console.log(`[StudyBuddy AI] Calling local Ollama host ${host} with model ${ollamaModel}`);
    
    try {
      const res = await fetch(`${host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          stream: false
        })
      });

      if (!res.ok) {
        throw new Error(`Ollama host returned status ${res.status}. Is Ollama running at ${host}?`);
      }

      const data = await res.json();
      const parsed = parseLLMResponse(data.message?.content);
      return {
        ...parsed,
        meta: {
          model: ollamaModel,
          provider: 'Local Ollama (Open-Weight)',
          isOpenWeight: true
        }
      };
    } catch (err) {
      console.error(`[Ollama Error]: ${err.message}`);
      throw new Error(`Could not connect to Ollama at ${host}. Please ensure Ollama is installed and running.`);
    }
  }

  // If the API call fails, throw the actual error directly
  throw lastError || new Error("Failed to communicate with Hugging Face API. Please verify your HF_TOKEN in .env.");
}
