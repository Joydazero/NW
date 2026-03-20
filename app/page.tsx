import fs from 'fs';
import path from 'path';

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

interface DevToArticle {
  original_title: string;
  korean_title: string;
  summary: string;
  source_url: string;
}

export default async function Home() {
  const dataPath = path.join(process.cwd(), 'src/data/it.json');
  const devToPath = path.join(process.cwd(), 'src/data/devto.json');
  let articles: Article[] = [];
  let devtoArticles: DevToArticle[] = [];
  try {
    if (fs.existsSync(dataPath)) {
      const fileContents = fs.readFileSync(dataPath, 'utf8');
      articles = JSON.parse(fileContents);
    }
    if (fs.existsSync(devToPath)) {
      const devtoContents = fs.readFileSync(devToPath, 'utf8');
      devtoArticles = JSON.parse(devtoContents);
    }
  } catch (e) {
    console.error("Error reading data:", e);
  }

  // 최신순 정렬 (Date DESC)
  articles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="relative min-h-screen text-neutral-900 dark:text-neutral-50 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="fixed inset-0 -z-10 bg-neutral-100 dark:bg-[#090b14]">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-200 dark:bg-blue-900/40 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 dark:bg-purple-900/40 rounded-full blur-[120px] opacity-60"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/40 dark:bg-black/40 border-b border-white/20 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-extrabold text-lg leading-none">N</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
              NWNEWS
            </h1>
          </div>
          <nav className="flex space-x-6 text-sm font-bold text-neutral-500 dark:text-neutral-400">
            <a href="#" className="text-black dark:text-white relative">
              Tech
              <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-t-full"></span>
            </a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Global</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Design</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-14">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            Global Tech Radar
            <span className="px-3 py-1 bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-full text-sm font-extrabold tracking-widest border border-white/40 dark:border-white/20">
              LIVE
            </span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium max-w-2xl">
            가장 빠르고 정확한 글로벌 IT 이슈. 해커뉴스, 테크크런치 등에서 수집된 핵심 뉴스입니다.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 font-medium">아직 뉴스가 수집되지 않았습니다. 데이터를 수집 중입니다...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {articles.map((article) => (
              <a 
                key={article.id} 
                href={article.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group flex flex-col p-7 rounded-3xl backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  article.is_ai 
                    ? 'bg-purple-50/60 dark:bg-purple-900/10 border border-purple-200/80 dark:border-purple-500/30 shadow-[0_4px_30px_rgba(168,85,247,0.1)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.2)]' 
                    : 'bg-white/60 dark:bg-neutral-800/40 border border-white/60 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* 썸네일 제거 완료 */}
                
                <div className="flex flex-col flex-1 relative">
                  {article.is_ai && (
                    <div className="absolute -top-3 -right-3 bg-purple-100/90 dark:bg-purple-800/80 backdrop-blur-md text-purple-700 dark:text-purple-200 text-[0.65rem] font-bold px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-600 shadow-sm flex items-center gap-1.5">
                      <span className="animate-pulse">✨</span> AI
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-[0.7rem] font-extrabold rounded-full uppercase tracking-widest ${article.is_ai ? 'bg-purple-200/50 text-purple-800 dark:bg-purple-500/30 dark:text-purple-200' : 'bg-blue-100/50 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'}`}>
                      {article.source}
                    </span>
                    <span className="text-[0.7rem] text-neutral-500 dark:text-neutral-400 font-bold tracking-wide">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className={`text-[1.3rem] leading-snug font-black mb-4 transition-colors ${article.is_ai ? 'group-hover:text-purple-600 dark:group-hover:text-purple-400' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                    {article.korean_title || article.original_title}
                  </h3>
                  
                  <p className="text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-300 line-clamp-4 mb-6 flex-1 break-keep font-medium">
                    {article.summary || "본문 요약이 준비되지 않았습니다."}
                  </p>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
                      {article.tags.map(tag => (
                        <span key={tag} className="text-[0.65rem] font-bold text-neutral-500 dark:text-neutral-400 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700">
                          #{tag.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* DEV.to Section */}
        <div className="mt-20 mb-12">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Web Development Insights
            </h2>
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 justify-center flex font-medium">
            실리콘밸리 개발자들이 꼽은 최신 프론트엔드 Article.
          </p>

          <div className="flex flex-col gap-6">
            {devtoArticles.length === 0 ? (
              <p className="text-neutral-500 text-center">수집된 데이터가 없습니다.</p>
            ) : (
              devtoArticles.map((devArticle, idx) => (
                <a
                  key={idx}
                  href={devArticle.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block backdrop-blur-xl bg-white/60 dark:bg-neutral-800/40 p-8 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 border border-white/60 dark:border-white/10"
                >
                  <h3 className="text-2xl font-black mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {devArticle.korean_title}
                  </h3>
                  <p className="text-[0.85rem] text-neutral-400 dark:text-neutral-500 mb-8 font-bold tracking-wide">Original: {devArticle.original_title}</p>

                  <div className="space-y-4">
                    {devArticle.summary.split('\n').filter(Boolean).map((bullet, i) => (
                      <p key={i} className="text-[1.05rem] text-neutral-700 dark:text-neutral-300 leading-relaxed flex items-start font-medium break-keep">
                        <span className="mr-3 text-blue-500 dark:text-blue-400 font-extrabold text-lg leading-none">•</span>
                        <span className="flex-1 mt-[-2px]">{bullet.replace(/^\d+\.\s*/, '')}</span>
                      </p>
                    ))}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 dark:border-white/10 mt-20 py-12 text-center text-neutral-500 dark:text-neutral-400 bg-white/30 dark:bg-black/30 backdrop-blur-md">
        <p className="font-bold">© 2026 NWNEWS. Powered by Automated AI Engine.</p>
        <p className="text-xs mt-2 font-medium tracking-wide border px-3 py-1 rounded-full border-neutral-300 dark:border-neutral-700 inline-block">Zero-Cost Readability + NLP + Free Translate Architecture</p>
      </footer>
    </div>
  );
}
