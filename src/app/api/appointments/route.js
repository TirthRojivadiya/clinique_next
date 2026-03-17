import { forwardApi, sendJson } from "@/lib/server-api";

export async function POST(req) {
  const body = await req.json();
  const { res, data } = await forwardApi({
    method: "POST",
    path: "/appointments",
    body,
  });
  return sendJson(res, data);
}
