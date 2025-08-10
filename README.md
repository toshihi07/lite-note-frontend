npx create-next-app@latest lite-note-frontend

root@UBUNTU:~/projects/litenote/lite-note-frontend# node -v
v20.19.2
root@UBUNTU:~/projects/litenote/lite-note-frontend# npx next --version
Next.js v15.3.4
root@UBUNTU:~/projects/litenote/lite-note-frontend# npm -v
10.8.2
root@UBUNTU:~/projects/litenote/lite-note-frontend#

✅ 4. ローカルサーバーを起動
npm run dev
http://localhost:3000

✅ 6. ビルドして確認したい場合
npm run build
npm run start

# LiteNote Frontend

LiteNote Frontend は、AWS サーバーレス環境（Cognito + API Gateway + Lambda + DynamoDB）と連携して動作する **ToDo 管理アプリケーション** です。  
Notion 風の UI をベースに、ブラウザからログイン、ToDo の追加・編集・削除が可能です。

---

## 📌 アプリの役割

- **ユーザー認証**: AWS Cognito (PKCE) を利用したログイン/ログアウト
- **API 連携**: API Gateway + Lambda 経由で DynamoDB にデータを保存・取得
- **UI/UX**: Next.js + Tailwind CSS によるモダンな UI
- **本番配信**: S3 に静的ファイルをホスティングし、CloudFront + WAF 経由で配信

---

## 📂 主なディレクトリ・ファイル構成

frontend/
├── pages/
│ ├── index.tsx # トップページ（ログイン、ToDo 一覧）
│ ├── todos.tsx # ToDo 一覧・追加・編集・削除
│ └── \_app.tsx # グローバル設定
├── lib/
│ ├── api.ts # API 呼び出し共通関数（apiRequest）
│ └── auth.ts # Cognito 認証（PKCE）関連関数
├── public/ # 静的ファイル
├── styles/ # グローバル CSS や Tailwind 設定
├── package.json # 依存パッケージ管理
├── tsconfig.json # TypeScript 設定
└── .env.local # 環境変数ファイル（ローカル開発用）

`.env.local`（ローカル開発用）
NEXT_PUBLIC_API_GATEWAY=https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev
NEXT_PUBLIC_COGNITO_DOMAIN=https://your-cognito-domain.auth.ap-northeast-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REDIRECT_URI=http://localhost:3000

本番環境（S3/CloudFront）では、`.env.production` を使用してビルドします。

---

## 🚀 起動方法

### 1. ローカル開発

````bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev

## 🚀 起動方法

### 1. ローカル開発
```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev
http://localhost:3000 にアクセスするとアプリが動作します。

npm run build
npm run start

npm run build && npm run export

☁️ 本番デプロイ（GitHub Actions + S3）
GitHub リポジトリにソースを push

.github/workflows/deploy-frontend.yml がトリガーされ、自動で以下を実行

Next.js ビルド & 静的エクスポート

S3 同期アップロード

CloudFront キャッシュ無効化

数分後、CloudFront 経由で新しいUIが反映されます




my-next-app/
├─ .next/         ← build 時の中間ファイル
├─ out/           ← ← 静的サイトの完成形（これをS3等にアップ）
│   ├─ index.html
│   ├─ todos/index.html
│   ├─ _next/…
│   └─ その他ページごとのHTML/CSS/JS
├─ pages/
├─ package.json
└─ next.config.js