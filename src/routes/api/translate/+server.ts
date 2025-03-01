import OpenAI from "openai";
import { json } from "@sveltejs/kit";
import { OPENAI_API_KEY } from "$env/static/private";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function POST({ request }: {request: Request}) {
    try {
        const data = await request.json()
        const selected = data.selected
        const prompt = data.prompt

        if (!prompt) {
            return new Response(JSON.stringify({error: "No Input"}) , { status: 400 });
        }
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": "You are a precise and context-aware translator. Given the user's input, detect the input language and provide three distinct contexts in that same language where the word or phrase could have different translations.\n\nThen, translate the word or phrase into ${selected}, considering each context. Return a JSON object where:\n\n- The keys are the specific contexts in the detected input language.\n- The values are the appropriate translations in ${selected} based on those contexts.\n\nEnsure the contexts are detailed enough to clarify the differences in meaning. Do not provide explanations, only return the JSON object."
                },          
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            store: true,
        });

        const content = completion.choices[0]?.message?.content || "No content received.";

        return json({ contexts: content });
    } catch (error) {
        console.error("Error generating contexts", error);
        return json({ error: "Failed to generate contexts" }, { status: 500 });
    }
}

