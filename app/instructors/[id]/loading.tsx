import { BackgroundTexture } from "@/components/layout/BackgroundTexture";

export default function InstructorLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-kk-beige relative overflow-x-hidden font-sans">
      <BackgroundTexture />
      <main className="flex-grow relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Üst kart */}
        <div className="mb-12 bg-[rgba(255,253,248,0.72)] rounded-2xl p-8 md:p-12 border border-white/80 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-kk-blue/15 shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-8 bg-kk-blue/15 rounded-xl w-2/3" />
              <div className="h-5 bg-kk-blue/8 rounded-lg w-1/3" />
            </div>
            <div className="flex gap-4">
              <div className="w-28 h-20 bg-kk-blue/15 rounded-xl" />
              <div className="w-28 h-20 bg-kk-blue/8 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sol */}
          <div className="space-y-8">
            <div className="bg-white/60 rounded-xl p-6 border border-white/40 animate-pulse space-y-4">
              <div className="h-5 bg-kk-blue/15 rounded-lg w-1/2" />
              {[1,2,3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-kk-blue/8 rounded w-1/3" />
                    <div className="h-3 bg-kk-blue/15 rounded w-1/6" />
                  </div>
                  <div className="h-2.5 bg-kk-blue/10 rounded-full w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — yorumlar */}
          <div className="lg:col-span-2 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white/60 rounded-2xl p-6 border border-white/40 animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-kk-blue/15 rounded-lg w-1/3" />
                  <div className="h-6 bg-kk-gold/20 rounded-xl w-16" />
                </div>
                <div className="h-3 bg-kk-blue/8 rounded w-full" />
                <div className="h-3 bg-kk-blue/8 rounded w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
