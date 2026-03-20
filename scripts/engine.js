/**
 * NWNEWS Daily Zero-Cost Engine
 * Sources: Dev.to, Hacker News, TechCrunch, Smashing Mag
 */
const Parser = require('@postlight/parser');
const nlp = require('compromise');
const translate = require('google-translate-api-next');
const RSSParser = require('rss-parser');
const axios = require('axios');
require('dotenv').config();

const rssParser = new RSSParser();

// AI & Impact Detection regex
const AI_REGEX = /\b(ai|artificial intelligence|llm|gpt|chatgpt|openai|claude|gemini|machine learning|deep learning|neural network|anthropic)\b/i;
const IMPACT_REGEX = /\b(business|acquisition|funding|invest|capital|standard|enterprise|billion|million|revenue|startup|투자|인수|합병|자본|비즈니스|표준|마켓|기업|스타트업|수익)\b/i;

function isTodayUS(dateString) {
  if (!dateString) return false;
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', dateStyle: 'short' });
    return formatter.format(d) === formatter.format(new Date());
  } catch (e) {
    return false;
  }
}

async function fetchDevTo(limit = 10) {
  try {
    console.log("Fetching Dev.to React...");
    const res = await axios.get(`https://dev.to/api/articles?tag=react&per_page=${limit}`);
    return res.data.map(item => ({
      link: item.url,
      source: 'DEV.to',
      pubDate: item.published_at || item.created_at
    }));
  } catch (e) {
    console.error("DEV.to Fetch Error:", e.message);
    return [];
  }
}

async function fetchRss(url, sourceName, limit = 10) {
  try {
    console.log(`Fetching RSS: ${sourceName}...`);
    const feed = await rssParser.parseURL(url);
    return feed.items.slice(0, limit).map(item => ({
      link: item.link,
      source: sourceName,
      pubDate: item.pubDate
    }));
  } catch (e) {
    console.error(`RSS Fetch Error (${sourceName}):`, e.message);
    return [];
  }
}

async function processArticles(articles, category = 'IT') {
  const processedData = [];

  for (const item of articles) {
    try {
      console.log(`Parsing: ${item.link}`);
      const parsed = await Parser.parse(item.link);
      if (!parsed || !parsed.content) {
        console.warn(`No content for: ${item.link}`);
        continue;
      }
      
      const textContent = parsed.textContent || parsed.content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      
      const is_ai = AI_REGEX.test(parsed.title) || AI_REGEX.test(textContent);
      
      let impact_score = 0;
      if (IMPACT_REGEX.test(parsed.title)) impact_score += 2;
      if (IMPACT_REGEX.test(textContent)) impact_score += 1;
      
      const articleDate = item.pubDate || parsed.date_published || new Date().toISOString();
      const is_today = isTodayUS(articleDate);

      const doc = nlp(textContent);
      const summaryText = doc.sentences().out('array').slice(0, 3).join(' ');
      const rawTags = doc.topics().out('array').slice(0, 3);

      const safeTranslate = async (text) => {
        if (!text) return { text: '' };
        try {
          return await translate(text, { to: 'ko' });
        } catch (e) {
          console.warn(`Translation failed...`);
          return { text: text };
        }
      };

      const [koTitle, koSummary] = await Promise.all([
        safeTranslate(parsed.title),
        safeTranslate(summaryText)
      ]);
      
      const koTags = await Promise.all(
        rawTags.map(tag => safeTranslate(tag).then(res => res.text))
      );

      processedData.push({
        id: Buffer.from(item.link).toString('base64').substring(0, 16),
        category: category,
        korean_title: koTitle.text,
        original_title: parsed.title,
        summary: koSummary.text,
        tags: koTags,
        is_ai: is_ai,
        source: parsed.domain || item.source || 'Tech',
        source_url: item.link,
        thumbnail: parsed.lead_image_url || '',
        created_at: new Date().toISOString(),
        pub_date: articleDate,
        is_today: is_today,
        impact_score: impact_score
      });
      console.log(`Processed: ${parsed.title} (AI: ${is_ai})`);
    } catch (e) {
      console.error(`Error processing ${item.link}:`, e.message);
    }
  }

  return processedData;
}

async function main() {
  console.log("Starting Unified Engine...");
  
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(__dirname, '../src/data/it.json');

  // 1. 기존 데이터 읽어오기
  let existingArticles = [];
  try {
    if (fs.existsSync(dataPath)) {
      existingArticles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to read existing data:", e.message);
  }

  // 2. 시간 상수 설정 (2일 경과 데이터 삭제)
  const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
  const now = new Date().getTime();

  console.log("Cleaning old data and processing new tech news...");
  const filteredExisting = existingArticles.filter(article => {
    const createdAt = new Date(article.created_at).getTime();
    return (now - createdAt) < TWO_DAYS_MS;
  });

  const [devto, tc, smash] = await Promise.all([
    fetchDevTo(12),
    fetchRss('https://techcrunch.com/feed/', 'TechCrunch', 12),
    fetchRss('https://www.smashingmagazine.com/feed/', 'Smashing Magazine', 12)
  ]);

  let allArticles = [...devto, ...tc, ...smash];
  
  // 중복 데이터 처리 스킵: 이미 수집된 URL은 파싱 및 변환하지 않음
  const existingUrls = new Set(filteredExisting.map(a => a.source_url));
  const newRawArticles = allArticles.filter(a => !existingUrls.has(a.link));

  console.log(`Found ${allArticles.length} total URLs, fetching new ${newRawArticles.length} articles...`);

  // 3. 신규 데이터 처리 (NLP 요약 및 0원 번역)
  const processedData = await processArticles(newRawArticles);

  // 4. 데이터 합치기 및 중복 제거 (URL 기준)
  const combined = [...processedData, ...filteredExisting];
  const finalData = Array.from(new Map(combined.map(item => [item.source_url, item])).values());
  
  // 5. 정렬 (오늘자 최우선 > 비즈니스/기술표준 점수 높은순 > 최신순)
  finalData.sort((a, b) => {
    if (a.is_today && !b.is_today) return -1;
    if (!a.is_today && b.is_today) return 1;
    
    const scoreA = a.impact_score || 0;
    const scoreB = b.impact_score || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // 6. 저장
  fs.writeFileSync(dataPath, JSON.stringify(finalData, null, 2));
  console.log(`Finished. Saved ${finalData.length} articles to it.json`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processArticles };
