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
│       │   ├── TweetApp/            // TwitterライクなReactアプリを分離/
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
https://myblog-one-opal.vercel.app/jp/
