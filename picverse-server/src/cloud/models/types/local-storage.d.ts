declare namespace LocalStorage {
  type GridFsFile = {
    id: DocumentId;
    fileName: string;
    contentType: string;
    chunkSize: number;
    uploadDate: Date;
    size: number;
  };

  type GridFsUploadOptions = Omit<GridFsFile, "uploadDate"> & {
    bucketName: string;
  };
}
