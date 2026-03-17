import { forwardApi, sendJson } from "@/lib/server-api";

export async function GET() {
  const { res, data } = await forwardApi({ method: "GET", path: "/reports/my" });
  return sendJson(res, data);
}
