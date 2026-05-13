import { BackgroundTexture } from "@/components/layout/BackgroundTexture";

function SkeletonCard() {
  return (
    <div className="bg-white/70 rounded-2xl p-5 border border-[#e8e2d9] animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-kk-blue/10 mb-3" />
      <div className="h-3 bg-kk-blue/10 rounded w-1/3 mb-1" />
      <div className="h-4 bg-kk-blue/10 rounded-lg w-3/4 mb-2" />
      <div className="h-3 bg-kk-blue/5 rounded w-2/3 mb-4" />
      <div className="border-t border-[#f0ede6] pt-3 space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="flex justify-between">
            <div className="h-3 bg-kk-blue/5 rounded w-1/3" />
            <div className="h-3 bg-kk-blue/10 rounded w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DerslerLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-kk-beige relative overflow-x-hidden font-sans">
      <BackgroundTexture />
      <main className="flex-grow relative z-10 pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="h-9 bg-kk-blue/15 rounded-xl w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-kk-blue/8 rounded-lg w-32 animate-pulse" />
        </div>
        <div className="flex gap-3 mb-6">
          <div className="h-10 bg-white/70 rounded-xl w-48 animate-pulse border border-[#e8e2d9]" />
          <div className="h-10 bg-white/70 rounded-xl w-40 animate-pulse border border-[#e8e2d9] ml-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </main>
    </div>
  );
}
