import fs from 'fs';
import path from 'path';
import ScrollToTop from '@/components/ScrollToTop';
import ThemeToggle from '@/components/ThemeToggle';

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
  created_at: string;
}

export default async function Home() {
  const dataPath = path.join(process.cwd(), 'src/data/it.json');
  let articles: Article[] = [];
  try {
    if (fs.existsSync(dataPath)) {
      const fileContents = fs.readFileSync(dataPath, 'utf8');
      articles = JSON.parse(fileContents);
    }
  } catch (e) {
    console.error('Error reading data:', e);
  }

  // 최신순 정렬
  articles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="relative min-h-screen bg-[#111111] dark:bg-editor-bg text-gray-100 dark:text-editor-text transition-colors duration-300">

      {/* ── Header ─────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-800 dark:border-editor-border bg-[#111111]/80 dark:bg-editor-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white dark:text-black font-black text-xs leading-none">N</span>
            </div>
            <h1 className="text-xs font-extrabold uppercase tracking-[0.3em] text-gray-400 dark:text-editor-muted hidden sm:block">
              Tech Radar
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Hero ───────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <section className="mb-20 flex flex-col items-center text-center gap-6">
          {/* Date pill */}
          <div className="px-5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full">
            <span className="text-sm md:text-base font-bold tracking-wide text-[#9ca3af]">
              {today}
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-[#eaeaea] max-w-3xl">
            Global <br />
            <span className="text-editor-accent">Briefing.</span>
          </h2>

          <p className="text-lg text-[#6b7280] max-w-xl font-medium leading-relaxed">
            노이즈를 걷어낸 실리콘밸리 테크 스트림. 매일 자동 업데이트됩니다.
          </p>
        </section>

        {/* ── 2~3 Column Article Grid ─────── */}
        {articles.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-sm font-bold tracking-widest text-gray-400 dark:text-editor-muted uppercase animate-pulse">
              Syncing Cloud Data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-5 p-8 rounded-2xl bg-[#181818] border border-[#2a2a2a] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-blue-500/30"
              >
                {/* Meta row */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-editor-accent">
                    {article.source}
                  </span>
                  {article.is_ai && (
                    <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 text-[0.6rem] font-black uppercase tracking-wider">
                      AI
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black leading-snug text-[#eaeaea] break-keep group-hover:text-editor-accent transition-colors">
                  {article.korean_title}
                </h3>

                {/* Summary */}
                <p className="text-[0.95rem] leading-[1.8] text-[#9ca3af] font-medium break-keep line-clamp-5 flex-1">
                  {article.summary}
                </p>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#2a2a2a]">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.7rem] font-bold px-3 py-1 rounded-md bg-[#222] text-[#9ca3af] border border-[#333] font-mono tracking-wide group-hover:bg-blue-900/30 group-hover:text-blue-300 group-hover:border-blue-700/50 transition-colors"
                      >
                        # {tag.replace(/\s+/g, '')}
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
      <footer className="mt-40 py-16 px-6 border-t border-gray-800 dark:border-editor-border bg-[#0a0a0a] dark:bg-editor-surface transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[0.65rem] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-editor-muted">
          <span>NWNEWS Tech Radar Engine © 2026</span>
          <span className="hidden md:block">Zero-Cost Automated Architecture</span>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
