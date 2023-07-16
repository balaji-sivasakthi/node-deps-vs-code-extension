import path = require("path");
import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class Dependency extends TreeItem {
    constructor(
        public readonly label: string,
        private version: string,
        public readonly collapseState: TreeItemCollapsibleState
    ){
        super(label, collapseState);
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }
    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };
}