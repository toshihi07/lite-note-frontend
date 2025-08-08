const BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY;

if (!BASE_URL) {
  throw new Error(
    "❌ API Gateway の URL が設定されていません。env ファイルを確認してください。"
  );
}

// ✅ ジェネリクス型を追加
export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  const token = localStorage.getItem("id_token");
  if (!token) throw new Error("未ログインです。");

  // ✅ endpoint が絶対URLならそのまま使用
  const url = endpoint.startsWith("http")
    ? endpoint
    : endpoint.startsWith("/")
    ? `${BASE_URL}${endpoint}`
    : `${BASE_URL}/${endpoint}`;

  console.log(`➡️ API Request: ${method} ${url}`);

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ API Error ${res.status}: ${errText}`);
    throw new Error(`APIエラー: ${res.status} - ${errText}`);
  }

  return res.json() as Promise<T>;
}
