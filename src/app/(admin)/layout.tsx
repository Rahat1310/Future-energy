export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex-1 bg-neutral-100 text-neutral-900">
      {children}
    </div>
  );
}
