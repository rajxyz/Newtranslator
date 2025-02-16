const express = require("express");  
const axios = require("axios");  
const router = express.Router();  

router.post("/", async (req, res) => {  
  const { text, target } = req.body;  

  if (!text || !target) return res.status(400).json({ error: "Text and target language required" });  

  try {  
    const response = await axios.post("https://api.mymemory.translated.net/get", null, {  
      params: { q: text, langpair: `auto|${target}` }  
    });  

    const translatedText = response.data.responseData.translatedText || "Translation failed";  
    res.json({ translatedText });  
  } catch (error) {  
    res.status(500).json({ error: "Error translating text" });  
  }  
});  

module.exports = router;
