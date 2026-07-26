import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

type PageProps = {
  searchParams: Promise<{ redirect_url?: string }>;
};

function safeRedirect(url: string | undefined) {
  if (!url || !url.startsWith("/") || url.startsWith("//")) {
    return "/";
  }
  return url;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const { redirect_url } = await searchParams;
  const redirectUrl = safeRedirect(redirect_url);

  return (
    <main className="relative z-10 flex flex-1 items-center justify-center bg-transparent px-4 py-16">
      <SignUp
        appearance={clerkAppearance}
        signInUrl={
          redirectUrl === "/"
            ? "/sign-in"
            : `/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`
        }
        forceRedirectUrl={redirectUrl}
        fallbackRedirectUrl={redirectUrl}
      />
    </main>
  );
}
