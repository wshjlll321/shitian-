type ThreeFallbackProps = {
  label: string;
};

export function ThreeFallback({ label }: ThreeFallbackProps) {
  return (
    <div className="flex min-h-[320px] items-end rounded-none bg-gradient-to-br from-carbon-black via-carbon-graphite to-aviation-green p-6 text-surface-warm">
      <div>
        <p className="text-sm text-surface-warm/56">移动端 / 低性能设备降级画面</p>
        <p className="mt-2 text-xl font-semibold">{label}</p>
      </div>
    </div>
  );
}
