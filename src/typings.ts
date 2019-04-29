/**
 * @file interface
 * @author leuisken <leuisken@gmail.com>
 */

/**
 * A data provider that provides repository data.
 * Defines how to fetch repository data, bind to a way like github or gitlab.
 * You can implements this interface and this extension should work fine as your expected.
 */
export interface RepositoryDataProvider {

    /**
     * Get the list of `FileEntry` of the repository passed.
     *
     * @param repository    repository identifier that user passed, like `facebook/react`
     * @param refName       git ref, like `HEAD`, `master`, `tags/xxx`
     * @param path          usually means a path of a directory
     */
    getFileEntries(repository: string, refName: string, path: string): Promise<FileEntry[]>;

    /**
     * Get the content of `FileEntry` of the repository passed.
     * **Note:** may be should support blob object.
     *
     * @param repository    repository identifier that user passed, like `facebook/react`
     * @param refName       git ref, like `HEAD`, `master`, `tags/xxx`
     * @param path          usually means a path of a single file
     */
    getFileContent(repository: string, refName: string, path: string): Promise<string>;

}

/**
 * Represents a reference to a file or directory.
 */
export interface FileEntry {
    /**
     * name of the file or directory.
     */
    name: string;

    /**
     * path of the file or directory in the repository.
     */
    path: string;

    /**
     * whether it is file or directory
     */
    type: 'blob' | 'tree';
}
