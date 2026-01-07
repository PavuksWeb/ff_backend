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

async function checkModeration(text: string) {
  const response = await openai.moderations.create({
    model: 'omni-moderation-latest',
    input: text,
  });

  const result = response.results[0];

  return {
    flagged: result.flagged,
    categories: result.categories,
  };
}

export async function sendMessage(userText?: string) {
  if (!userText) return;

  const moderation = await checkModeration(userText);

  if (moderation.flagged) {
    throw new Error(
      `MODERATION_BLOCKED: ${JSON.stringify(moderation.categories)}`,
    );
  }

  const newMessage: ChatCompletionMessageParam = {
    role: 'user',
    content: userText,
  };
  messages.push(newMessage);

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
