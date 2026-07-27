import Link from "next/link";
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
    <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-1 flex-col lg:flex-row">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-16 lg:w-1/2 lg:px-8">
        <Link
          href="/"
          className="mb-8 font-display text-2xl font-bold tracking-tight text-ink lg:hidden"
        >
          Future Energy <span className="text-brand">BD</span>
        </Link>
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Join the green energy revolution.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Create an account to get personalized quotes, access bulk pricing, and 
            expert advice on solar and battery solutions.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 text-left">
            <div>
              <p className="font-display text-xl font-semibold text-brand">24/7</p>
              <p className="mt-1 text-sm text-white/60">Expert Support</p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-brand">Free</p>
              <p className="mt-1 text-sm text-white/60">Energy Consultation</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
