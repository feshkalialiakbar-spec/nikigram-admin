import { NextRequest, NextResponse } from "next/server";
import { buildDocDownloadUrl, hasDocBaseUrl } from "@/utils/docUrl";

// Helper to normalize incoming url/id to a full upstream URL
function buildUpstreamUrl(rawUrl: string): string {
  if (!hasDocBaseUrl()) {
    throw new Error("Missing NEXT_PUBLIC_DOCUMENT_URL_URL env");
  }
  const resolved = buildDocDownloadUrl(rawUrl);
  if (!/^https?:\/\//i.test(resolved)) {
    throw new Error("Failed to build document download URL");
  }
  return resolved;
}

// Proxy download endpoint to bypass CORS and always force attachment download
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get("url") || ""; // may be absolute or a uid/path
    const fileName = searchParams.get("filename") || undefined; // optional suggested name

    if (!rawUrl) {
      return NextResponse.json({ message: "Missing 'url' query param" }, { status: 400 });
    }

    const fullUrl = buildUpstreamUrl(rawUrl);

    // Forward relevant auth headers (Authorization and Cookie) if present
    const incomingAuth = request.headers.get("authorization") || undefined;
    const incomingCookie = request.headers.get("cookie") || undefined;

    const upstream = await fetch(fullUrl, {
      method: "GET",
      headers: {
        ...(incomingAuth ? { Authorization: incomingAuth } : {}),
        ...(incomingCookie ? { Cookie: incomingCookie } : {}),
        Accept: "application/octet-stream",
      },
      // Do not cache downloads
      cache: "no-store",
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        { message: "Upstream error", status: upstream.status, body: text },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const upstreamDisposition = upstream.headers.get("content-disposition") || undefined;

    // Decide filename: prefer upstream header filename value if present, but always force attachment
    let safeName = (fileName || "download").replace(/[\r\n"']/g, "");
    if (upstreamDisposition && /filename/i.test(upstreamDisposition)) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(upstreamDisposition);
      const headerName = decodeURIComponent(match?.[1] || match?.[2] || "").trim();
      if (headerName) {
        safeName = headerName.replace(/[\r\n"']/g, "");
      }
    }

    // Stream body directly back to client with forced attachment
    const body = upstream.body; // ReadableStream
    const res = new Response(body, {
      status: 200,
      headers: {
        "content-type": contentType,
        // Always force attachment to prevent inline rendering
        "content-disposition": `attachment; filename="${safeName}"`,
        // Avoid caching downloads
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });

    return res;
  } catch (error) {
    return NextResponse.json({ message: "Proxy error", error: String(error) }, { status: 500 });
  }
}

// POST variant for programmatic downloads (body kept off the address bar)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawUrl: string = body.url || "";
    const fileName: string | undefined = body.filename || undefined;
    if (!rawUrl) {
      return NextResponse.json({ message: "Missing 'url' in body" }, { status: 400 });
    }

    const fullUrl = buildUpstreamUrl(rawUrl);

    const incomingAuth = request.headers.get("authorization") || undefined;
    const incomingCookie = request.headers.get("cookie") || undefined;

    const upstream = await fetch(fullUrl, {
      method: "GET",
      headers: {
        ...(incomingAuth ? { Authorization: incomingAuth } : {}),
        ...(incomingCookie ? { Cookie: incomingCookie } : {}),
        Accept: "application/octet-stream",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        { message: "Upstream error", status: upstream.status, body: text },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const upstreamDisposition = upstream.headers.get("content-disposition") || undefined;

    let safeName = (fileName || "download").replace(/[\r\n"']/g, "");
    if (upstreamDisposition && /filename/i.test(upstreamDisposition)) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(upstreamDisposition);
      const headerName = decodeURIComponent(match?.[1] || match?.[2] || "").trim();
      if (headerName) {
        safeName = headerName.replace(/[\r\n"']/g, "");
      }
    }

    const response = new Response(upstream.body, {
      status: 200,
      headers: {
        "content-type": contentType,
        "content-disposition": `attachment; filename="${safeName}"`,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Proxy error", error: String(error) }, { status: 500 });
  }
}


