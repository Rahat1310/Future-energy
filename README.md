This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Link previews (WhatsApp / Messenger)

Social preview defaults live in `src/lib/social-metadata.ts`. The homepage uses
`public/og-image.png` (1200 × 630); product links use their catalog photo when
available, and category links use the branded image. URLs point to
`https://futureenergybd.com` and are rendered by the Next.js Metadata API.

Deploy these changes to Vercel before testing the public link. Check the
deployed HTML for `og:title`, `og:description`, `og:url`, and `og:image`, and
verify the image URL opens without signing in. Use Meta’s Sharing Debugger
(https://developers.facebook.com/tools/debug/) to inspect or refresh Meta’s
cached preview, then paste the link into a new WhatsApp or Messenger message.
Previously sent messages may retain an older preview; the apps control the
final card layout and caching.
