const { Anthropic } = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function askClaude(message) {
    const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [
            {
                role: "user",
                content: message
            }
        ]
    });

    return response.content?.[0]?.text || "No response";
}

module.exports = { askClaude };