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
                { role: "system", content: `You are a translator. Given the input from the user, give three context which would give them different translations. The language you are to give them context for is ${selected}. Only give the context. Do not give an explation. For example, if you were to be asked to translate "hello", some contexts could be: You are talking to your mom, you are talking to a friend, etc.` },
                { role: "user", content: prompt },
            ],
            store: true,
        });

        const content = completion.choices[0]?.message?.content || "No content received.";

        return json({ contexts: content });
    } catch (error) {
        console.error("Error generating contexts", error);
        return json({ error: "Failed to generate contexts" }, { status: 500 });
    }
}

