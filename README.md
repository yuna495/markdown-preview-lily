# Markdown Enhanced Visualizer README

Markdown Enhanced Visualizer は、VS Codeの標準Markdownプレビューを拡張し、複雑な構造化された情報を視覚的に表現する機能を追加します。

## ✨ Features

* **Markmap (マインドマップ) 描画**: Markdownの階層構造をインタラクティブなマインドマップとしてプレビューします。
* **カスタムレンダリング**: Markmapの描画エリアを**600pxの高さ**に固定し、視認性を高めます。
* **Zoom/Fit機能**: ホイール操作で拡大/縮小。"Reset"ボタンで初期化。

## 💡 Usage

Markmapを描画したいMarkdownブロックで、言語識別子として `markmap` を使用してください。

```markdown
```markmap
# Root Topic
## Feature A
### Detail 1
## Feature B
