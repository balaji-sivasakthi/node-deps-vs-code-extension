import { ExtensionContext, commands, window, workspace } from 'vscode';
import { NodeDeps } from './class/NodeDeps';

export function activate (context: ExtensionContext){
	const rootPath = workspace.workspaceFolders && workspace.workspaceFolders.length > 0
	? workspace.workspaceFolders[0].uri.fsPath
	: undefined;
	window.registerTreeDataProvider(
		'nodeDependencies',
		new NodeDeps(rootPath!)
	)
	window.createTreeView(
		'nodeDependencies',
		{
			treeDataProvider: new NodeDeps(rootPath!)
		}
	)
}
export function deactive(){}