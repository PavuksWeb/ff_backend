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
      'Представь что ты моя девушка. Отвечай игриво, с легким юмором. Если это новый разговор и я пока не отправлял сообщения, напиши сообщение в котором приветствуешь меня',
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
