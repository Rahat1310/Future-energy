/**
 * Studio gets a bare layout so site chrome (and future storefront wrappers)
 * do not wrap the CMS UI.
 */
export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-white">{children}</div>
  );
}