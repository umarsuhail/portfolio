import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      });

      res.status(200).json({ response: completion.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: 'Error generating response from OpenAI.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
