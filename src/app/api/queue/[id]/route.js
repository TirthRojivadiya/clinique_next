import { forwardApi, sendJson } from "@/lib/server-api";

export async function PATCH(req, { params }) {
  const body = await req.json();
  const routeParams = await params;
  const { res, data } = await forwardApi({
    method: "PATCH",
    path: `/queue/${routeParams.id}`,
    body,
  });
  return sendJson(res, data);
}
