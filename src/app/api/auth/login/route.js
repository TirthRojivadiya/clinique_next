import { NextResponse } from "next/server";

const baseUrl = process.env.CMS_API_URL || "https://cmsback.sampaarsh.cloud";

export async function POST(req) {
  const body = await req.json();

  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = { error: text };
  }

  if (!res.ok) {
    return NextResponse.json(data || { error: "Login failed" }, { status: res.status });
  }

  const response = NextResponse.json(data, { status: 200 });
  response.cookies.set("cms_token", data?.token || "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  response.cookies.set("cms_user", JSON.stringify(data?.user || {}), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
