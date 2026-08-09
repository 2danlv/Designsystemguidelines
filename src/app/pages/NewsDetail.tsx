import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "../components/LocalizedLink";
import { ArrowLeft, ChevronRight, Tag, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fetchCmsNews, fetchCmsNewsPost, type NewsPost } from "../lib/wordpress";
import { newsDetailPath, sitePath } from "../lib/siteLinks";
import { CmsLoading } from "../components/CmsLoading";
import { useSiteText } from "../context/SiteSettingsContext";

function normalizeNewsText(value = "") {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8211;|&ndash;/gi, "-")
    .replace(/&#8212;|&mdash;/gi, "-")
    .replace(/[.…]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function NewsDetail({ slugOverride }: { slugOverride?: string } = {}) {
  const text = useSiteText();
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = slugOverride || routeSlug;
  const navigate = useNavigate();
  const [cmsArticle, setCmsArticle] = useState<NewsPost | null>(null);
  const [cmsNews, setCmsNews] = useState<NewsPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();

    Promise.all([
      fetchCmsNewsPost(slug, controller.signal),
      fetchCmsNews(controller.signal),
    ]).then(([article, articles]) => {
      if (!controller.signal.aborted) {
        setCmsArticle(article);
        setCmsNews(articles);
        setLoaded(true);
      }
    });

    return () => controller.abort();
  }, [slug]);

  const article = cmsArticle;
  const allArticles = cmsNews;

  if (loaded && !article) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <p className="text-[#002d17]/40 font-bold uppercase tracking-widest text-sm">
          {text("news.not_found")}
        </p>
        <Link to={sitePath("news")} className="flex items-center gap-2 text-[#f4aa1f] font-bold uppercase tracking-widest text-sm hover:text-[#002d17] transition-colors">
          <ArrowLeft size={14} /> {text("news.back")}
        </Link>
      </div>
    );
  }

  if (!loaded) {
    return <CmsLoading />;
  }

  const relatedList = article.related?.length
    ? article.related
    : allArticles
      .filter((item) => item.id !== article.id && (item.categorySlug || item.category) === (article.categorySlug || article.category))
      .slice(0, 3);
  const newsContent = article.content || "";
  const normalizedExcerpt = normalizeNewsText(article.excerpt);
  const normalizedContent = normalizeNewsText(article.content);
  const shouldShowExcerpt = normalizedExcerpt
    && (!normalizedContent || !normalizedContent.startsWith(normalizedExcerpt));

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="bg-[#002d17] pt-8 pb-0">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8 flex-wrap">
            <Link to={sitePath("home")} className="hover:text-[#f4aa1f] transition-colors">{text("common.home")}</Link>
            <ChevronRight size={12} />
            <Link to={sitePath("news")} className="hover:text-[#f4aa1f] transition-colors">{text("common.news")}</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f] line-clamp-1 max-w-xs">{article.category}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            {article.category && (
              <span className="bg-[#f4aa1f] text-[#002d17] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                {article.category}
              </span>
            )}
            <span className="text-white/30 text-xs font-bold uppercase tracking-widest">{article.date}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight leading-tight mb-6 max-w-4xl">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 pb-8 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#46aa85] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {(article.author || "").charAt(0)}
            </div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
              {article.author || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-b-2xl overflow-hidden aspect-[16/8] bg-[#bcd8cb]">
          {article.image && <img src={article.image} alt={article.title} className="w-full h-full object-cover" />}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            {shouldShowExcerpt && (
              <p className="news-article-excerpt">
                {article.excerpt}
              </p>
            )}

            {article.content ? (
              <div
                className="news-article-content flex flex-col gap-5 text-[#002d17]/75 text-base leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: newsContent }}
              />
            ) : null}

            {!!article.tags?.length && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-[#002d17]/10 mt-4">
                <span className="flex items-center gap-1.5 text-[#002d17]/40 text-xs font-bold uppercase tracking-widest">
                  <Tag size={11} /> Tags:
                </span>
                {article.tags.map((tag) => (
                  <span key={tag} className="bg-[#f0faf6] text-[#46aa85] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#002d17]/50 hover:text-[#002d17] font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <ArrowLeft size={14} /> {text("common.back")}
              </button>
            </div>
          </motion.article>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#f9f9f7] rounded-2xl p-6">
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4">{text("news.related")}</p>
              <div className="flex flex-col gap-5">
                {relatedList.map((item) => (
                  <Link key={item.id} to={newsDetailPath(item.slug)} className="group flex gap-3">
                    <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-[#bcd8cb]">
                      {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[#f4aa1f] font-bold text-[10px] uppercase tracking-widest">{item.category}</span>
                      <h4 className="font-bold text-[#002d17] text-xs uppercase leading-snug group-hover:text-[#46aa85] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-[#002d17]/40 text-[10px] font-medium">{item.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#002d17] rounded-2xl p-6">
              <div className="w-8 h-0.5 bg-[#f4aa1f] mb-4" />
              <h4 className="font-bold text-white uppercase tracking-tight mb-2">{text("news.cta_title")}</h4>
              <p className="text-white/50 text-sm font-medium mb-5 leading-relaxed">{text("news.cta_description")}</p>
              <Link
                to={sitePath("jobs")}
                className="flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-4 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors rounded-lg w-fit"
              >
                {text("news.cta_button")} <ArrowRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-[#f9f9f7] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="w-10 h-0.5 bg-[#f4aa1f] mb-3" />
              <h3 className="text-2xl font-bold text-[#002d17] uppercase tracking-tight">{text("news.more")}</h3>
            </div>
            <Link to={sitePath("news")} className="flex items-center gap-2 text-[#002d17]/50 hover:text-[#f4aa1f] font-bold text-xs uppercase tracking-widest transition-colors">
              {text("common.all")} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allArticles.filter((item) => item.id !== article.id).slice(0, 3).map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group flex flex-col"
              >
                <Link to={newsDetailPath(item.slug)} className="flex flex-col gap-0">
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#bcd8cb] rounded-xl">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />}
                    <div className="absolute top-3 left-3 bg-[#d5ede5] text-[#1a6645] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 pt-4 pb-3 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
                    <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">{item.date}</span>
                    <h4 className="font-bold text-[#002d17] text-base uppercase leading-snug tracking-tight group-hover:text-[#46aa85] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">
                      {text("news.read_more")} <ArrowRight size={11} />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

