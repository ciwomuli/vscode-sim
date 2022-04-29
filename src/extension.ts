// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import { Result } from './result';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
var results: Result[];
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
            // The code you place here will be executed every time your command is
            // executed Display a message box to the user
            vscode.window.showInformationMessage('Running check......');
            vscode.window.createTerminal('check', 'check');
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-sim.scanLutuce', () => {
            // The code you place here will be executed every time your command is
            // executed Display a message box to the user
            vscode.window.showInformationMessage('Scaning......');
            scanCheck(function (fileName: string): string {
                let da = fileName.split('-');
                return da[1];
            });
        }));
}
function scanCheck(getUserName: (fileName: string) => string) {
    results = [];
    console.log(1);
    if (vscode.workspace.workspaceFolders) {
        console.log(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, '/check.txt').path);
        let data = fs.readFileSync('D:\\2022-graph\\check.txt', "utf8");
        console.log(data);
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
    openNextfile();
}
function openNextfile(): boolean {
    let res = results.pop();
    while (!res?.availavle()) res = results.pop();;
    if (!res) return false;
    const options = {
        viewColumn: vscode.ViewColumn.Beside
    };
    vscode.commands.executeCommand("vscode.open", res.filename[0], options);
    return true;
}
// this method is called when your extension is deactivated
export function deactivate() { }
