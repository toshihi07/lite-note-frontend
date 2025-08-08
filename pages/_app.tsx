import type { AppProps } from "next/app";
import "../globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="font-sans">
      <Component {...pageProps} />
    </div>
  );
}
