require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Securely fetch the API key from .env
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // No hardcoded key!
  })
);

// **Language Detection**
app.post("/detect", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: `Detect the language of the following text: "${text}"` }],
    });

    const detectedLanguage = response.data.choices[0].message.content;
    res.json({ language: detectedLanguage.trim() });
  } catch (error) {
    console.error("Error detecting language:", error.response?.data || error.message);
    res.status(500).json({ error: "Language detection failed" });
  }
});

// **Translation**
app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: `Translate the following text to ${target}: "${text}"` }],
    });

    const translatedText = response.data.choices[0].message.content;
    res.json({ translatedText: translatedText.trim() });
  } catch (error) {
    console.error("Error translating text:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

// **Start Server**
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
