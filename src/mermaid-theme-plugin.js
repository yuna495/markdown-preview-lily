const vscode = require('vscode');

module.exports = function mermaidThemePlugin(md) {
    console.log('[MPP Plugin] Initializing.');
    const originalFence = md.renderer.rules.fence;

    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const info = token.info ? token.info.trim() : '';

        if (info === 'mermaid') {
            try {
                const config = vscode.workspace.getConfiguration('markdown-preview-plus');
                const theme = config.get('mermaidTheme', 'pinklily');

                console.log('[MPP Plugin] Processing fence. Theme:', theme);

                // 1. Inject Mermaid Initialization Directive
                const internalTheme = (theme === 'pinklily') ? 'base' : theme;
                // Use strict JSON format (double quotes) for the directive
                const directive = `%%{init: { "theme": "${internalTheme}", "gantt": { "todayMarker": false } } }%%\n`;

                if (!token.content.includes('%%{init:')) {
                    token.content = directive + token.content;
                    console.log('[MPP Plugin] Injected directive:', directive.trim());
                }

                // 2. Add Class for Custom CSS (PinkLily)
                // Appending to info results in class="language-mermaid mpp-theme-pinklily" on the code block
                if (theme === 'pinklily') {
                    if (!token.info.includes('mpp-theme-pinklily')) {
                        token.info += ' mpp-theme-pinklily';
                        console.log('[MPP Plugin] Added mpp-theme-pinklily class to token.');
                    }
                }

                // Render the fence
                if (originalFence) {
                    return originalFence(tokens, idx, options, env, self);
                }
                return `<pre><code class="language-${info}">${md.utils.escapeHtml(token.content)}</code></pre>`;

            } catch (e) {
                console.error('[MPP Plugin] Error:', e);
            }
        }

        if (originalFence) {
            return originalFence(tokens, idx, options, env, self);
        }
        return `<pre><code class="language-${info}">${md.utils.escapeHtml(token.content)}</code></pre>`;
    };
};
