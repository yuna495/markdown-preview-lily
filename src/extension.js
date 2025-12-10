// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');

// Global Output Channel
const outputChannel = vscode.window.createOutputChannel("Markdown Preview Lily");
console.log = (msg) => outputChannel.appendLine(`[Log] ${msg}`);
console.error = (msg) => outputChannel.appendLine(`[Error] ${msg}`);

outputChannel.appendLine('[MPP Main] Loading extension.js');

let markmapPlugin;
let mermaidThemePlugin;

try {
    // 作成予定のMarkmapプラグインをインポートします
    markmapPlugin = require('./markmap-it-plugin');
    outputChannel.appendLine('[MPP Main] Loaded markmap plugin');
    mermaidThemePlugin = require('./mermaid-theme-plugin');
    outputChannel.appendLine('[MPP Main] Loaded mermaid theme plugin');
} catch (e) {
    outputChannel.appendLine(`[MPP Main] Failed to load plugins: ${e}`);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('[MPP Main] Markdown Preview Plus is now active!');



    return {
        extendMarkdownIt(md) {
            return extendMarkdownIt(md);
        }
    };
}

// この関数をエクスポートすることで、VS CodeのMarkdown拡張機能が
// 独自のマークダウン-itインスタンスを拡張するために呼び出します。
/**
 * @param {import('markdown-it')} md
 * @returns {import('markdown-it')}
 */
function extendMarkdownIt(md) {
    console.log('[MPP Main] extendMarkdownIt called');
    // Markmapプラグインを適用
    // ここに将来Mermaidプラグインも追加できます
    return md.use(markmapPlugin).use(mermaidThemePlugin);
}

function deactivate() {}

module.exports = {
	activate,
    extendMarkdownIt,
	deactivate
}
