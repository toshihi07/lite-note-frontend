import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { exchangeCodeForToken } from "../lib/auth";

export default function Callback() {
  const router = useRouter();
  const executed = useRef(false); // これで二重実行防止

  useEffect(() => {
    if (executed.current) return;
    executed.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      exchangeCodeForToken(code)
        .then(tokens => {
          localStorage.setItem("access_token", tokens.access_token);
          localStorage.setItem("id_token", tokens.id_token);
          localStorage.setItem("refresh_token", tokens.refresh_token);
          router.replace("/"); // トップページに戻す
        })
        .catch(err => console.error("Token exchange failed:", err));
    }
  }, [router]);

  return <p>ログイン処理中...</p>;
}
