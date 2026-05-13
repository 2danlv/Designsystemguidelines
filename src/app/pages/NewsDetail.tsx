import { useParams, Link, useNavigate } from "react-router";
import { news, NewsBodyBlock } from "../data";
import { ArrowLeft, ChevronRight, Clock, Tag, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

function BodyBlock({ block }: { block: NewsBodyBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-[#002d17]/75 text-base leading-relaxed font-medium">
        {block.text}
      </p>
    );
  }
  if (block.type === "heading") {
    return (
      <h2 className="text-[#002d17] text-xl font-extrabold uppercase tracking-tight mt-4 mb-1 flex items-center gap-3">
        <span className="w-5 h-0.5 bg-[#f4aa1f] shrink-0" />
        {block.text}
      </h2>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="my-2 bg-[#f0faf6] border-l-4 border-[#46aa85] rounded-r-xl px-6 py-5">
        <p className="text-[#002d17] font-semibold italic text-base leading-relaxed">
          "{block.text}"
        </p>
        <cite className="block mt-3 text-[#46aa85] font-bold text-xs uppercase tracking-widest not-italic">
          — {block.author}
        </cite>
      </blockquote>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="flex flex-col gap-2.5 my-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[#002d17]/75 text-base font-medium">
            <span className="mt-2 w-2 h-2 rounded-full bg-[#f4aa1f] shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "image") {
    return (
      <figure className="my-2">
        <div className="rounded-xl overflow-hidden aspect-[16/9] bg-[#bcd8cb]">
          <img src={block.src} alt={block.caption ?? ""} className="w-full h-full object-cover" />
        </div>
        {block.caption && (
          <figcaption className="text-center text-[#002d17]/40 text-xs font-medium mt-2">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  return null;
}

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = news.find((n) => n.slug === slug);

  if (!article) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <p className="text-[#002d17]/40 font-bold uppercase tracking-widest text-sm">
          Không tìm thấy bài viết.
        </p>
        <Link to="/vi/news" className="flex items-center gap-2 text-[#f4aa1f] font-bold uppercase tracking-widest text-sm hover:text-[#002d17] transition-colors">
          <ArrowLeft size={14} /> Quay lại Tin Tức
        </Link>
      </div>
    );
  }

  const related = news.filter((n) => n.id !== article.id && n.category === article.category).slice(0, 3);
  const moreRelated = related.length < 2
    ? news.filter((n) => n.id !== article.id).slice(0, 3 - related.length)
    : [];
  const relatedList = [...related, ...moreRelated].slice(0, 3);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-0">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8 flex-wrap">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/vi/news" className="hover:text-[#f4aa1f] transition-colors">Tin Tức</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f] line-clamp-1 max-w-xs">{article.category}</span>
          </div>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-[#f4aa1f] text-[#002d17] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-white/40 text-xs font-bold uppercase tracking-widest">
              <Clock size={11} /> {article.readTime} đọc
            </span>
            <span className="text-white/30 text-xs font-bold uppercase tracking-widest">{article.date}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight mb-6 max-w-4xl">
            {article.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 pb-8 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#46aa85] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {(article as any).author?.charAt(0) ?? "T"}
            </div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{(article as any).author ?? "Ban Biên Tập Tona"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* HERO IMAGE */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-b-2xl overflow-hidden aspect-[16/8] bg-[#bcd8cb]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ARTICLE BODY */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            {/* Excerpt lead */}
            <p className="text-[#002d17] text-lg font-semibold leading-relaxed border-l-4 border-[#f4aa1f] pl-5 bg-[#fffdf5] rounded-r-xl py-4">
              {article.excerpt}
            </p>

            {/* Body blocks */}
            <div className="flex flex-col gap-5">
              {(article as any).body?.map((block: NewsBodyBlock, i: number) => (
                <BodyBlock key={i} block={block} />
              ))}
            </div>

            {/* Tags */}
            {(article as any).tags && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-[#002d17]/10 mt-4">
                <span className="flex items-center gap-1.5 text-[#002d17]/40 text-xs font-bold uppercase tracking-widest">
                  <Tag size={11} /> Tags:
                </span>
                {(article as any).tags.map((tag: string) => (
                  <span key={tag} className="bg-[#f0faf6] text-[#46aa85] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Back nav */}
            <div className="pt-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#002d17]/50 hover:text-[#002d17] font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <ArrowLeft size={14} /> Quay lại
              </button>
            </div>
          </motion.article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Related articles */}
            <div className="bg-[#f9f9f7] rounded-2xl p-6">
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4">Bài Viết Liên Quan</p>
              <div className="flex flex-col gap-5">
                {relatedList.map((item) => (
                  <Link
                    key={item.id}
                    to={`/vi/news/${item.slug}`}
                    className="group flex gap-3"
                  >
                    <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-[#bcd8cb]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[#f4aa1f] font-bold text-[10px] uppercase tracking-widest">{item.category}</span>
                      <h4 className="font-extrabold text-[#002d17] text-xs uppercase leading-snug group-hover:text-[#46aa85] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-[#002d17]/40 text-[10px] font-medium">{item.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[#002d17] rounded-2xl p-6">
              <div className="w-8 h-0.5 bg-[#f4aa1f] mb-4" />
              <h4 className="font-extrabold text-white uppercase tracking-tight mb-2">Dự Án Của Bạn?</h4>
              <p className="text-white/50 text-sm font-medium mb-5 leading-relaxed">Liên hệ Tona ngay hôm nay để được tư vấn miễn phí.</p>
              <Link
                to="/vi/nghe-nghiep"
                className="flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-4 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors rounded-lg w-fit"
              >
                Liên Hệ <ArrowRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* MORE NEWS */}
      <div className="bg-[#f9f9f7] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="w-10 h-0.5 bg-[#f4aa1f] mb-3" />
              <h3 className="text-2xl font-extrabold text-[#002d17] uppercase tracking-tight">Tin Tức Khác</h3>
            </div>
            <Link to="/vi/news" className="flex items-center gap-2 text-[#002d17]/50 hover:text-[#f4aa1f] font-bold text-xs uppercase tracking-widest transition-colors">
              Tất Cả <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.filter((n) => n.id !== article.id).slice(0, 3).map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group flex flex-col"
              >
                <Link to={`/vi/news/${item.slug}`} className="flex flex-col gap-0">
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#bcd8cb] rounded-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#d5ede5] text-[#1a6645] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 pt-4 pb-3 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
                    <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">{item.date}</span>
                    <h4 className="font-extrabold text-[#002d17] text-base uppercase leading-snug tracking-tight group-hover:text-[#46aa85] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">
                      Đọc tiếp <ArrowRight size={11} />
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
