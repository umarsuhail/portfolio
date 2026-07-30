import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IMAGE_IDS = new Set([
  "14OGmc7nJnmWoquibXGaqGK3ptysOXZdS",
  "1kylUcEamTmVpKMSYqQKfumE0ltw1aTaN",
  "1XsGsobPvZ9XznP9vEg3smCt2dRZtGbMC",
  "1HJYI3RVuh-Crl4hI2rgb8bmOJ6NxXYtv",
  "1OpvPWtMmpjy1fEGWtwCfkD4sR1D6a_Dn",
]);

export async function GET(request: NextRequest) {
  const imageId = request.nextUrl.searchParams.get("id");

  if (!imageId || !ALLOWED_IMAGE_IDS.has(imageId)) {
    return NextResponse.json({ error: "Unknown image." }, { status: 404 });
  }

  const imageResponse = await fetch(
    `https://drive.usercontent.google.com/download?id=${imageId}&export=download&confirm=t`,
    { next: { revalidate: 60 * 60 * 24 } }
  );

  if (!imageResponse.ok) {
    return NextResponse.json({ error: "Unable to load image." }, { status: 502 });
  }

  return new NextResponse(imageResponse.body, {
    headers: {
      "Content-Type": imageResponse.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}