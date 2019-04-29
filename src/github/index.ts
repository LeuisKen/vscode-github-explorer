/**
 * @file Github Repository Data Provider
 * @author leuisken <leuisken@gmail.com>
 */

import {FileEntriesResponse, FileBlobResponse} from './interface'
import {graphql} from './credentials';
// @ts-ignore
import * as queries from './queries.gql';
import {RepositoryDataProvider} from '../typings';

class Github implements RepositoryDataProvider {

    async getFileEntries(repository: string, refName: string, path: string) {
        const [owner, name] = repository.split('/');
        const data = await graphql.query<FileEntriesResponse>({
            query: queries.GetRepoFileTree,
            variables: {
                owner,
                name,
                expression: `${refName}:${path}`
            }
        });
        const entries = data.data.repository.object.entries
            .map(entry => {
                return {
                    ...entry,
                    path: path === '' ? entry.name : `${path}/${entry.name}`
                }
            });

        return entries;
    }

    async getFileContent(repository: string, refName: string, path: string) {
        const [owner, name] = repository.split('/');
        const data = await graphql.query<FileBlobResponse>({
            query: queries.GetRepoFileBlob,
            variables: {
                owner,
                name,
                expression: `${refName}:${path}`
            }
        });
        const content = data.data.repository.object.text;
        return content !== null ? content : '<Not Supported!>';
    }
}

export const repository = new Github();
