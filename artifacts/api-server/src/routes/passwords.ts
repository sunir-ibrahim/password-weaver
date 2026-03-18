import { Router, type IRouter } from "express";
import { GeneratePasswordsBody, GeneratePasswordsResponse } from "@workspace/api-zod";
import { groq } from "../lib/groq";

const router: IRouter = Router();

router.post("/passwords/generate", async (req, res): Promise<void> => {
  const parsed = GeneratePasswordsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { previousPasswords } = parsed.data;

  try {
    const passwordList = previousPasswords
      .map((p, i) => `Password ${i + 1}: ${p}`)
      .join("\n");

    const systemPrompt = `You are a security expert and password analyst. Your job is to analyze patterns in a user's previous passwords and generate new passwords that are:
1. MEMORABLE - based on patterns/themes the user already uses (e.g., they like using words, numbers, symbols in certain positions)
2. STRONG - at least 12 characters, mix of uppercase, lowercase, numbers, and special characters
3. NOVEL - completely different from the provided passwords (never reuse the same password)

You must respond ONLY with valid JSON matching this exact schema:
{
  "suggestions": [
    {
      "password": "string",
      "strength": "weak" | "fair" | "strong" | "very_strong",
      "memorabilityNote": "string explaining what pattern from their style you kept",
      "strengthNote": "string explaining what makes this password secure"
    }
  ],
  "analysisNote": "string summarizing the patterns you found in their previous passwords"
}

Generate exactly 5 password suggestions. All suggestions must be rated "strong" or "very_strong".
Do not include any text outside the JSON object.`;

    const userMessage = `Please analyze these previous passwords and generate 5 new memorable yet strong password suggestions:\n\n${passwordList}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error("No content received from Groq API:", completion);
      res.status(500).json({ error: "Failed to generate password suggestions: empty response from AI." });
      return;
    }

    let rawData: unknown;
    try {
      rawData = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON response from Groq:", content, parseError);
      res.status(500).json({ error: "Invalid response from AI service: failed to parse JSON." });
      return;
    }

    const validated = GeneratePasswordsResponse.safeParse(rawData);
    if (!validated.success) {
      console.error("Validation error for AI response:", validated.error, "Raw Data:", rawData);
      res.status(500).json({ error: "AI response did not match expected format." });
      return;
    }

    res.json(validated.data);
  } catch (error: any) {
    console.error("Error occurred while generating passwords:", error);
    res.status(500).json({ 
      error: error.message 
        ? `An unexpected error occurred while analyzing passwords: ${error.message}` 
        : "An unexpected error occurred while analyzing passwords."
    });
  }
});

export default router;
