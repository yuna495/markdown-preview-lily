import { Graphviz } from "@hpcc-js/wasm";
import { select } from 'd3-selection';
import { createToolbar, createToolbarButton, applyContainerStyles, setupD3Zoom, preventEventPropagation } from './utils.js';

const renderGraphviz = async () => {
  const blocks = document.querySelectorAll('pre code.language-graphviz, pre code.language-dot');

  for (const block of blocks) {
    const pre = block.parentElement;
    if (pre.dataset.graphvizRendered) continue;
    pre.dataset.graphvizRendered = 'true';

    let raw = block.textContent.trim();

    const container = document.createElement('div');
    container.classList.add('graphviz-container');
    container.classList.add('graphviz');

    applyContainerStyles(container);
    container.style.position = 'relative';
    container.style.height = '600px';

    pre.replaceWith(container);

    try {
      const graphviz = await Graphviz.load();
      const svgContent = graphviz.layout(raw, "svg", "dot");
      container.innerHTML = svgContent;

      const svgEl = container.querySelector('svg');
      if (svgEl) {
        svgEl.removeAttribute('width');
        svgEl.removeAttribute('height');
        svgEl.removeAttribute('style');
        svgEl.removeAttribute('viewBox'); // We will let D3 manage transform, but maybe we need bbox?

        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        svgEl.style.display = 'block';

        // Wrap contents in a zoom layer group
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('zoom-layer');
        while (svgEl.firstChild) {
          g.appendChild(svgEl.firstChild);
        }
        svgEl.appendChild(g);

        const d3Svg = select(svgEl);
        const d3G = select(g);

        // Get BBox for initial zoom calculation
        const bBox = g.getBBox();
        const { zoomBehavior, initialTransform } = setupD3Zoom(d3Svg, d3G, container, bBox);

        // Toolbar
        const toolbar = createToolbar(container);
        const btnReset = createToolbarButton('⟲', () => {
          d3Svg.transition().call(zoomBehavior.transform, initialTransform);
        }, 'Reset Zoom');
        toolbar.appendChild(btnReset);

        preventEventPropagation(container);
      }

    } catch (err) {
      console.error('Graphviz render error:', err);
      container.innerHTML = `<pre style="color:red;padding:10px;">Graphviz Error: ${err.message}</pre>`;
    }
  }
};

renderGraphviz();
const observer = new MutationObserver(renderGraphviz);
observer.observe(document.body, { childList: true, subtree: true });
