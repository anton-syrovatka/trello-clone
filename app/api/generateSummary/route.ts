import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();

  const todoData = JSON.stringify(todos);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      n: 1,
      stream: false,
      messages: [
        {
          role: "system",
          content: `
            When responding, welcome the user alway as Herr Syrovatka
            and say welcome to Trello Clone!
            Limit the response to 200 characters
          `,
        },
        {
          role: "user",
          content: `
            Hi there, provide a summary of the following todos.
            Count how many todos are in each category such as "Todo", "In Progress", "Done".
            Suggest how user should start carrying out tasks based on their title.
            Then tell the user to have a productive day! Here's the data: ${todoData}
          `,
        },
      ],
    });

    const [choice] = completion.choices;

    return NextResponse.json(choice.message);
  } catch (error) {
    return NextResponse.json(error);
  }
}
