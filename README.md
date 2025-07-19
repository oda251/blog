## 概要
- 私用Webアプリ
- Twitterライクなブログ機能
- 随時機能追加します
## 使用技術
- 主なフレームワーク・ライブラリ
  - Astro
  - React
    - react-window
    - react-redux
    - redux-thunk
  - TailwindCSS
- インフラ
  - CochroachDB
  - Vercel
## ディレクトリ構成（概要）
```
.
├── app/                             // Astroアプリ
│   └── src/
│       ├── components/
│       │   ├── TweetApp/            // TwitterライクなReactアプリを分離
│       │   │   ├── repository/      // クライアントからサーバへのDB操作要求
│       │   │   ├── slice/
│       │   │   ├── store/
│       │   │   ├── thunk/
│       │   │   └── etc
│       │   └── etc
│       ├── entities/                // バリデータ等、DB操作を伴わない重要なロジック等（現在、未整理のファイルを含んでいます）
│       ├── pages/
│       ├── repository/              // サーバ側でのDB操作
│       └── types/
└── db/init/                         // DDL等、DB初期化に必要な情報
```
## URL
## Local Development with Docker (Bun)

You can use Docker Compose to run the Bun development server locally.

### How to Start

```sh
docker-compose up app
```

- This will build the Docker image and start the development server using Bun inside the `app` container.

### Live Reload

- Source code changes in the `app/` directory are automatically reflected in the running container thanks to the volume mount (`./app:/app`).
- No need to rebuild or restart the container for most code changes.

### Ports

- The app is available at [http://localhost:3000](http://localhost:3000).
- Port `3000` on your machine is mapped to port `3000` in the container.

### Tips & Caveats

- Ensure any required environment variables are set in your `.env` file or configured in `docker-compose.yml`.
- If you add new dependencies, you may need to rebuild the container:  
  ```sh
  docker-compose build app
  ```
- File system events may not propagate correctly on some platforms (e.g., Docker Desktop on Windows); if live reload does not work, restart the container.
- The database runs in a separate container (`db`), accessible at `localhost:5432` if needed.

https://myblog-one-opal.vercel.app/jp/
