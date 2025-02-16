const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const TRANSLATION_API_URL = "https://libretranslate.com";
const API_KEY = "your-api-key"; // Add your API key here

// **1. Detect Language**
app.post("/detect", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(`${TRANSLATION_API_URL}/detect`, {
      q: text,
      api_key: API_KEY, // ✅ Include API key
    });

    if (!response.data || response.data.length === 0) {
      return res.status(400).json({ error: "No language detected" });
    }

    res.json({ language: response.data[0].language });
  } catch (error) {
    console.error("Error detecting language:", error.response?.data || error.message);
    res.status(500).json({ error: "Language detection failed" });
  }
});

// **2. Translate Text**
app.post("/translate", async (req, res) => {
  try {
    const { text, source, target } = req.body;
    const response = await axios.post(`${TRANSLATION_API_URL}/translate`, {
      q: text,
      source,
      target,
      format: "text",
      api_key: API_KEY, // ✅ Include API key
    });

    res.json({ translatedText: response.data.translatedText });
  } catch (error) {
    console.error("Error translating text:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
