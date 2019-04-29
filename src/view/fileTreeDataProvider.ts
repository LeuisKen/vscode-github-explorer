/**
 * @file Create the Repository File Tree
 * @author leuisken <leuisken@gmail.com>
 */

import * as vscode from 'vscode';
import {groupBy} from 'lodash';

import {context} from '../context';
import {repository as github} from '../github';

class FileTreeView
    implements vscode.TreeDataProvider<FileTreeNode>, vscode.Disposable {

    private disposables: vscode.Disposable[] = [];

    private _onDidChangeTreeData = new vscode.EventEmitter<FileTreeNode>();
    readonly onDidChangeTreeData? = this._onDidChangeTreeData.event;

    private _initialize: boolean = false;

    constructor(viewId: string) {
        this.disposables.push(
            vscode.window.registerTreeDataProvider(viewId, this)
        );
    }

    async getChildren(node?: FileTreeNode) {
        const repository = context.get('repository');
        const ref = context.get('ref');
        if (repository === undefined || ref === undefined) {
            return [];
        }
        const path = node === undefined ? '' : node.path;
        const data = await github.getFileEntries(repository, ref, path);
        const res = groupBy(data, child => child.type);
        const {tree = [], blob = []} = res;
        return [
            ...tree,
            ...blob
        ];
    }

    getTreeItem(node: FileTreeNode) {
        const repo = context.get('repository') || '';
        const commit = context.get('ref') || '';
        const uri = vscode.Uri.parse(`github-explorer://explorer/${node.path}?repo=${repo}&commit=${commit}`);
        const item = new vscode.TreeItem(uri);
        item.collapsibleState = node.type === 'tree'
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None;
        item.command = node.type === 'blob' ? {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [uri]
        } : undefined;
        return item;
    }

    update() {
        if (!this._initialize) {
            vscode.commands.executeCommand('setContext', 'githubExplorer:showTreeView', true);
            this._initialize = true;
        }
        else {
            this._onDidChangeTreeData.fire();
        }
    }

    dispose() {
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }
}

interface FileTreeNode {
    name: string;
    path: string;
    type: 'blob' | 'tree';
}

export const provider = new FileTreeView('GithubRepository');
