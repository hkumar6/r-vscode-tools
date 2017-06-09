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
    context.subscriptions.push(vscode.commands.registerCommand('r-tools.checkRpackage', function () {
        // The code you place here will be executed every time your command is executed
        var shell = require('shelljs');
        console.log(vscode.workspace.rootPath);
        shell.cd(vscode.workspace.rootPath);
        var buildCommand = 'R CMD build ' + vscode.workspace.rootPath;
        var checkCommand = 'R CMD check ';
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
                    resolve(stdout.match('[A-Za-z0-9\._]*\.tar\.gz')[0]);
                }
            });
        });
        p1.then(function (tarFile) {
            checkCommand = checkCommand + tarFile;
            outputChannel.append(checkCommand + "\n");
            shell.exec(checkCommand, function (code, stdout, stderr) {
                if (code) {
                    outputChannel.append(stderr);
                    outputChannel.append("Failed!");
                } else {
                    outputChannel.append("Done!");
                    setTimeout(function () {
                        outputChannel.hide();
                        outputChannel.dispose();
                    }, 2000);
                    vscode.window.setStatusBarMessage('Check succeeded!', 5000);
                }
            });
        });
    }));

    // Command to install an R package directory
    context.subscriptions.push(vscode.commands.registerCommand('r-tools.installPackageDir', function () {
        // The code you place here will be executed every time your command is executed
        var shell = require('shelljs');
        console.log(vscode.workspace.rootPath);
        shell.cd(vscode.workspace.rootPath);
        var buildCommand = 'R CMD build ' + vscode.workspace.rootPath;
        var installCommand = 'R CMD INSTALL ';
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
                    resolve(stdout.match('[A-Za-z0-9\._]*\.tar\.gz')[0]);
                }
            });
        });
        p1.then(function(tarFile) {
            installCommand = installCommand + tarFile;
            outputChannel.append(installCommand + "\n");
            shell.exec(installCommand, function(code, stdout, stderr){
                if(code) {
                    outputChannel.append(stderr);
                    outputChannel.append("Failed!");
                } else {
                    outputChannel.append("Done!");
                    setTimeout(function () {
                        outputChannel.hide();
                        outputChannel.dispose();
                    }, 2000);
                    vscode.window.setStatusBarMessage('Install succeeded!', 5000);
                }
            });
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('r-tools.installPackage', function () {
        var shell = require("shelljs");
        var selection = vscode.window.activeTextEditor.selection;
        var packageSelection = vscode.window.activeTextEditor.document.getText(selection.with());
        let packageInput = vscode.window.showInputBox({value: packageSelection});
        packageInput.then(function (packageName) {
            console.log(packageName);
            var outputChannel = vscode.window.createOutputChannel("R");
            outputChannel.show();
            var installCommand = 'Rscript -e "install.packages(\'' + packageName + '\', repos=\'https://cloud.r-project.org\')"';
            outputChannel.append(installCommand + '\n');
            shell.exec(installCommand, function (code, stdout, stderr) {
                if (code) {
                    outputChannel.append(stderr);
                    outputChannel.append("Failed!");
                } else {
                    outputChannel.append("Done!");
                    setTimeout(function () {
                        outputChannel.hide();
                        outputChannel.dispose();
                    }, 2000);
                    vscode.window.setStatusBarMessage(packageName + ' installed successfully!', 5000);
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