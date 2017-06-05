// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "r-vscode-tools" is now active!');

    // Command to check R package
    context.subscriptions.push(vscode.commands.registerCommand('extension.checkRpackage', function () {
        // The code you place here will be executed every time your command is executed
        var shell = require('shelljs');
        console.log(vscode.workspace.rootPath);
        shell.cd(vscode.workspace.rootPath);
        var buildCommand = 'R CMD build ' + vscode.workspace.rootPath;
        var checkCommand = 'R CMD check *.tar.gz';
        var outputChannel = vscode.window.createOutputChannel("R");
        outputChannel.show();
        outputChannel.append(buildCommand + "\n");
        let p1 = new Promise((resolve, reject) => {
            shell.exec(buildCommand, function (code, stdout, stderr) {
                if (code) {
                    console.log(stderr);
                    outputChannel.append(stderr);
                    vscode.window.setStatusBarMessage("Build failed!");
                    reject();
                } else {
                    outputChannel.append("Done!\n");
                    vscode.window.setStatusBarMessage('Build succeeded!', 2000);
                    resolve();
                }
            });
        });
        p1.then(function () {
            outputChannel.append(checkCommand + "\n");
            shell.exec(checkCommand, function (code, stdout, stderr) {
                if (code) {
                    outputChannel.append(stderr);
                    outputChannel.append("Failed!");
                } else {
                    outputChannel.append("Done!");
                    vscode.window.setStatusBarMessage('Check succeeded!', 5000);
                }
            });
        });
    }));

    // Command to install an R package directory
    context.subscriptions.push(vscode.commands.registerCommand('extension.installRpackage', function () {
        // The code you place here will be executed every time your command is executed
        var shell = require('shelljs');
        console.log(vscode.workspace.rootPath);
        shell.cd(vscode.workspace.rootPath);
        var buildCommand = 'R CMD build ' + vscode.workspace.rootPath;
        var installCommand = 'R CMD INSTALL *.tar.gz';
        var outputChannel = vscode.window.createOutputChannel("R");
        outputChannel.show();
        outputChannel.append(buildCommand + "\n");
        let p1 = new Promise((resolve, reject) => {
            shell.exec(buildCommand, function(code, stdout, stderr) {
                if(code) {
                    console.log(stderr);
                    outputChannel.append(stderr);
                    vscode.window.setStatusBarMessage("Build failed!");
                    reject();
                } else {
                    outputChannel.append("Done!\n");
                    vscode.window.setStatusBarMessage('Build succeeded!', 2000);
                    resolve();
                }
            });
        });
        p1.then(function() {
            outputChannel.append(installCommand + "\n");
            shell.exec(installCommand, function(code, stdout, stderr){
                if(code) {
                    outputChannel.append(stderr);
                    outputChannel.append("Failed!");
                } else {
                    outputChannel.append("Done!");
                    vscode.window.setStatusBarMessage('Install succeeded!', 5000);
                }
            });
        });
    }));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;