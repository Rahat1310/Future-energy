import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateTag("products", "max");
  revalidateTag("categories", "max");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}