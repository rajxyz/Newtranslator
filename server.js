const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Replace with a real translation API
const TRANSLATION_API_URL = "https://libretranslate.com"; 

// **1. Detect Language**
app.post("/detect", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(`${TRANSLATION_API_URL}/detect`, {
      q: text,
    });
    res.json({ language: response.data[0].language });
  } catch (error) {
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
    });

    res.json({ translatedText: response.data.translatedText });
  } catch (error) {
    res.status(500).json({ error: "Translation failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
