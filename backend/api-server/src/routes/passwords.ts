import { Router, type IRouter } from "express";
import { GeneratePasswordsBody, GeneratePasswordsResponse } from "@workspace/api-zod";
import { openrouter } from "../lib/groq.js";

/**
 * @swagger
 * /api/passwords/generate:
 *   post:
 *     summary: Generate new passwords based on previous patterns
 *     description: Analyzes previous passwords and generates new strong, memorable passwords using AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               previousPasswords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["MyP@ssw0rd123", "Summer2024!"]
 *             required:
 *               - previousPasswords
 *     responses:
 *       200:
 *         description: Successful response with password suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       password:
 *                         type: string
 *                         example: "Tr0ub4dor&3"
 *                       strength:
 *                         type: string
 *                         enum: [weak, fair, strong, very_strong]
 *                       memorabilityNote:
 *                         type: string
 *                       strengthNote:
 *                         type: string
 *                 analysisNote:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
const router: IRouter = Router();

router.post("/passwords/generate", async (req:any, res:any): Promise<void> => {
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

    const completion = await openrouter.chat.completions.create({
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error("No content received from OpenRouter API:", completion);
      res.status(500).json({ error: "Failed to generate password suggestions: empty response from AI." });
      return;
    }

    let rawData: unknown;
    try {
      rawData = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON response from OpenRouter:", content, parseError);
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
