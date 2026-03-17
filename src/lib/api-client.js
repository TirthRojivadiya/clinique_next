export async function apiGet(path, query) {
  const url = new URL(path, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export async function apiPatch(path, body) {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

async function safeJson(res) {
  const text = await res.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return { error: text };
  }
}
