(() => {
  // src/markmap.js
  var { Markmap, Transformer, deriveOptions } = window.markmap;
  var { Toolbar } = window.markmap.toolbar;
  var transformer = new Transformer();
  function renderMarkmaps() {
    const markmapElements = document.querySelectorAll("pre code.language-markmap");
    markmapElements.forEach((el) => {
      const preElement = el.parentElement;
      if (preElement.dataset.markmapRendered) {
        return;
      }
      preElement.dataset.markmapRendered = "true";
      const markdown = el.textContent;
      const { root, features } = transformer.transform(markdown);
      const container = document.createElement("div");
      container.style.height = "300px";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const toolbar = document.createElement("div");
      container.append(svg, toolbar);
      preElement.replaceWith(container);
      const mm = Markmap.create(svg, void 0, root);
      Toolbar.create(mm, toolbar);
    });
  }
  renderMarkmaps();
  var observer = new MutationObserver(renderMarkmaps);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
