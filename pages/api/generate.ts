import { Configuration, OpenAIApi } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured.',
      },
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid keyword.',
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-babbage-001',
      prompt: generatePrompt(prompt),
      temperature: 0.6,
      max_tokens: 150,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
};

export default generate;

function generatePrompt(prompt: string) {
  const formattedPrompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
  return `Write a 5 sentence film script about a ${formattedPrompt} learning to talk.`;
}
