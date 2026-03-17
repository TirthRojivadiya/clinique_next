import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("cms_user")?.value;

  if (!raw) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const user = JSON.parse(raw);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Bad user data" }, { status: 400 });
  }
}
