/**
 * NWNEWS Daily Zero-Cost Engine Config
 */
const FEEDS = {
  IT: [
    'https://news.ycombinator.com/rss',
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss',
    'https://9to5mac.com/feed/',
    'https://v2ex.com/index.xml'
  ],
  US: [
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://feeds.a.dj.com/rss/RSSWorldNews.xml'
  ],
  JP: [
    'https://news.yahoo.co.jp/rss/topics/world.xml',
    'https://www.asahi.com/rss/index.rdf'
  ]
};

module.exports = { FEEDS };
