import { supabaseAnon } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const { data, error } = await supabaseAnon
        .from("pasapalabra_preguntas")
        .select("*");
    
    console.log(data);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

    const selectedQuestions = alphabet.map(letter => {
        const questionsForLetter = data.filter(q => q.letra.toUpperCase() === letter);
        
        if (questionsForLetter.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * questionsForLetter.length);
        const q = questionsForLetter[randomIndex];

        return {
            letra: q.letra,
            pregunta: q.pregunta,
            empieza_por: q.empieza_por,
            respuestas: q.respuestas
        };
    }).filter(Boolean);

    return new Response(JSON.stringify(selectedQuestions), {
        status: 200,
        headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
        }
    });
};
