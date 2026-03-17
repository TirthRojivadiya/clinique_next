import { forwardApi, sendJson } from "@/lib/server-api";

export async function GET() {
  const { res, data } = await forwardApi({ method: "GET", path: "/admin/users" });
  return sendJson(res, data);
}

export async function POST(req) {
  const body = await req.json();
  const { res, data } = await forwardApi({
    method: "POST",
    path: "/admin/users",
    body,
  });
  return sendJson(res, data);
}
