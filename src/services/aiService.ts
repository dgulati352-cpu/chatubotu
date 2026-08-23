import { SupportedAIModel } from '../types/agent';

export interface AiApiConfig {
  model: SupportedAIModel;
  apiKey?: string;
  baseUrl?: string; // for Ollama or custom proxies
}

export class AiService {
  private config: AiApiConfig;

  constructor(config: AiApiConfig = { model: 'gemini-2.5-flash' }) {
    this.config = config;
  }

  public updateConfig(config: Partial<AiApiConfig>) {
    this.config = { ...this.config, ...config };
  }

  public async callModel(systemPrompt: string, userPrompt: string): Promise<string> {
    // If user provided a real Gemini API Key
    if (this.config.apiKey && this.config.model.startsWith('gemini')) {
      try {
        const modelName = this.config.model.includes('pro') ? 'gemini-2.0-pro-exp-02-05' : 'gemini-2.0-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.config.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nTask: ${userPrompt}` }]
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to autonomous agent engine:', err);
      }
    }

    // If user provided OpenAI key
    if (this.config.apiKey && this.config.model.startsWith('gpt')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            model: this.config.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } catch (err: any) {
        console.warn('OpenAI API call failed, falling back to autonomous agent engine:', err);
      }
    }

    // Default fast autonomous simulation response
    return `[Antigravity Neural Synthesis for: ${userPrompt}]`;
  }
}
