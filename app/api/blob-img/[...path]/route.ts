import { get } from "@vercel/blob";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathname = path.join("/");

  const ifNoneMatch = req.headers.get("if-none-match") ?? undefined;

  const result = await get(pathname, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    ifNoneMatch,
  });

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  if (result.statusCode === 304) {
    return new Response(null, {
      status: 304,
      headers: { etag: ifNoneMatch ?? "" },
    });
  }

  const headers: Record<string, string> = {
    "cache-control": "public, max-age=31536000, immutable",
  };
  if (result.blob.contentType) headers["content-type"] = result.blob.contentType;
  if (result.blob.etag) headers.etag = result.blob.etag;

  return new Response(result.stream, { status: 200, headers });
}
