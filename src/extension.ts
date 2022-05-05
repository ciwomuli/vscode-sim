// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs-extra';
import * as vscode from 'vscode';
import { Result } from './result';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
var results: Result[];
let res: Result | undefined;
let documents = new Map();
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors
    // (console.error) This line of code will only be executed once when your
    // extension is activated
    console.log('Congratulations, your extension "vscode-sim" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-sim.runSim', () => {
            vscode.window.showInformationMessage('Running check......');
            vscode.window.createTerminal('check', 'check');
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-sim.scanLutece', () => {
            vscode.window.showInformationMessage('Scaning......');
            scanCheck(function (fileName: string): string {
                let da = fileName.split('-');
                return da[1];
            });
            if (!openNextfile())
                vscode.window.showInformationMessage('No more files');
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-sim.scanDomJudge', () => {
            vscode.window.showInformationMessage('Scaning......');
            scanCheck(function (fileName: string): string {
                let da = fileName.split('-');
                return da[0];
            });
            if (!openNextfile())
                vscode.window.showInformationMessage('No more files');
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-sim.finish', () => {
            let num = vscode.window.showInputBox();
            num.then(function (value) {
                if (!res) return;
                if (!vscode.workspace.workspaceFolders) return;
                fs.appendFile(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'check.csv').path.substring(1),
                    res.filename[0] + ',' + res.filename[1] + ',' + value + '\n',
                    (err) => {
                        if (err) throw err;
                    });
                if (!openNextfile())
                    vscode.window.showInformationMessage('No more files');
            });
        }));
}
function scanCheck(getUserName: (fileName: string) => string) {
    results = [];
    console.log(1);
    if (vscode.workspace.workspaceFolders) {
        console.log(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'check.txt').path.substring(1));
        let data = fs.readFileSync(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'check.txt').path.substring(1), "utf8");
        let sp = data.split('\n');
        for (let line of sp) {
            let da = line.split('\t');
            if (da.length < 6) continue;
            results.push(new Result(
                getUserName(da[0]), getUserName(da[1]), da[0], da[1],
                parseFloat(da[5]), parseFloat(da[6])));
        }
    }
    console.log(results.length);
    vscode.window.showInformationMessage('Scan finished.');
}
function getDocument(uri: vscode.Uri): Thenable<vscode.TextDocument> {
    if (documents.has(uri.path)) {
        console.log(5);
        return documents.get(uri.path);
    }
    documents.set(uri.path, vscode.workspace.openTextDocument(uri));
    return documents.get(uri.path);
}
function openNextfile(): boolean {
    vscode.commands.executeCommand("workbench.action.closeAllEditors");
    res = results.pop();
    while (res && !res.availavle()) res = results.pop();;
    if (!res) return false;
    const options = {
        viewColumn: vscode.ViewColumn.Beside
    };
    if (vscode.workspace.workspaceFolders) {
        vscode.commands.executeCommand("vscode.open", vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, res.filename[0]), options);
        console.log(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, res.filename[0]).fsPath);
        vscode.commands.executeCommand("vscode.open", vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, res.filename[1]), options);
        console.log(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, res.filename[1]).fsPath);
        // getDocument(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, res.filename[0])).then(document => vscode.window.showTextDocument(document, options));
        // getDocument(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, res.filename[0])).then(document => vscode.window.showTextDocument(document, options));
        // getDocument(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, res.filename[1])).then(document => vscode.window.showTextDocument(document, options));
        return true;
    }
    return false;
    //vscode.commands.executeCommand("vscode.open", vscode.Uri,parse('H:\\chachong\\2022-graph\\' + res.filename[0]), options);
}
// this method is called when your extension is deactivated
export function deactivate() { }
