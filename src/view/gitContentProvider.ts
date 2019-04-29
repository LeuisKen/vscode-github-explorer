/**
 * @file github file content provider
 * @author leuisken <leuisken@gmail.com>
 */

import * as vscode from 'vscode';
import * as qs from 'querystring';

import {repository as github} from '../github';

export class FileContentProvider
    implements vscode.TextDocumentContentProvider, vscode.Disposable {

    private disposables: vscode.Disposable[] = [];

    constructor(scheme: string) {
        this.disposables.push(
            vscode.workspace.registerTextDocumentContentProvider(scheme, this)
        );
    }

    async provideTextDocumentContent(uri: vscode.Uri) {
        const {path: rawPath, query} = uri;
        const {repo, commit} = qs.parse(query);
        const path = rawPath.substr(1);
        const content = await github.getFileContent((repo as string), (commit as string), path);
        return content;
    }

    dispose() {
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }
}
