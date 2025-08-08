// lib/auth.ts
function base64URLEncode(arrayBuffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(hash);
}

export async function redirectToCognitoLoginPKCE() {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

  // PKCE: code_verifierを生成（43〜128文字のランダム文字列）
  const codeVerifier = [...crypto.getRandomValues(new Uint8Array(64))]
    .map(b => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[b % 62])
    .join("");

  // localStorageに保存（後で/token交換で使用）
  localStorage.setItem("pkce_verifier", codeVerifier);

  const codeChallenge = await sha256(codeVerifier);

  const loginUrl = `https://${domain}/login?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  window.location.href = loginUrl;
}

export async function exchangeCodeForToken(code: string) {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
  const codeVerifier = localStorage.getItem("pkce_verifier")!;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const res = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const responseText = await res.text();

  console.log("🔍 Token Exchange Raw Response:", responseText);

  if (!res.ok) {
    // 失敗時だけエラーを投げる
    throw new Error("Token exchange failed: " + responseText);
  }

  return JSON.parse(responseText);
}