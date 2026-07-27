import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
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

export default async function SignInPage({ searchParams }: PageProps) {
  const { redirect_url } = await searchParams;
  const redirectUrl = safeRedirect(redirect_url);

  return (
    <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-1 flex-col lg:flex-row">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-16 lg:w-1/2 lg:px-8">
        <Link
          href="/"
          className="mb-8 font-display text-2xl font-bold tracking-tight text-ink lg:hidden"
        >
          Future Energy <span className="text-brand">BD</span>
        </Link>
        <SignIn
          appearance={clerkAppearance}
          signUpUrl={
            redirectUrl === "/"
              ? "/sign-up"
              : `/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`
          }
          forceRedirectUrl={redirectUrl}
          fallbackRedirectUrl={redirectUrl}
        />
      </div>

      {/* Right Side: Visual */}
      <div className="hidden w-1/2 items-center justify-center overflow-hidden bg-ink/95 px-10 text-white lg:flex">
        <div className="relative z-10 max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/20 text-brand">
              <svg
                className="size-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Welcome back to the future of energy.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Sign in to track your quotes, manage your past orders, and access
            exclusive green energy deals.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 text-left">
            <div>
              <p className="font-display text-xl font-semibold text-brand">500+</p>
              <p className="mt-1 text-sm text-white/60">Projects Powered</p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-brand">100%</p>
              <p className="mt-1 text-sm text-white/60">Green Energy</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
