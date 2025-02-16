require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");  // ✅ Updated import

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// ✅ Correct OpenAI initialization (for v4.x)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // No hardcoded key!
});

// **Language Detection**
app.post("/detect", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: `Detect the language of the following text: "${text}"` }],
    });

    const detectedLanguage = response.choices?.[0]?.message?.content?.trim() || "Detection failed";
    res.json({ language: detectedLanguage });
  } catch (error) {
    console.error("Error detecting language:", error.response?.data || error.message);
    res.status(500).json({ error: "Language detection failed" });
  }
});

// **Translation**
app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a translation assistant." },
        { role: "user", content: `Translate this text to ${target}: "${text}"` }
      ],
    });  // ✅ Fixed syntax error

    const translatedText = response.choices?.[0]?.message?.content?.trim() || "Translation failed";
    res.json({ translatedText });
  } catch (error) {
    console.error("Error translating text:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

// **Start Server**
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
