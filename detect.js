const express = require("express");
const OpenAI = require("openai"); // ✅ Import OpenAI SDK
const router = express.Router();

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use Render's environment variable
});

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    // ✅ Ask GPT-3.5 to detect language
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: `Detect the language of this text: "${text}"` }],
    });

    const detectedLanguage = response.choices?.[0]?.message?.content?.trim() || "Detection failed";
    
    res.json({ language: detectedLanguage });

  } catch (error) {
    console.error("Error detecting language:", error.response?.data || error.message);
    res.status(500).json({ error: "Language detection failed" });
  }
});

module.exports = router;
