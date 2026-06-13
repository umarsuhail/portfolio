import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const VALID_TAGS = ["projects", "skills", "experience"] as const;
type ValidTag = (typeof VALID_TAGS)[number];

// POST /api/revalidate?tag=projects&secret=<REVALIDATE_SECRET>
// Purges the "use cache" tagged entries for a specific data set.
// The `profile` matches the cacheLife() name used in src/app/lib/data.ts ("weeks").
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  const tag = req.nextUrl.searchParams.get("tag") as ValidTag | null;
  // Profile must match the cacheLife() value used when the data was cached
  const profile = req.nextUrl.searchParams.get("profile") ?? "weeks";

  if (tag && VALID_TAGS.includes(tag)) {
    revalidateTag(tag, profile);
    return NextResponse.json({ revalidated: true, tag, profile });
  }

  // No tag — flush every tagged set
  VALID_TAGS.forEach((t) => revalidateTag(t, profile));
  return NextResponse.json({ revalidated: true, tag: "all", profile });
}
