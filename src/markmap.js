// src/markmap.js
// Markmapライブラリを直接インポートし、グローバル (window.markmap) に依存しない
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';

// Transformerのインスタンスを1つ作成し、再利用
const transformer = new Transformer();

/**
 * Markdownの本文（パラグラフ）を見出しに結合して "Heading: Body" の形式にする
 */
function processMarkdown(markdown) {
  const lines = markdown.split('\n');
  let newLines = [];
  let inCodeBlock = false;
  let lastHeaderIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // コードブロックの判定
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      // コードブロックは見出しには結合せず、そのまま出す
      newLines.push(line);
      lastHeaderIndex = -1;
      continue;
    }

    if (inCodeBlock) {
      newLines.push(line);
      continue;
    }

    // 空行は無視
    if (trimmed === '') {
      newLines.push(line);
      continue;
    }

    // ヘッダーの場合
    if (trimmed.startsWith('#')) {
      newLines.push(line);
      lastHeaderIndex = newLines.length - 1;
      continue;
    }

    // リストアイテム、引用などは独立させる
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('>') || /^\d+\. /.test(trimmed)) {
      newLines.push(line);
      lastHeaderIndex = -1;
      continue;
    }

    // それ以外（本文パラグラフ）
    if (lastHeaderIndex !== -1) {
      // 直前の見出しに結合する
      const currentHeader = newLines[lastHeaderIndex];
      newLines[lastHeaderIndex] = `${currentHeader}<br/><span class="markmap-body-text" style="font-weight:normal; font-size:0.9em; color:#ddd;">${trimmed}</span>`;
    } else {
      // 見出しがない状態での本文
      newLines.push(`- <span class="markmap-body-text" style="font-weight:normal; font-size:0.9em; color:#ddd;">${trimmed}</span>`);
    }
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
    container.style.height = '400px';
    container.style.position = 'relative'; // ツールバーの位置調整のために追加

    // 描画幅を広げる（全幅にする）
    container.style.width = '100vw';
    container.style.maxWidth = '100vw';
    container.style.marginLeft = '50%';
    container.style.transform = 'translateX(-50%)';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%'; // SVGも全幅に

    // SVG内のテキスト色を明るくするスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
      .markmap-node text {
        fill: #ffffff !important;
      }
      .markmap-body-text {
        fill: #cccccc !important;
      }
    `;
    svg.append(style);

    const toolbar = document.createElement('div');
    // ツールバーの位置調整
    toolbar.style.position = 'absolute';
    toolbar.style.right = '20px'; // 画面端から少し余裕を持たせる
    toolbar.style.bottom = '20px'; // 下部に配置変更（お好みで。上だと既存ツールバーと被るかも？）
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

    // 初回レンダリング後に高さを調整 (BBox使用)
    requestAnimationFrame(async () => {
        await mm.fit();
        // 描画完了を少し待つ必要があるかも
        // mm.g は d3 selection
        const gElement = mm.g.node();
        if (gElement) {
            const bbox = gElement.getBBox();
            if (bbox && bbox.height) {
                // 上下の余白 + ツールバー分
                const newHeight = bbox.height + 60;
                if (newHeight > 400) {
                     container.style.height = `${newHeight}px`;
                     await mm.fit();
                }
            }
        }
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
