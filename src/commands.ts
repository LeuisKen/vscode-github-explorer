/**
 * @file Command Center
 * @author leuisken <leuisken@gmail.com>
 */

import * as vscode from 'vscode';

import {context} from './context';
import {provider as fileTreeView} from './view/fileTreeDataProvider'

interface Command {
    commandId: string;
    key: string;
    method: (...args: any[]) => any;
}

const Commands: Command[] = [];

function command(commandId: string) {
    return (_target: any, key: string, descriptor: any) => {
        if (!(typeof descriptor.value === 'function')) {
            throw new Error('not supported');
        }

        Commands.push({commandId, key, method: descriptor.value});
    };
}

class CommandCenter {

    private disposables: vscode.Disposable[];

    constructor() {
        this.disposables = Commands.map(({commandId, method}) => {
            return vscode.commands.registerCommand(commandId, method.bind(this));
        });
    }

    @command('githubExplorer.enterRepository')
    async enterRepository() {
        // @ts-ignore
        const repository: string = await vscode.window.showInputBox({
            prompt: 'Input the repository that you want to explorer, like: facebook/react.',
            validateInput(string) {
                if (!string) {
                    return 'Input can\'t be empty!';
                }
                return '';
            }
        });
        context.set('repository', repository);
        context.set('ref', 'HEAD');
        fileTreeView.update();
    }

    @command('githubExplorer.selectRef')
    async selectRef() {
        // @ts-ignore
        const ref: string = await vscode.window.showInputBox({
            prompt: 'Input the ref of repository that you want to explorer, like: master or tags/1.0.0',
            validateInput(string) {
                if (!string) {
                    return 'Input can\'t be empty!';
                }
                return '';
            }
        });
        context.set('ref', ref);
        fileTreeView.update();
    }

    dispose() {
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }

}

export const commands = new CommandCenter();
