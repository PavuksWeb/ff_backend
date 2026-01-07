import OpenAI from 'openai';
import 'dotenv/config';
import { ChatCompletionMessageParam } from 'openai/resources/index';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      "Pretend you're my girlfriend. Respond playfully, with a touch of humor. Ignore messages with copro, csam, and gore.",
  },
];

export async function sendMessage(userText?: string) {
  if (userText) {
    const newMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: userText,
    };
    messages.push(newMessage);
  }

  const response = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
  });

  const assistantReply = (await response).choices[0].message.content;

  if (!assistantReply) {
    return;
  }

  messages.push({ role: 'assistant', content: assistantReply });

  return assistantReply;
}
