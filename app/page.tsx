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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">N</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter bg-linear-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              NWNEWS
            </h1>
          </div>
          <nav className="flex space-x-6 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            <a href="#" className="text-blue-600 dark:text-blue-400 relative">
              Tech
              <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></span>
            </a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Global</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Design</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Today's Tech Insights
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            가장 빠르고 정확한 글로벌 IT 이슈. 지금 꼭 알아야 할 핵심 뉴스만 AI가 요약해 드립니다.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 dark:text-neutral-400">아직 뉴스가 수집되지 않았습니다. 잠시 후 다시 확인해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <a 
                key={article.id} 
                href={article.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-neutral-100 dark:border-neutral-700/50"
              >
                {/* 썸네일 방어 코드: next/image의 domain 오류를 피하기 위해 일반 img 태그 사용 */}
                {article.thumbnail ? (
                  <div className="relative w-full h-52 overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.thumbnail} 
                      alt={article.korean_title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-full h-52 bg-linear-to-br from-indigo-50/50 to-blue-50/50 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center p-6 text-center">
                    <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 line-clamp-3">
                      {article.original_title}
                    </span>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-md">
                      {article.category}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {article.source}
                    </span>
                  </div>
                  
                  <h3 className="text-[1.35rem] leading-tight font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.korean_title || article.original_title}
                  </h3>
                  
                  <p className="text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-300 line-clamp-3 mb-5 flex-1">
                    {article.summary || "본문 내용이 없습니다."}
                  </p>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {article.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700/50 px-2.5 py-1 rounded-full">
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
        <div className="mt-28 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm tracking-widest shadow-md">DEV.TO</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Web Development Insights
            </h2>
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mb-8">
            실리콘밸리 개발자들이 꼽은 최신 웹 프론트엔드 트렌드. 가장 핫한 아티클 5개를 요약해 드립니다.
          </p>
          
          <div className="flex flex-col gap-6">
            {devtoArticles.length === 0 ? (
              <p className="text-neutral-500">수집된 데이터가 없습니다.</p>
            ) : (
              devtoArticles.map((devArticle, idx) => (
                <a 
                  key={idx}
                  href={devArticle.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block bg-white dark:bg-neutral-800/80 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-neutral-100 dark:border-neutral-700/50"
                >
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {devArticle.korean_title}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-6 font-medium">Original: {devArticle.original_title}</p>
                  
                  <div className="space-y-3">
                    {devArticle.summary.split('\n').filter(Boolean).map((bullet, i) => (
                      <p key={i} className="text-[1.05rem] text-neutral-700 dark:text-neutral-300 leading-relaxed flex items-start">
                        <span className="mr-3 text-blue-500 dark:text-blue-400 font-bold">•</span>
                        <span className="flex-1">{bullet.replace(/^\d+\.\s*/, '')}</span>
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
      <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-20 py-12 text-center text-neutral-500 dark:text-neutral-400 bg-white/50 dark:bg-black/50">
        <p className="font-medium">© 2026 NWNEWS. Powered by Automated AI Engine.</p>
        <p className="text-sm mt-2">Zero-Cost Readability + NLP + Free Translate Architecture</p>
      </footer>
    </div>
  );
}
