import Link from "next/link";
import Image from "next/image";
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
          className="mb-8 inline-block lg:hidden"
          aria-label="Future Energy BD"
        >
          <Image
            src="/images/logo-transparent.png"
            alt="Future Energy BD"
            width={160}
            height={80}
            className="h-9 w-auto object-contain"
            priority
          />
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
            <Image
              src="/images/logo-transparent.png"
              alt="Future Energy BD"
              width={180}
              height={90}
              className="h-12 w-auto object-contain"
              priority
            />
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
