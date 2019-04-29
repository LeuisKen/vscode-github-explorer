/**
 * @file create ApolloClient
 * @author leuisken <leuisken@gmail.com>
 */

import * as vscode from 'vscode';
import {ApolloClient, InMemoryCache} from 'apollo-boost';
import {createHttpLink} from 'apollo-link-http';
import fetch from 'node-fetch';

const link = createHttpLink({
    fetch,
    uri: 'https://api.github.com/graphql',
    headers: {
        'Authorization': `token ${vscode.workspace.getConfiguration('github-explorer').get('token')}`
    }
});

export const graphql = new ApolloClient({
    link,
    cache: new InMemoryCache
});
