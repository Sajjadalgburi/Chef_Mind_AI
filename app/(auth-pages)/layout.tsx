export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content">{children}</div>
    </div>
  );
}
