// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "r-pack-build" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.checkRpackage', function () {
        // The code you place here will be executed every time your command is executed
        var shell = require('shelljs');
        console.log(vscode.workspace.rootPath);
        shell.cd(vscode.workspace.rootPath);
        var buildCommand = 'R CMD build ' + vscode.workspace.rootPath;
        var checkCommand = 'R CMD check *.tar.gz';
        var step2 = true;
        var outputChannel = vscode.window.createOutputChannel("R");
        outputChannel.show();
        shell.exec(buildCommand, 
            function(code, stdout, stderr) {
                console.log(buildCommand);
                console.log(stdout);
                console.log(code);
                outputChannel.append(buildCommand);
                outputChannel.append(stdout);
                if(code) {
                    step2 = false;
                    vscode.window.showInformationMessage('Building tarball failed!');
                    console.log('Build failed!');
                    console.log(stderr);
                    outputChannel.append(stderr);
                }
            });
        if(step2) {
            shell.exec(checkCommand, function (cCode, cStdout, cStderr) {
                console.log(checkCommand);
                console.log(cStdout);
                outputChannel.append(checkCommand);
                outputChannel.append(cStdout);
                if (cCode) {
                    vscode.window.showInformationMessage('Check failed!');
                    console.log('Check failed!');
                    console.log(cStderr);
                    outputChannel.append(cStderr);
                } else {
                    vscode.window.showInformationMessage('Check succeeded!');
                }
            });
        }
        // Display a message box to the user
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;