import type { NextConfig } from "next";

/**
 * CSP allows Clerk (incl. custom domain), Vercel Analytics, Cloudflare
 * Turnstile (Clerk bot protection), Cloudinary hero media, and self.
 * Upstash + Brevo + Neon are server-only and do not need CSP entries.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://clerk.futureenergybd.com",
    "https://challenges.cloudflare.com",
    "https://va.vercel-scripts.com",
  ].join(" "),
  [
    "connect-src",
    "'self'",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://clerk.futureenergybd.com",
    "https://clerk-telemetry.com",
    "https://*.clerk.services",
    "https://challenges.cloudflare.com",
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
    "https://res.cloudinary.com",
  ].join(" "),
  [
    "img-src",
    "'self'",
    "data:",
    "blob:",
    "https://*.clerk.com",
    "https://img.clerk.com",
    "https://res.cloudinary.com",
  ].join(" "),
  ["media-src", "'self'", "blob:", "https://res.cloudinary.com"].join(" "),
  [
    "style-src",
    "'self'",
    "'unsafe-inline'",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
  ].join(" "),
  ["font-src", "'self'", "data:"].join(" "),
  [
    "frame-src",
    "'self'",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://clerk.futureenergybd.com",
    "https://challenges.cloudflare.com",
  ].join(" "),
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
