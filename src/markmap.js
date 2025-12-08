import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';

// Transformerのインスタンスを1つ作成し、再利用します (Create and reuse a single Transformer instance)
const transformer = new Transformer();

/**
 * Markmapをレンダリングする関数 (Function to render Markmaps)
 */
function renderMarkmaps() {
  // 'language-markmap'クラスを持つcode要素をすべて取得
  const markmapElements = document.querySelectorAll('pre code.language-markmap');

  markmapElements.forEach((el) => {
    const preElement = el.parentElement;
    // 既に処理済みの場合はスキップ (Skip if already rendered)
    if (preElement.dataset.markmapRendered) {
      return;
    }
    preElement.dataset.markmapRendered = 'true';

    const markdown = el.textContent;
    const { root, features } = transformer.transform(markdown);

    // SVGとツールバーを配置するコンテナを作成 (Create a container for the SVG and toolbar)
    const container = document.createElement('div');
    container.style.height = '300px'; // 高さを指定 (Set height)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const toolbar = document.createElement('div');

    container.append(svg, toolbar);

    // 元の<pre>要素をコンテナで置き換える (Replace the original <pre> element with the container)
    preElement.replaceWith(container);

    // MarkmapをSVGに描画 (Render the Markmap to the SVG)
    const mm = Markmap.create(svg, undefined, root);

    // ツールバーを有効化 (Enable the toolbar)
    Toolbar.create(mm, toolbar);
  });
}

// 初期レンダリング
renderMarkmaps();

// VSCodeのプレビューは動的に更新されることがあるため、 (Because the VSCode preview can be updated dynamically,)
// DOMの変更を監視して再レンダリングする (observe DOM changes and re-render)
const observer = new MutationObserver(renderMarkmaps);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
