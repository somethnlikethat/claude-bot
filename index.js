const path = require("path");
const dotenv = require("dotenv");
const express = require("express");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Claude function
const { askClaude } = require("./claude");

// =======================
// EXPRESS APP
// =======================
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================
// HOME PAGE (UI)
// =======================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
// CHAT ENDPOINT (Claude)
// =======================
app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ reply: "No message provided" });
        }

        const reply = await askClaude(message);

        res.json({ reply });

    } catch (error) {
        console.error("Claude error:", error);
        res.status(500).json({
            reply: "Something went wrong talking to Claude"
        });
    }
});

// =======================
// HEALTH CHECK (useful for Render)
// =======================
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});