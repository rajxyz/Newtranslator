const express = require("express");  
const axios = require("axios");  
const router = express.Router();  

router.post("/", async (req, res) => {  
  const { text } = req.body;  

  if (!text) return res.status(400).json({ error: "Text is required" });  

  try {  
    const response = await axios.post("https://api.mymemory.translated.net/get", null, {  
      params: { q: text, langpair: "auto|en" }  
    });  

    const detectedLang = response.data.responseData.detectedLanguage || "unknown";  
    res.json({ language: detectedLang });  
  } catch (error) {  
    res.status(500).json({ error: "Error detecting language" });  
  }  
});  

module.exports = router;
