/**
 * Description: This is the route for the generate-meal-plan endpoint. It is used to generate a meal plan for the user.
 * by passing in a prompt to the endpoint.
 * @param req - NextRequest
 * @returns NextResponse with the structure of the meal plan in JSON format
 * The structure of the meal plan returned is from the MealPlanResponse type
 */

import { MealPlanResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/app/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not set" },
        { status: 500 }
      );
    }

    const {
      prompt,
    }: {
      prompt: string;
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a chef. You are given a prompt. You need to generate a meal plan for the prompt. You also need to return the meal plan in JSON format.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const mealPlan: MealPlanResponse = JSON.parse(
      response?.choices[0]?.message?.content || ""
    );

    return NextResponse.json({ mealPlan: mealPlan.recipes }, { status: 200 });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
