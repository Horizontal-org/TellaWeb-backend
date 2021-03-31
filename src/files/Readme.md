## Files Module

This module solves the problem of file storage.

- Files are stored in buckets, each bucket can contain only one file with the same name.
- Files can be added partially and committed when complete.
- Each file receives a unique identifier that is used to establish relationships with other modules.

### Current implementation

Currently the filesystem is used as the storage medium (_see handlers/storage.file.handlers.ts_), the buckets are the folders containing the files, and the partial files are stored with an extra extension (.part by default) and this extension is removed when the file is complete.

The file name, the bucket and a unique identifier (uuid) are stored in the database. The size and status are queried from the file system and not from the database.

### Applications

This module exports the following applications:

- **getByNameAndBucket**: To get information about the status of a file according to its name and bucket.
- **getById**: To get information about the status of a file based on its unique identifier.
- **create**: To store a new file or append to an open one.
- **close**: To close or report the end of the upload of an existing file.
