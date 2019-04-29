/**
 * @file Extension Entry
 * @author leuisken <leuisken@gmail.com>
 */

import * as vscode from 'vscode';

import {commands} from './commands';
import {provider as repositoryFileTree} from './view/fileTreeDataProvider';
import {FileContentProvider} from './view/gitContentProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        commands,
        repositoryFileTree,
        new FileContentProvider('github-explorer')
    );
}

export function deactivate() {}
