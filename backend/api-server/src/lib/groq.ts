import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env["OPENROUTER_API_KEY"];

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY environment variable is required but not set.");
}

export const openrouter = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});
