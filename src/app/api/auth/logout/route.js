import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set("cms_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("cms_user", "", { httpOnly: false, path: "/", maxAge: 0 });
  return res;
}
