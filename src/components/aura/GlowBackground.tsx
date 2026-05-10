export function GlowBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="glow-orb absolute -top-40 -right-20 h-[500px] w-[500px] opacity-60" />
      <div className="glow-orb absolute top-1/2 -left-32 h-[400px] w-[400px] opacity-40" />
      <div className="glow-orb absolute bottom-0 right-1/3 h-[350px] w-[350px] opacity-30" />
    </div>
  );
}
