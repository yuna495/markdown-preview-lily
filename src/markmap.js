// src/markmap.js
// Markmapライブラリを直接インポートし、グローバル (window.markmap) に依存しない
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';

// Transformerのインスタンスを1つ作成し、再利用
const transformer = new Transformer();

/**
 * Markdownの本文（パラグラフ）をリストアイテムに変換してMarkmapに表示させる
 */
function processMarkdown(markdown) {
  const lines = markdown.split('\n');
  let newLines = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // コードブロックの判定
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      newLines.push(line);
      continue;
    }

    if (inCodeBlock) {
      newLines.push(line);
      continue;
    }

    // 空行はそのまま
    if (trimmed === '') {
      newLines.push(line);
      continue;
    }

    // ヘッダー、リストアイテム、引用などはそのまま
    if (trimmed.startsWith('#') || trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('>')) {
      newLines.push(line);
      continue;
    }

    // それ以外（本文パラグラフ）はリストアイテムに変換
    // スタイルを適用するためにspanで囲む
    newLines.push(`- <span class="markmap-body-text" style="font-weight:normal; font-size:0.9em; color:#555;">${line}</span>`);
  }

  return newLines.join('\n');
}

/**
 * Markmapをレンダリングする関数
 */
function renderMarkmaps() {
  const markmapElements = document.querySelectorAll('pre code.language-markmap');

  markmapElements.forEach((el) => {
    const preElement = el.parentElement;
    if (preElement.dataset.markmapRendered) {
      return;
    }
    preElement.dataset.markmapRendered = 'true';

    const rawMarkdown = el.textContent;
    // 本文を表示できるように加工
    const markdown = processMarkdown(rawMarkdown);

    // インポートした Transformer を直接使用
    const { root } = transformer.transform(markdown);

    // コンテナの準備
    const container = document.createElement('div');
    // 高さを指定。プレビューでスクロールできるように大きめに設定
    // 高さを指定。プレビューでスクロールできるように大きめに設定
    container.style.height = '400px';
    container.style.position = 'relative'; // ツールバーの位置調整のために追加

    // 描画幅を広げる（全幅にする）
    container.style.width = '100vw';
    container.style.maxWidth = '100vw';
    container.style.marginLeft = '50%';
    container.style.transform = 'translateX(-50%)';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%'; // SVGも全幅に

    const toolbar = document.createElement('div');
    // ツールバーの位置調整
    toolbar.style.position = 'absolute';
    toolbar.style.right = '20px'; // 画面端から少し余裕を持たせる
    toolbar.style.bottom = '20px'; // 下部に配置変更（お好みで。上だと既存ツールバーと被るかも？）
    // markmap-toolbarはデフォルトで右下にでる？ いや、前回右上に自分で配置してた。
    // 今回は右上に統一するが、カスタムボタンもそこに入れる。
    toolbar.style.top = '20px';
    toolbar.style.bottom = 'auto';
    toolbar.style.padding = '0';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px'; // ボタン間の隙間

    container.append(svg, toolbar);

    // 元の<pre>要素をコンテナで置き換え
    preElement.replaceWith(container);

    // Markmapを描画
    // インポートした Markmap を直接使用
    const mm = Markmap.create(svg, undefined, root);

    // ツールバーを有効化
    Toolbar.create(mm, toolbar);

    // リセットボタンを追加
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Zoom';
    resetButton.type = 'button';
    resetButton.style.zIndex = '999';
    resetButton.style.cursor = 'pointer';
    resetButton.onclick = () => {
      mm.fit();
    };
    toolbar.appendChild(resetButton);

    // 初回レンダリング後に高さを調整
    // requestAnimationFrameを使って描画完了を待つ（念のため）
    requestAnimationFrame(() => {
        mm.fit().then(() => {
            const state = mm.state;
            if (state && state.minY !== undefined && state.maxY !== undefined) {
                const naturalHeight = state.maxY - state.minY;
                // 余白を少し追加 (paddingY * 2 程度 + ツールバー分)
                const newHeight = naturalHeight + 40 + 20;
                // 最小の高さは維持 (400px)
                if (newHeight > 400) {
                     container.style.height = `${newHeight}px`;
                     // 高さを変えたので再度fitさせる
                     mm.fit();
                }
            }
        });
    });
  });
}

// 初期レンダリング
renderMarkmaps();

// DOMの変更を監視して再レンダリング
const observer = new MutationObserver(renderMarkmaps);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
