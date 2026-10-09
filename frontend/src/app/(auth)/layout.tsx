export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:45px_45px]" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-primary/15 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}