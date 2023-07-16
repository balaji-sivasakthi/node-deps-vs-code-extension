import { ExtensionContext, commands, window, workspace } from 'vscode';
import { NodeDeps } from './class/NodeDeps';

export function activate (context: ExtensionContext){
	const rootPath = workspace.workspaceFolders && workspace.workspaceFolders.length > 0
	? workspace.workspaceFolders[0].uri.fsPath
	: undefined;
	const nodeDeps = new NodeDeps(rootPath!);
	window.registerTreeDataProvider(
	    'nodeDependencies',
		nodeDeps
	)
	commands.registerCommand('nodeDependencies.refreshEntry',()=>{
		nodeDeps.refresh();
	})
}
export function deactive(){}