# cat-left-paw.github.io

猫乃 左手 / Cat Left Paw の公開プロジェクト紹介サイト（GitHub Pages 用）。

ビルド不要の静的 HTML / CSS です。`main` ブランチを GitHub Pages の公開元にすると、そのまま公開できます。

## サイト構成

| パス | ファイル | 内容 |
|------|----------|------|
| `/` | `index.html` | トップページ |
| `/nyoze/` | `nyoze/index.html` | Nyoze 紹介 |
| `/tategaki/` | `tategaki/index.html` | Tategaki 紹介 |
| `/story-player/` | `story-player/index.html` | Story Player 紹介（準備中） |
| 共通 CSS | `styles.css` | 全ページ共通スタイル |
| 画像 | `assets/` | スクリーンショットなど |

## ローカルで確認する

リポジトリのルートで簡易 HTTP サーバーを起動します。

```bash
# Python 3
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開いてください。

## ページの更新方法

### 文言・特徴リストの変更

各プロジェクトページ（例: `nyoze/index.html`）をテキストエディタで編集します。

- `<!-- UPDATE: ... -->` コメント付きのブロックが、あとから差し替えやすい箇所です
- Nyoze は今後の機能追加・仕様変更が多い想定のため、`<section>` 単位で区切ってあります
- 英語の短い説明は `<span class="en">` に入れています

### リンクの差し替え

各ページの「リンク」セクション（`link-grid`）を編集します。

| ラベル | 用途 |
|--------|------|
| GitHub | 公開リポジトリ |
| Store | Microsoft Store / Obsidian Community Plugins など |
| Docs | マニュアルや README へのリンク |
| Screenshots | 同一ページ内の `#screenshots` へのアンカー |

**Microsoft Store リンク（Nyoze）**  
`nyoze/index.html` 内の `<!-- UPDATE: store -->` 付近の `href="#"` を、実際の Store URL に差し替えてください。

**Story Player**  
公開準備ができたら、`story-player/index.html` の無効化されたリンク（`is-disabled`）を通常の `<a class="link-card">` に置き換えてください。

### 共通デザインの変更

`styles.css` を編集します。色や余白は `:root` の CSS 変数でまとめています。

## スクリーンショットの差し替え方法

1. 画像ファイル（PNG や WebP 推奨）を `assets/` に置く  
   例: `assets/nyoze-writing.png`
2. 該当ページの `<img src="...">` のパスを更新する  
   例: `src="/assets/nyoze-writing.png"`
3. `alt` 属性と `<figcaption>` を、画面の内容に合わせて更新する
4. 不要になったプレースホルダー（`assets/placeholder.svg`）は残しておいても構いません

画像は横長（16:10 前後）を想定しています。大きすぎるファイルは表示前に軽量化してください。

## GitHub Pages の公開設定

1. リポジトリの **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `/ (root)`

数分後、`https://cat-left-paw.github.io/` で公開されます。

## ファイルを追加するとき

- 新しいプロジェクトページは `プロジェクト名/index.html` として追加
- トップページと各ページのナビゲーション（`site-nav`）にリンクを追加
- 外部ライブラリは使わず、`styles.css` のみでスタイルを揃える
