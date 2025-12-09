# Markdown Preview Plus

**Markdown Preview Plus** extends VS Code's built-in Markdown preview to render interactive diagrams including **Markmap** (Mindmaps), **Mermaid** graphs, and **Graphviz** (DOT) diagrams.

- [Markdown Preview Plus](#markdown-preview-plus)
  - [✨ Features](#-features)
  - [💡 Usage](#-usage)
    - [Markmap (Mindmap)](#markmap-mindmap)
    - [Mermaid](#mermaid)
    - [Graphviz (DOT)](#graphviz-dot)
  - [🎨 Customization](#-customization)
    - [Example: Neon Dark Theme (`sample.css`)](#example-neon-dark-theme-samplecss)
  - [License](#license)

## ✨ Features

- **Rich Diagram Support**:
  - **Markmap**: Render Markdown lists as interactive, zoomable mindmaps.
  - **Mermaid**: Render Flowcharts, Sequence diagrams, Gantt charts, etc., with extensive customization.
  - **Graphviz (DOT)**: Render complex graph visualizations using the DOT language (powered by WebAssembly).

- **Interactive Zoom & Pan**:
  - **Smart Scroll**: Scroll naturally past diagrams. Hold **Ctrl** + **Scroll** to zoom into the diagram.
  - **Pan**: Click and drag to pan around large diagrams.
  - **Toolbar**: Dedicated "Reset Zoom" button for easy navigation.

- **Custom Styling**:
  - Fully customizable appearance via CSS variables.
  - Includes a "Cyberpunk / Dark Neon" styling example (see below).

## 💡 Usage

Use standard Markdown code blocks with the appropriate language identifiers: `markmap`, `mermaid`, or `graphviz` (alias `dot`).

### Markmap (Mindmap)

```markdown
    ```markmap
    # Root Topic
    ## Feature A
    ### Detail 1
    ## Feature B
    ```

```

### Mermaid

```markdown
    ```mermaid
    flowchart LR
        A[Start] --> B{Is it working?}
        B -- Yes --> C[Great!]
        B -- No --> D[Debug]
    ```

```

### Graphviz (DOT)

```markdown
    ```graphviz
    digraph G {
      rankdir=LR;
      node [style=filled, color="#11ff84", fontcolor="#000"];
      Start -> Process -> End;
      Process -> Start [style=dashed, label="Loop"];
    }
    ```

```

## 🎨 Customization

You can customize the look and feel of your diagrams by creating a `style.css` file in your workspace root or by configuring `markdown.styles` in your VS Code settings.

### Example: Neon Dark Theme (`sample.css`)

Below is a comprehensive style sheet that creates a high-contrast Neon/Cyberpunk look for your preview and diagrams.

```css
/*//////////////////////////////////////////////*/
/* mermaid and other diagrams */
/*//////////////////////////////////////////////*/

/*
  Theme Variables Override (Mermaid v10+)
  Mermaid uses CSS variables for theming.
*/
:root {
  /* Colors - User Requirements */
  --mermaid-primary-color: #272b2b;       /* Dark Background for nodes */
  --mermaid-secondary-color: #171b19;     /* Alternative dark background */

  --mermaid-border-color: #11ff84;        /* Green Borders */
  --mermaid-text-color: #fd9bcc;          /* Pink Text */
  --mermaid-secondtext-color:#46d2e8;     /* Cyan Text */

  --mermaid-line-color: #ff0080;          /* Dark Pink Lines/Arrows */
  --mermaid-arrow-color: #ff0080;         /* Dark Pink Arrows */

  --mermaid-font-family: "Fira Code", "Shippori Mincho", monospace;

  /* Markmap Colors */
  --markmap-circle-fill: #11ff84;
  --markmap-circle-stroke: #11ff84;
  --markmap-body-text-color: #fd9bcc;
  --markmap-text-color: #fd9bcc;
  --markmap-link-color: #46d2e8;
  --markmap-line-color: #ff0080;
  --markmap-line-width: 4px;
  --markmap-font-family: "Fira Code", "Shippori Mincho", monospace;
}


/*
  ========================================
  Flowchart (graph)
  ========================================
*/

/* Nodes (Rectangles, Circles, Rhombus) */
.mermaid .node rect,
.mermaid .node circle,
.mermaid .node ellipse,
.mermaid .node polygon,
.mermaid .node path,
.mermaid g.node rect,
.mermaid g.node circle,
.mermaid g.node polygon {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
  stroke-width: 2px !important;
}

/* Node Text (Label) */
.mermaid .node .label,
.mermaid .nodeLabel,
.mermaid .label {
  color: var(--mermaid-text-color) !important;
  fill: var(--mermaid-text-color) !important;
  font-family: var(--mermaid-font-family);
}
/* Handle foreignObject text */
.mermaid .node .label foreignObject div,
.mermaid .nodeLabel foreignObject div,
.mermaid .label foreignObject div,
.mermaid span.nodeLabel {
  color: var(--mermaid-text-color) !important;
}


/* Edges (Lines connecting nodes) */
.mermaid .edgePath .path,
.mermaid .flowchart-link {
  stroke: var(--mermaid-line-color) !important;
  stroke-width: 2px !important;
  fill: none !important;
}

/* Arrowheads */
.mermaid .marker {
  fill: var(--mermaid-arrow-color) !important;
  stroke: var(--mermaid-arrow-color) !important;
}
.mermaid marker path {
  fill: var(--mermaid-arrow-color) !important;
  stroke: var(--mermaid-arrow-color) !important;
}

/* Edge Labels */
.mermaid .edgeLabel,
.mermaid .edgeLabel rect {
  background-color: #000000 !important;
  fill: #000000 !important;
}

/* Sequence Diagram Adjustments */
.mermaid g.actor,
.mermaid rect.actor {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
}
.mermaid text.actor > tspan,
.mermaid tspan {
  fill: var(--mermaid-text-color) !important;
}
.mermaid line {
  stroke: var(--mermaid-line-color) !important;
}
.mermaid .messageText {
  fill: var(--mermaid-text-color) !important;
  stroke: none !important;
}
.mermaid .note {
  fill: #222 !important;
  stroke: var(--mermaid-border-color) !important;
}
.mermaid .noteText {
  fill: #fff !important;
}
.mermaid .loopText,
.mermaid .loopText > tspan {
  fill: #fff !important;
}
.mermaid .loopLine {
  stroke: var(--mermaid-border-color) !important;
}

/* Markmap Styling */
.markmap-node {
  color: var(--markmap-text-color) !important;
  fill: var(--markmap-circle-fill) !important;
}
.markmap-link,
.markmap svg > g > path {
  stroke-opacity: 1 !important;
  fill: none !important;
}
.markmap-node text {
  fill: var(--markmap-text-color) !important;
}
.markmap-node foreignObject {
  color: var(--markmap-circle-fill) !important;
  font-family: var(--markmap-font-family) !important;
  line-height: 1.2;
}
.markmap-node foreignObject .markmap-body-text {
  font-weight: normal;
  font-size: 0.9em;
  color: var(--markmap-body-text-color) !important;
  display: inline-block;
}
.markmap-node foreignObject strong,
.markmap-node foreignObject em,
.markmap-node foreignObject b,
.markmap-node foreignObject i {
  color: #FF14E0 !important;
}
.markmap-node a {
  color: var(--markmap-link-color) !important;
}

/* Code Fences */
code,
pre {
  color: #fd9bcc !important;
  background-color: #202020 !important;
}
```

## License

MIT
