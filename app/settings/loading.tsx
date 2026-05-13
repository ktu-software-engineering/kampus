export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-kk-blue/15 rounded-lg w-48" />
      <div className="h-4 bg-kk-blue/8 rounded w-72" />
      <div className="space-y-4 max-w-lg pt-4">
        {[1,2,3].map(i => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 bg-kk-blue/10 rounded w-24" />
            <div className="h-11 bg-[#f5f1ea] rounded-xl border border-[#e8e2d9]" />
          </div>
        ))}
      </div>
    </div>
  );
}
