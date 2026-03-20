const axios = require('axios');
const Parser = require('@postlight/parser');
const nlp = require('compromise');
const translate = require('google-translate-api-next');

async function safeTranslate(text) {
  if (!text) return '';
  try {
    const res = await translate(text, { to: 'ko' });
    return res.text;
  } catch (e) {
    console.warn(`Translation failed for: ${text.substring(0, 20)}...`, e.message);
    return text; // Fallback to original text
  }
}

async function devToAgent() {
  console.log("🚀 Starting Zero-Cost DEV.to Agent...");
  
  try {
    // 1. Fetch 5 webdev articles
    const res = await axios.get('https://dev.to/api/articles?tag=webdev&per_page=5');
    const articles = res.data;

    const outputData = [];

    for (const article of articles) {
      console.log(`Processing: ${article.title}`);
      
      // 2. Extract content
      const parsed = await Parser.parse(article.url);
      const textContent = (parsed && parsed.textContent) ? parsed.textContent : article.description || '';

      // 3. NLP Summarization (Top 3 sentences)
      const doc = nlp(textContent);
      const sentences = doc.sentences().out('array');
      const top3_sentences = sentences.slice(0, 3);
      
      // If the content is too short, we pad it with the description
      if (top3_sentences.length === 0 && article.description) {
        top3_sentences.push(article.description);
      }

      // 4. Translate title and sentences
      const koTitle = await safeTranslate(article.title);
      const koSentences = await Promise.all(top3_sentences.map(s => safeTranslate(s)));

      // 5. Format to Bullet Points
      const summaryText = koSentences.map((s, index) => `${index + 1}. ${s}`).join('\n');

      // 6. Push to our result array strictly formatted
      outputData.push({
        original_title: article.title,
        korean_title: koTitle,
        summary: summaryText,
        source_url: article.url
      });
    }

    // Output pure JSON exactly as the system prompt requested
    console.log("\n================ [AGENT OUTPUT] ================\n");
    console.log(JSON.stringify(outputData, null, 2));
    console.log("\n================================================\n");
    
    // Save to file for frontend rendering
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../src/data/devto.json');
    fs.writeFileSync(dataPath, JSON.stringify(outputData, null, 2));
    console.log(`Saved DEV.to data to ${dataPath}`);

    return outputData;
    
  } catch (e) {
    console.error("Agent failed:", e.message);
  }
}

if (require.main === module) {
  devToAgent();
}

module.exports = devToAgent;
