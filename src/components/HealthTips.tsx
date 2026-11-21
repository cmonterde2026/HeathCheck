import { useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { HEALTH_TIPS_ARTICLES } from '../data/healthData';
import { TipCategory } from '../types/health';
import { MedicalDisclaimer } from './MedicalDisclaimer';

const TIP_CATEGORIES: Array<'All' | TipCategory> = [
  'All',
  'Healthy Eating',
  'Hydration',
  'Exercise',
  'Sleep',
  'Personal Wellness',
];

export function HealthTips() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | TipCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(HEALTH_TIPS_ARTICLES[0].id);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return HEALTH_TIPS_ARTICLES.filter((article) => {
      const matchesCat =
        selectedCategory === 'All' || article.category === selectedCategory;
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <section className="rounded-xl border border-[#DCE7E0] bg-white p-5 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0D3B2B]">
              Practical Wellness Guides
            </h2>
            <p className="text-sm text-[#4A6559]">
              Everyday guidance on nutrition, hydration, physical movement, sleep, and preventive wellness.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B776A]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search health topics..."
              aria-label="Search health topics"
              className="w-full rounded-lg border border-[#CFE0D6] bg-white py-2 pl-9 pr-3 text-sm text-[#10261D] placeholder:text-[#789286] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Health tip categories">
          {TIP_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#0D3B2B] text-white'
                    : 'bg-[#F0F7F3] text-[#2F4E3F] hover:bg-[#DFEFE6]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-[#DCE7E0] bg-white p-8 text-center text-sm text-[#4A6559]">
          No health tips matched your search. Try selecting "All" or clearing your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredArticles.map((article) => {
            const isExpanded = expandedId === article.id;
            const showFallback = !article.imageUrl || failedImages[article.id];
            return (
              <article
                key={article.id}
                className="flex flex-col overflow-hidden rounded-xl border border-[#DCE7E0] bg-white"
              >
                {article.imageUrl && (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-[#E8F4ED]">
                    {!showFallback ? (
                      <img
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [article.id]: true }))
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D3B2B] to-[#1A6349] text-white">
                        <BookOpen className="h-8 w-8 text-[#A7F3D0]" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#4A6559]">
                      <span>{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#0D3B2B]">
                      {article.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#385447]">{article.summary}</p>

                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-semibold text-[#0D3B2B]">Key Daily Practices</p>
                      <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-[#2F4E3F]">
                        {article.keyPractices.map((practice) => (
                          <li key={practice}>{practice}</li>
                        ))}
                      </ul>
                    </div>

                    {isExpanded && (
                      <div className="rounded-lg border border-[#E2ECE6] bg-[#F7FBF9] p-4 text-sm leading-relaxed text-[#2F4E3F]">
                        {article.guidanceDetails}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#EDF3EF]">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : article.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16734D] hover:text-[#0D3B2B]"
                    >
                      <span>{isExpanded ? 'Show less' : 'Read full guidance'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <MedicalDisclaimer
        title="General Wellness Information"
        body="These lifestyle guidelines reflect general adult public-health recommendations. Individual nutritional, fluid, exercise, and sleep needs vary—especially if you have chronic health conditions, are pregnant, or take regular medications."
      />
    </div>
  );
}
