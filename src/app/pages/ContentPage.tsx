import { useEffect, useState } from "react";
import { fetchCmsPage } from "../lib/wordpress";

type GenericCmsPage = {
  title?: string;
  content?: string;
};

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <section className="bg-[#002d17] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
          <p className="text-[#f4aa1f] text-xs font-bold uppercase tracking-widest mb-4">Tona Corporation</p>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight">{title}</h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 md:py-20">
        {children}
      </section>
    </div>
  );
}

export function GenericContentPage({
  slug,
  initialPage,
}: {
  slug: string;
  initialPage?: GenericCmsPage;
}) {
  const [page, setPage] = useState<GenericCmsPage | null>(initialPage || null);

  useEffect(() => {
    if (initialPage?.content) {
      setPage(initialPage);
      return;
    }

    const controller = new AbortController();

    fetchCmsPage<GenericCmsPage>(slug, controller.signal).then(setPage);

    return () => controller.abort();
  }, [initialPage, slug]);

  return (
    <PageShell title={page?.title || "Tona Corporation"}>
      <article
        className="prose prose-lg max-w-none prose-headings:text-[#002d17] prose-a:text-[#46aa85]"
        dangerouslySetInnerHTML={{ __html: page?.content || "" }}
      />
    </PageShell>
  );
}
