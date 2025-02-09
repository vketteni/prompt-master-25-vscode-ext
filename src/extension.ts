// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "prompt-master-25" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('prompt-master-25.copyFunction', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active file.');
            return;
        }

        const functions = await getFunctionsFromDocument(editor.document);
        if (!functions.length) {
            vscode.window.showErrorMessage('No functions found in this file.');
            return;
        }

        const selectedFunction = await vscode.window.showQuickPick(
            functions.map(fn => ({ label: fn.name, detail: fn.signature, fn })),
            { placeHolder: 'Select a function to copy' }
        );

        if (selectedFunction) {
            const format = await getUserPreferredFormat();
            const output = formatFunction(selectedFunction.fn, format);
            vscode.env.clipboard.writeText(output);
            vscode.window.showInformationMessage(`Copied function: ${selectedFunction.label}`);
        }
    });

	context.subscriptions.push(disposable);
}

async function getFunctionsFromDocument(document: vscode.TextDocument) {
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        document.uri
    );

    return symbols
        ? symbols
              .filter(sym => sym.kind === vscode.SymbolKind.Function || sym.kind === vscode.SymbolKind.Method)
              .map(fn => ({
                  name: fn.name,
                  range: fn.range,
                  signature: document.getText(new vscode.Range(fn.range.start, fn.range.end)),
              }))
        : [];
}

async function getUserPreferredFormat() {
    const config = vscode.workspace.getConfiguration('functionCopy');
    return config.get<string>('format', 'signature');
}

function formatFunction(fn: { name: string; signature: string }, format: string): string {
    const config = vscode.workspace.getConfiguration('functionCopy');
    const template = config.get<string>('customTemplate', '{name}({params})');

    if (format === 'signature') {
        return fn.signature.split('{')[0].trim(); // Extract only function signature
    } else if (format === 'body') {
        return fn.signature.split('{').slice(1).join('{').trim(); // Extract body only
    } else {
        return template
            .replace('{name}', fn.name)
            .replace('{params}', fn.signature.match(/\((.*?)\)/)?.[1] || '')
            .replace('{body}', fn.signature);
    }
}

export class FunctionTreeProvider implements vscode.TreeDataProvider<FunctionItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<FunctionItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string) {}

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    async getChildren(): Promise<FunctionItem[]> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return [];

        const functions = await getFunctionsFromDocument(editor.document);
        return functions.map(fn => new FunctionItem(fn.name, fn.signature));
    }

    getTreeItem(element: FunctionItem): vscode.TreeItem {
        return element;
    }
}

class FunctionItem extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly signature: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.command = { command: 'extension.copyFunction', title: 'Copy Function', arguments: [this.signature] };
    }
}


// This method is called when your extension is deactivated
export function deactivate() {}
