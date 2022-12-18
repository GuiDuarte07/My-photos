import { NextApiRequest } from 'next';

export interface IImageApiNextApiRequest extends NextApiRequest {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    contentDisposition: null;
    storageClass: string;
    serverSideEncryption: null;
    metadata: { fieldName: string };
    location: string;
    etag: string;
    versionId: undefined;
  };
  body: {
    title: string;
    folderId: string;
    keyword: { name: string }[];
  };
}

export interface IFolderApiNextApiRequest extends NextApiRequest {
  body: {
    name: string;
    parentId: string;
  };
}
