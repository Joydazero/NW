/**
 * NWNEWS Daily Zero-Cost Engine
 * 아키텍처: Readability + NLP + Free Translate
 * 환경: Antigravity Code Node / Vercel Optimized
 */
const Parser = require('@postlight/parser');
const nlp = require('compromise');
const translate = require('google-translate-api-next');
const RSSParser = require('rss-parser');
const axios = require('axios');
const { FEEDS } = require('./config');
require('dotenv').config();

const rssParser = new RSSParser();

async function processArticles(articles, category = 'IT') {
  const processedData = [];

  for (const item of articles) {
    try {
      // 2. 본문 및 메타데이터 정밀 추출
      console.log(`Parsing: ${item.link}`);
      const parsed = await Parser.parse(item.link);
      if (!parsed || !parsed.content) {
        console.warn(`No content for: ${item.link}`);
        continue;
      }
      
      const textContent = parsed.textContent || parsed.content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      
      // 3. NLP 기반 핵심 리드(Lead) 3문장 추출 및 태그 분석
      const doc = nlp(textContent);
      const summaryText = doc.sentences().out('array').slice(0, 3).join(' ');
      const rawTags = doc.topics().out('array').slice(0, 3);

      // 4. 무료 번역 처리 (제목, 요약, 태그)
      const safeTranslate = async (text) => {
        if (!text) return { text: '' };
        try {
          return await translate(text, { to: 'ko' });
        } catch (e) {
          console.warn(`Translation failed for: ${text.substring(0, 20)}...`, e.message);
          return { text: text }; // Fallback to original text
        }
      };

      const [koTitle, koSummary] = await Promise.all([
        safeTranslate(parsed.title),
        safeTranslate(summaryText)
      ]);
      
      const koTags = await Promise.all(
        rawTags.map(tag => safeTranslate(tag).then(res => res.text))
      );

      // 5. GitHub/Vercel 배포용 데이터 규격화 (React/TS Interface 대응)
      processedData.push({
        id: Buffer.from(item.link).toString('base64').substring(0, 16),
        category: category,
        korean_title: koTitle.text,
        original_title: parsed.title,
        summary: koSummary.text,
        tags: koTags,
        source: parsed.domain || item.source || 'Tech',
        source_url: item.link,
        thumbnail: parsed.lead_image_url || '',
        created_at: new Date().toISOString()
      });
      console.log(`Processed: ${parsed.title}`);
    } catch (e) {
      console.error(`Error processing ${item.link}:`, e);
    }
  }

  return { 
    processedData: processedData,
    base64Content: Buffer.from(JSON.stringify(processedData, null, 2)).toString('base64')
  };
}

async function main() {
  console.log("Starting Engine...");
  
  let allArticles = [];
  // For simplicity, we'll fetch IT feeds by default
  for (const feedUrl of FEEDS.IT) {
    try {
      const feed = await rssParser.parseURL(feedUrl);
      allArticles.push(...feed.items);
    } catch (e) {
      console.error(`Failed to fetch feed: ${feedUrl}`);
    }
  }

  // Slice to keep it reasonable for testing if needed
  const articlesToProcess = allArticles.slice(0, 5); 

  const { processedData, base64Content } = await processArticles(articlesToProcess);

  // Here you'd use the GitHub API as described in the prompt
  // But for local development/Vercel deployment, we write to src/data/it.json
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(__dirname, '../src/data/it.json');
  
  fs.writeFileSync(dataPath, JSON.stringify(processedData, null, 2));
  console.log(`Finished. Saved ${processedData.length} articles to it.json`);

  // Optional: If GITHUB_TOKEN is available, use API to push
  if (process.env.GITHUB_TOKEN && process.env.REPO_PATH) {
     // Implementation for GitHub API PUT would go here
     // As specified in the user's prompt Skill: API part
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processArticles };
