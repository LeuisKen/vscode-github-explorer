/**
 * @file graphql api interface
 * @author leuisken <leuisken@gmail.com>
 */

export interface FileEntriesResponse {
    repository: {
        object: {
            entries: {
                name: string;
                type: 'blob' | 'tree';
            }[]
        }
    }
}

export interface FileBlobResponse {
    repository: {
        object: {
            text: string | null;
        }
    }
}
