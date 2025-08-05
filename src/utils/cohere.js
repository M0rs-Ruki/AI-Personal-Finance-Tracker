

import cohere from 'cohere-ai';
import dotenv from 'dotenv';
import generatePrompt from './promptCohere.js';

dotenv.config({ path: './.env' });
cohere.init(process.env.COHERE_API_KEY);

const getAIAdvice = async (user) => {
  try {
    const prompt = await generatePrompt(user);
    if (!prompt) throw new Error('Prompt generation failed');

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      max_tokens: 300,
      temperature: 0.9,
    });

    const generation = response?.body?.generations?.[0]?.text;
    if (!generation) throw new Error('No AI response received');

    return generation.trim();
  } catch (error) {
    console.error('AI advice generation error:', error.message);
    return 'Unable to generate financial advice at this time. Please try again later.';
  }
};

export default getAIAdvice;
