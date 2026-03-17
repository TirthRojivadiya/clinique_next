import { forwardApi, sendJson } from "@/lib/server-api";

export async function POST(req, { params }) {
  const body = await req.json();
  const routeParams = await params;
  const { res, data } = await forwardApi({
    method: "POST",
    path: `/prescriptions/${routeParams.appointmentId}`,
    body,
  });
  return sendJson(res, data);
}
