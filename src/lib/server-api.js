import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const baseUrl = process.env.CMS_API_URL || "https://cmsback.sampaarsh.cloud";

export async function forwardApi({ method, path, body, query }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_token")?.value;
  const url = new URL(path, baseUrl);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = text;
  }

  return { res, data };
}

export function sendJson(res, data) {
  if (data === null || data === undefined) {
    return new NextResponse(null, { status: res.status });
  }
  if (typeof data === "string") {
    return new NextResponse(data, { status: res.status });
  }
  return NextResponse.json(data, { status: res.status });
}
