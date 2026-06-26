/**
 * POST /api/onboarding-chat  — chat de 3 preguntas para afinar el rubro.
 * 👤 Persona C (consume lib/ai).
 * Body: { empresa: Partial<Empresa>, history: ChatMessage[] }
 *  →  ApiResponse<OnboardingChatResponse>
 */
import { NextResponse } from "next/server";
import type { ApiResponse, ChatMessage, Empresa, OnboardingChatResponse } from "@/lib/types";
import { askClaudeJson } from "@/lib/ai/client";
import {
  onboardingSystemPrompt,
  onboardingUserPrompt,
  onboardingResponseSchema,
} from "@/lib/ai/prompts/onboarding";

type Body = { empresa: Partial<Empresa>; history: ChatMessage[] };
type LLM = { reply: string; done: boolean; rubros: string[]; especialidad: string };

export async function POST(request: Request): Promise<NextResponse<ApiResponse<OnboardingChatResponse>>> {
  try {
    const { empresa, history } = (await request.json()) as Body;
    const llm = await askClaudeJson<LLM>({
      system: onboardingSystemPrompt(empresa ?? {}),
      user: onboardingUserPrompt(history ?? []),
      schema: onboardingResponseSchema,
      maxTokens: 1024,
    });
    return NextResponse.json({
      ok: true,
      data: {
        reply: llm.reply,
        done: llm.done,
        perfilParcial: { rubros: llm.rubros, especialidad: llm.especialidad },
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
