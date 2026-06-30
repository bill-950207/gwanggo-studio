export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black tracking-tight shadow-sm"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.5) }}
    >
      G
    </div>
  )
}
