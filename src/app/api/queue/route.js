import { forwardApi, sendJson } from "@/lib/server-api";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const { res, data } = await forwardApi({
    method: "GET",
    path: "/queue",
    query: { date },
  });
  return sendJson(res, data);
}
