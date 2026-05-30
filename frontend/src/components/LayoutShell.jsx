export default function LayoutShell({ children }) {
  return (
    <div className="app-shell">
      <div className="app-shell__grid" aria-hidden="true" />
      <div className="app-shell__glow app-shell__glow--left" aria-hidden="true" />
      <div className="app-shell__glow app-shell__glow--right" aria-hidden="true" />
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
