import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_TRELLO_KEY });

export default openai;
