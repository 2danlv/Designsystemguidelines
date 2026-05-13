import { useState } from "react";
import { news } from "../data";
import { Link } from "react-router";
import { ArrowRight, ChevronRight, Clock, Search } from "lucide-react";
import { motion } from "motion/react";

const categories = ["Tất Cả", "Dự Án", "Đối Tác", "Giải Thưởng", "Sự Kiện", "Chứng Nhận"];

export function News() {
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [searchQ, setSearchQ] = useState("");

  const filtered = news.filter((n) => {
    const matchCat = activeCategory === "Tất Cả" || n.category === activeCategory;
    const matchSearch = n.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = news.find((n) => n.featured);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">Tin Tức</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-4">
            Tin Tức<br />&amp; Sự Kiện
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl">
            Cập nhật mới nhất về dự án, đối tác và các hoạt động nổi bật của Tona Corporation.
          </p>
        </div>
      </div>

      {/* FEATURED ARTICLE */}
      {featured && (
        <div className="bg-[#f9f9f7] border-b border-[#002d17]/10">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">Tin Nổi Bật</p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image */}
              <Link to={`/vi/news/${featured.slug}`} className="lg:col-span-7 relative overflow-hidden aspect-[16/9] bg-[#bcd8cb] group cursor-pointer rounded-2xl block">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-2xl"
                />
                <div className="absolute top-4 left-4 bg-[#f4aa1f] text-[#002d17] px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
                  {featured.category}
                </div>
              </Link>
              {/* Content */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#46aa85] font-bold text-xs uppercase tracking-widest">{featured.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[#002d17]/30" />
                  <span className="flex items-center gap-1 text-[#002d17]/40 font-bold text-xs uppercase tracking-widest">
                    <Clock size={11} /> {featured.readTime} đọc
                  </span>
                </div>
                <h2 className="font-extrabold text-[#002d17] text-2xl md:text-3xl uppercase leading-snug tracking-tight">
                  {featured.title}
                </h2>
                <div className="w-12 h-0.5 bg-[#f4aa1f]" />
                <p className="text-[#002d17]/60 text-sm leading-relaxed font-medium">
                  {featured.excerpt}
                </p>
                <Link
                  to={`/vi/news/${featured.slug}`}
                  className="mt-2 flex items-center gap-2 bg-[#002d17] text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#f4aa1f] hover:text-[#002d17] transition-colors w-fit rounded-lg"
                >
                  Đọc Tiếp <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS + SEARCH */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-[#002d17]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 font-bold uppercase tracking-widest text-xs transition-colors rounded-full ${
                  activeCategory === cat
                    ? "bg-[#002d17] text-white"
                    : "border border-[#002d17]/20 text-[#002d17]/60 hover:border-[#002d17] hover:text-[#002d17]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#002d17]/30" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-[#002d17]/20 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#f4aa1f] bg-white placeholder:text-[#002d17]/30 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* ARTICLE GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#002d17]/40 font-bold uppercase tracking-widest text-sm">Không tìm thấy bài viết phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="group flex flex-col"
              >
                <Link to={`/vi/news/${item.slug}`} className="flex flex-col gap-0">
                  {/* Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#bcd8cb] rounded-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Category */}
                    <div className="absolute top-3 left-3 bg-[#d5ede5] text-[#1a6645] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {item.category}
                    </div>
                    {item.featured && (
                      <div className="absolute bottom-3 left-3 bg-[#f4aa1f] text-[#002d17] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Nổi Bật
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-3 pt-5 pb-4 flex-1 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">{item.date}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-[#002d17]/20" />
                      <span className="flex items-center gap-1 text-[#002d17]/40 text-xs font-bold uppercase tracking-wider">
                        <Clock size={10} /> {item.readTime}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-[#002d17] text-lg uppercase leading-snug tracking-tight group-hover:text-[#46aa85] transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-[#002d17]/55 text-sm leading-relaxed font-medium line-clamp-3 flex-1">
                      {item.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">
                      Đọc tiếp <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="mt-16 flex justify-center">
            <button className="border-2 border-[#002d17] text-[#002d17] px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-white transition-colors rounded-xl">
              Xem Thêm Tin Tức
            </button>
          </div>
        )}
      </div>

      {/* NEWSLETTER / FOLLOW CTA */}
      <div className="bg-[#002d17] py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
              Nhận Tin Tức Mới Nhất
            </h3>
            <p className="text-white/50 mt-2 text-sm">Theo dõi Tona để cập nhật dự án và hoạt động mới nhất.</p>
          </div>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Email của bạn"
              className="px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-sm font-medium focus:outline-none focus:border-[#f4aa1f] w-56 rounded-lg"
            />
            <button className="bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors whitespace-nowrap rounded-lg">
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
