// src/routes/api/generate-haiku/+server.ts
import OpenAI from "openai";
import { json } from "@sveltejs/kit";
import { OPENAI_API_KEY } from "$env/static/private";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function GET() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Write a haiku about recursion in programming." },
            ],
            store: true,
        });

        const content = completion.choices[0]?.message?.content || "No content received.";
        return json({ haiku: content });
    } catch (error) {
        console.error("Error generating haiku:", error);
        return json({ error: "Failed to generate haiku." }, { status: 500 });
    }
}

