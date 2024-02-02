import openai from '@/openai';
import { NextResponse } from 'next/server';
import { APIError } from 'openai/error.mjs';

export async function POST(request: Request) {
  const { tasks } = await request.json();

  if (process.env.OPENAI_ENABLED! !== 'true') {
    return NextResponse.json({
      content:
        'Welcome to Trello Clone! \nUnfortunately AI support is not available at the moment.',
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      n: 1,
      stream: false,
      messages: [
        {
          role: 'system',
          content: `
            When responding, welcome user and say welcome to Trello Clone!
            Limit the response to 200 characters
          `,
        },
        {
          role: 'user',
          content: `
            Hi there, provide a summary of the following tasks.
            Count how many tasks are in each category such as "Todo", "In Progress", "Done".
            Suggest how user should start carrying out tasks based on their title.
            Then tell the user to have a productive day!
            Here's the data: ${JSON.stringify(tasks)}
          `,
        },
      ],
    });

    const [choice] = completion.choices;

    return NextResponse.json(choice.message);
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(error, { status: error.status });
    }
    return NextResponse.json(error, { status: 500 });
  }
}
