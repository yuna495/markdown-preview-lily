const vscode = require('vscode');

module.exports = function mermaidThemePlugin(md) {
    // We can't easily access the global output channel here unless we export it or pass it.
    // For now, console.log should still go to Debug Console if debugging, but the user is running production.
    // We'll trust the logic if it works.

    // 1. Inject Global Configuration via Core Ruler (Class-Based)
    md.core.ruler.push('mpp_config_injector', function (state) {
        try {
            const config = vscode.workspace.getConfiguration('markdown-preview-plus');
            const theme = config.get('mermaidTheme', 'pinklily');

            // Generate a sanitizer-safe HTML block
            // standard markdown sanitizer usually allows DIVs and Classes.
            const token = new state.Token('html_block', '', 0);
            token.content = `<div id="mpp-config" class="mpp-settings theme-${theme}" style="display:none"></div>`;

            state.tokens.unshift(token);
        } catch (e) {
            console.error(e);
        }
    });

    // 2. Fence Logic (Wrappers)
    const originalFence = md.renderer.rules.fence;
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const info = token.info ? token.info.trim() : '';

        if (info === 'mermaid') {
            try {
                const config = vscode.workspace.getConfiguration('markdown-preview-plus');
                const theme = config.get('mermaidTheme', 'pinklily');

                const rawContent = token.content;
                const escapedContent = md.utils.escapeHtml(rawContent);

                // Use class-based data for wrappers too, just in case
                return `<div class="mpp-mermaid-wrapper theme-${theme}">
                            <pre><code class="language-mermaid">${escapedContent}</code></pre>
                        </div>`;
            } catch (e) {
                console.error(e);
            }
        }
        if (originalFence) {
            return originalFence(tokens, idx, options, env, self);
        }
        return `<pre><code class="language-${info}">${md.utils.escapeHtml(token.content)}</code></pre>`;
    };
};
