export default function Loading() {
  return (
    <div className="grid min-h-[100svh] place-items-center bg-carbon-black text-surface-warm">
      <div className="w-[min(80vw,420px)]">
        <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
          Shitian Aviation
        </p>
        <div className="mt-7 h-px overflow-hidden bg-surface-warm/12">
          <div className="loading-bar h-full w-1/3 bg-aviation-orange" />
        </div>
        <p className="mt-7 text-sm tracking-[0.04em] text-surface-warm/55">
          正在加载低空作业内容 · Loading
        </p>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          60% { transform: translateX(220%); }
          100% { transform: translateX(220%); }
        }
        .loading-bar {
          animation: loading-bar 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
      `}</style>
    </div>
  );
}
