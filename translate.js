const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post("/", async (req, res) => {
  const { text, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: "Text and target language required" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
  { role: "system", content: "You are a translation assistant." },
  { role: "user", content: `Translate this to ${target}: "${text}"` }
],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        }
      }
    );

    const translatedText = response.data.choices[0]?.message?.content || "Translation failed";
    res.json({ translatedText });
  } catch (error) {
    console.error("Error translating text:", error.response?.data || error.message);
    res.status(500).json({ error: "Error translating text" });
  }
});

module.exports = router;
