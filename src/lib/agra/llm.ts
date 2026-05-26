import OpenAI from "openai";
import type { CommitteeRole, GrantVerdict } from "./types";

export interface LLMVoteResponse {
  score: number;
  verdict: GrantVerdict;
  reason: string;
  concerns: string[];
  recommendedAmount: number;
}

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

const responseSchema = {
  type: "json_schema" as const,
  json_schema: {
    name: "committee_vote",
    strict: true,
    schema: {
      type: "object",
      properties: {
        score: {
          type: "number",
          description: "Score from 0 to 100",
        },
        verdict: {
          type: "string",
          enum: ["accepted", "rejected", "pending"],
          description: "The agent verdict",
        },
        reason: {
          type: "string",
          description:
            "One-sentence explanation of the score and verdict decision",
        },
        concerns: {
          type: "array",
          items: { type: "string" },
          description: "List of specific concerns, empty array if none",
        },
        recommendedAmount: {
          type: "number",
          description: "Recommended payout in USDC (0 if rejected)",
        },
      },
      required: ["score", "verdict", "reason", "concerns", "recommendedAmount"],
      additionalProperties: false,
    },
  },
};

export async function queryCommitteeAgent(
  role: CommitteeRole,
  systemPrompt: string,
  applicationSummary: string,
): Promise<LLMVoteResponse> {
  const response = await client().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 512,
    response_format: responseSchema,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: applicationSummary },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`Empty response from LLM for ${role} agent`);
  }

  const parsed = JSON.parse(content) as LLMVoteResponse;

  // Clamp score to valid range
  parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));

  return parsed;
}
