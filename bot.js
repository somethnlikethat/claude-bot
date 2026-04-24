const { ActivityHandler, MessageFactory } = require("botbuilder");
const { Anthropic } = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

class EchoBot extends ActivityHandler {
    constructor() {
        super();

        // ===== MAIN MESSAGE HANDLER =====
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text || "";

            try {
                const response = await anthropic.messages.create({
                    model: "claude-haiku-4-5-20251001",
                    max_tokens: 800,
                    messages: [
                        {
                            role: "user",
                            content: userMessage,
                        },
                    ],
                });

                // Safe extraction (prevents crashes if format changes)
                const rawText = response?.content?.[0]?.text;

                const replyText =
                    typeof rawText === "string" && rawText.trim().length > 0
                        ? rawText
                        : "I didn’t get a response from Claude.";

                // Teams message safety limit (~4000 chars safe zone)
                const safeReply =
                    replyText.length > 3500
                        ? replyText.slice(0, 3500) + "..."
                        : replyText;

                await context.sendActivity(
                    MessageFactory.text(safeReply)
                );

            } catch (err) {
                console.error("Claude error:", err);

                await context.sendActivity(
                    "⚠️ Sorry — Claude had an issue processing that request."
                );
            }

            await next?.();
        });

        // ===== WELCOME MESSAGE =====
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded || [];

            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        "👋 Hey — I'm your Claude-powered bot. Ask me anything."
                    );
                }
            }

            await next?.();
        });
    }
}

module.exports.EchoBot = EchoBot;