import { forwardApi, sendJson } from "@/lib/server-api";

export async function GET(req, { params }) {
  const routeParams = await params;
  const { res, data } = await forwardApi({
    method: "GET",
    path: `/appointments/${routeParams.id}`,
  });
  return sendJson(res, data);
}
