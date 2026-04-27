import { youtubeDemoVideoId } from "@/lib/routes";

export default function Overview() {
  return (
    <section id="overview" className="section-spacing">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5">
              See MAIA in action
            </h2>
            <p className="text-muted leading-relaxed">
              MAIA turns field dictation into structured ePCR reports with built-in QA and billing-ready output. Medics capture the run by voice; AI compiles and checks it so your team spends less time on paperwork and more on patient care. See how it works in the demo below.
            </p>
          </div>
          <div className="aspect-video rounded-xl border border-border bg-surface overflow-hidden">
            {youtubeDemoVideoId ? (
              <iframe
                suppressHydrationWarning
                title="MAIA demo video"
                src={`https://www.youtube.com/embed/${youtubeDemoVideoId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm text-muted font-medium">
                  Set NEXT_PUBLIC_YOUTUBE_DEMO_VIDEO_ID in .env.local or youtubeDemoVideoId in src/lib/routes.ts
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
