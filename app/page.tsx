import fs from 'fs';
import path from 'path';
import ScrollToTop from '@/components/ScrollToTop';
import ThemeToggle from '@/components/ThemeToggle';
import CopyButton from '@/components/CopyButton';

interface Article {
  id: string;
  category: string;
  korean_title: string;
  original_title: string;
  summary: string;
  tags: string[];
  source: string;
  source_url: string;
  thumbnail: string;
  is_ai?: boolean;
  is_today?: boolean;
  impact_score?: number;
  created_at: string;
}

function decodeHtmlEntities(text: string) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#([0-9]{1,5});/gi, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-fA-F]{1,5});/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export default async function Home() {
  const dataPath = path.join(process.cwd(), 'src/data/it.json');
  let articles: Article[] = [];
  try {
    if (fs.existsSync(dataPath)) {
      const fileContents = fs.readFileSync(dataPath, 'utf8');
      let rawArticles: Article[] = JSON.parse(fileContents);
      
      articles = rawArticles.map(a => ({
        ...a,
        korean_title: decodeHtmlEntities(a.korean_title),
        original_title: decodeHtmlEntities(a.original_title),
        summary: decodeHtmlEntities(a.summary)
      }));
    }
  } catch (e) {
    console.error('Error reading data:', e);
  }

  // 기사 정렬 로직 (미국 타임존 '오늘' > 비즈니스 임팩트 > 최신순)
  articles.sort((a, b) => {
    if (a.is_today && !b.is_today) return -1;
    if (!a.is_today && b.is_today) return 1;
    const scoreA = a.impact_score || 0;
    const scoreB = b.impact_score || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    // Notion Theme: Unified background and text from CSS variables
    <div className="relative min-h-screen bg-white dark:bg-editor-bg transition-colors duration-300 font-sans selection:bg-blue-300 dark:selection:bg-blue-900/40">

      {/* ── Header ─────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#E1E1E1] dark:border-editor-border bg-white/70 dark:bg-editor-bg/70 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground dark:bg-gray-200 rounded flex items-center justify-center shrink-0">
              <span className="text-white dark:text-gray-900 font-bold text-xs leading-none tracking-tight">N</span>
            </div>
            <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-[#787774] dark:text-editor-muted hidden sm:block">
              Tech Radar
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Hero ───────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <section className="mb-24 flex flex-col items-center text-center gap-6">
          {/* Notion Style Pill */}
          <div className="px-5 py-2 bg-[#F7F6F3] dark:bg-editor-surface border border-[#E1E1E1] dark:border-editor-border rounded-full">
            <span className="text-sm md:text-base font-bold tracking-tight text-foreground">
              {today}
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tightest leading-[1.1] text-foreground max-w-4xl">
            Global <br />
            <span className="text-[#007AFF] dark:text-gray-200">Briefing.</span>
          </h2>

          <p className="text-lg md:text-xl text-[#787774] dark:text-editor-muted max-w-2xl font-medium leading-relaxed">
            노이즈를 걷어낸 실리콘밸리 테크 스트림. 문서처럼 정독하는 테크 브리핑.
          </p>
        </section>

        {/* ── 2 Column Article Grid ─────── */}
        {articles.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-sm font-bold tracking-widest text-foreground opacity-50 uppercase animate-pulse">
              Syncing Cloud Data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {articles.map((article, index) => (
              <a
                key={`${article.id ?? article.source}_${index}`}
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                // Notion Card Style
                className="group relative flex flex-col gap-6 p-8 rounded-xl bg-white dark:bg-editor-card border border-[#E1E1E1] dark:border-editor-border transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#2F2F2F]/20 hover:border-[#D1D1D1] dark:hover:border-blue-500/30"
              >
                {/* Copy Markdown Button */}
                <CopyButton article={article} />

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-mono font-black uppercase tracking-widest text-[#007AFF]">
                    {article.source}
                  </span>
                  {article.is_today && (
                    <span className="px-2.5 py-1 rounded border border-green-500/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest bg-green-500/10">
                      HOT
                    </span>
                  )}
                  {(article.impact_score ?? 0) > 0 && (
                    <span className="px-2.5 py-1 rounded border border-orange-500/30 text-orange-700 dark:text-orange-400 text-xs font-black uppercase tracking-widest bg-orange-500/10">
                      IMPACT
                    </span>
                  )}
                  {article.is_ai && (
                    <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider">
                      AI
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[1.35rem] md:text-2xl font-bold tracking-tight leading-[1.3] h-[2.6em] overflow-hidden text-foreground break-keep line-clamp-2 group-hover:text-[#007AFF] transition-colors">
                  {article.korean_title}
                </h3>

                {/* Summary */}
                <p className="text-[1.05rem] md:text-lg tracking-[-0.01em] leading-[1.7] h-[6.8em] min-h-[6.8em] overflow-hidden text-[#787774] dark:text-editor-muted group-hover:text-foreground transition-colors font-medium break-keep line-clamp-4">
                  {article.summary}
                </p>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-5 border-t border-[#F1F1EF] dark:border-editor-border">
                    {article.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={`${tag}_${tagIndex}`}
                        className="text-xs font-medium px-3 py-1.5 rounded bg-[#F1F1EF] dark:bg-editor-surface text-foreground border border-[#E1E1E1] dark:border-editor-border font-mono tracking-wide group-hover:bg-[#E1E1E1] dark:group-hover:bg-neutral-800 transition-colors"
                      >
                         {tag.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────── */}
      <footer className="mt-40 py-24 px-6 border-t border-[#E1E1E1] dark:border-editor-border bg-[#F7F6F3] dark:bg-editor-surface transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[0.65rem] font-black uppercase tracking-[0.4em] text-[#787774] dark:text-editor-muted">
          <span>NWNEWS Tech Radar Engine © 2026</span>
          <span className="hidden md:block">ZERO-COST AUTOMATED ARCHITECTURE</span>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
