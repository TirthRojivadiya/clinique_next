import { forwardApi, sendJson } from "@/lib/server-api";

export async function GET() {
  const { res, data } = await forwardApi({ method: "GET", path: "/doctor/queue" });
  return sendJson(res, data);
}
