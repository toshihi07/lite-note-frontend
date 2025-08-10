// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // ★ これで "build" だけで out/ ができる
  images: { unoptimized: true }, // next/image を静的出力で使うなら推奨
  trailingSlash: true,       // S3/CloudFrontと相性◎（/todos/ → todos/index.html）
};

module.exports = nextConfig;
