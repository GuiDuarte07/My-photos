import { NextApiRequest } from 'next';
export interface IImageApiNextApiRequest extends NextApiRequest {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: 808419;
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
}
