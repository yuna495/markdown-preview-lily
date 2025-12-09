import mermaid from 'mermaid';
import { select } from 'd3-selection';
import { createToolbar, createToolbarButton, applyContainerStyles, setupD3Zoom, preventEventPropagation } from './utils.js';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'base',
  gantt: {
    todayMarker: false
  }
});

const renderMermaid = async () => {
  // Helper to extract theme from class list
  const extractTheme = (element) => {
      if (!element) return null;
      for (const cls of element.classList) {
          if (cls.startsWith('theme-')) {
              return cls.replace('theme-', '');
          }
      }
      return null;
  };

  // 1. Get Global Config (Class-based)
  const configDiv = document.getElementById('mpp-config');
  const globalTheme = extractTheme(configDiv) || 'pinklily';

  if (configDiv) {
      console.log(`[MPP Render] Found global config (class-based). Theme: ${globalTheme}`);
  } else {
      console.log('[MPP Render] No global config found. Defaulting to pinklily.');
  }

  const wrappers = document.querySelectorAll('.mpp-mermaid-wrapper');
  const nakedBlocks = document.querySelectorAll('pre code.language-mermaid');

  // Process wrappers
  for (const wrapper of wrappers) {
     if (wrapper.dataset.mermaidRendered) continue;
     wrapper.dataset.mermaidRendered = 'true';

     const theme = extractTheme(wrapper) || globalTheme;
     const block = wrapper.querySelector('code');
     if (!block) continue;

     await processBlock(block, theme, wrapper);
  }

  // Process naked blocks (Fallback)
  for (const block of nakedBlocks) {
      const pre = block.parentElement;
      if (pre.closest('.mpp-mermaid-wrapper')) continue;

      if (pre.dataset.mermaidRendered) continue;
      pre.dataset.mermaidRendered = 'true';

      await processBlock(block, globalTheme, pre);
  }
};

async function processBlock(block, themeStr, replaceTarget) {
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let raw = block.textContent.trim();

    // Construct Directive based on themeStr
    const isPinkLily = (themeStr === 'pinklily');
    const internalTheme = isPinkLily ? 'base' : themeStr;
    const directive = `%%{init: { "theme": "${internalTheme}", "gantt": { "todayMarker": false } } }%%\n`;

    if (!raw.includes('%%{init:')) {
        raw = directive + raw;
        // console.log(`[MPP Render] Injected directive for theme: ${themeStr}`);
    }

    console.log('[MPP Render] Processing block:', id);

    const container = document.createElement('div');
    container.classList.add('mermaid-container');
    container.classList.add('mermaid');

    if (isPinkLily) {
        container.classList.add('mpp-theme-pinklily');
    }

    applyContainerStyles(container);
    container.style.position = 'relative';
    container.style.height = '600px';

    replaceTarget.replaceWith(container);

    try {
      if (await mermaid.parse(raw)) {
        const { svg } = await mermaid.render(id, raw);
        container.innerHTML = svg;

        const todayMarkers = container.querySelectorAll('.today');
        todayMarkers.forEach(el => el.remove());

        const svgEl = container.querySelector('svg');
        if (svgEl) {
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.removeAttribute('style');
          svgEl.removeAttribute('viewBox');

          svgEl.style.width = '100%';
          svgEl.style.height = '100%';
          svgEl.style.display = 'block';
          svgEl.style.pointerEvents = 'all';

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.classList.add('zoom-layer');
          while (svgEl.firstChild) {
            g.appendChild(svgEl.firstChild);
          }
          svgEl.appendChild(g);

          const d3Svg = select(svgEl);
          const d3G = select(g);

          const bBox = g.getBBox();
          const { zoomBehavior, initialTransform } = setupD3Zoom(d3Svg, d3G, container, bBox);

          const toolbar = createToolbar(container);
          const btnReset = createToolbarButton('⟲', () => {
            d3Svg.transition().call(zoomBehavior.transform, initialTransform);
          }, 'Reset Zoom');
          toolbar.appendChild(btnReset);

          preventEventPropagation(container);
        }
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = `<pre style="color:red;padding:10px;">${err.message}</pre>`;
    }
}

renderMermaid();
const observer = new MutationObserver(renderMermaid);
observer.observe(document.body, { childList: true, subtree: true });
