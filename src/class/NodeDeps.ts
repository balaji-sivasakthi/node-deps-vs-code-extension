import { Event, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window, EventEmitter } from 'vscode';
import { Dependency } from './Dependency';
import { accessSync, readFileSync } from 'fs';
import path = require('path');

export class NodeDeps implements TreeDataProvider<Dependency> {
    constructor(private workspaceRoot:string){}
    getTreeItem(element: Dependency): TreeItem{
        return element;
    }
    getChildren(element?: Dependency): undefined | Thenable<Dependency[]> {
        if(!this.workspaceRoot){
            window.showErrorMessage('Empty workspace');
            return Promise.resolve([]);
        }
        if(element){
            return Promise.resolve(
                this.getDeps(
                    path.join(this.workspaceRoot,'node_modules',element.label,'package.json')
                )
            );
        }else{
            const pckg = path.join(this.workspaceRoot, 'package.json')
            if(this.pathExist(pckg)){ 
                return Promise.resolve(this.getDeps(pckg));
            }else{
                window.showInformationMessage("No package.json in this workspace")
                return Promise.resolve([])
            }
        }
    }
    private getDeps(pckgPath: string) : Dependency[] {
        if(this.pathExist(pckgPath)){
            const toDep = (moduleName:string, version: string): Dependency => {
                if(this.pathExist(path.join(this.workspaceRoot,'node_module',moduleName))){
                    return new Dependency(
                        moduleName,
                        version,
                        TreeItemCollapsibleState.Collapsed
                    );
                }else{
                    return new Dependency(
                        moduleName,
                        version,
                        TreeItemCollapsibleState.None
                    );
                }
            }
            const packageJson = JSON.parse(readFileSync(pckgPath,'utf-8'));
            const deps = packageJson.dependencies 
                ? Object.keys(packageJson.dependencies).map(dep=>{
                    return toDep(dep, packageJson.dependencies[dep])
                })
                : [];
            const devDeps = packageJson.devDependencies
                ? Object.keys(packageJson.devDependencies).map(dep=>{
                    return toDep( '[DEV] '+dep,packageJson.devDependencies[dep])
                })
                : [];
            return deps.concat(devDeps)
        }else{
            return [];
        }
    }
    private pathExist(path: string): boolean {
        try{
            accessSync(path)
            return true;
        }catch(err){
            return false;
        }
    }
    private _onDidChangeTreeUpdate: EventEmitter <Dependency | undefined| null | void> = new EventEmitter<Dependency | undefined | null | void>();
    readonly onDidChangeTreeData: Event <Dependency | undefined| null | void> = this._onDidChangeTreeUpdate.event;
    refresh():void{
        this._onDidChangeTreeUpdate.fire();
    }
}