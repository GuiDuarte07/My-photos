import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3-v2';

const s3 = new aws.S3({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET ?? '',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    console.log(file);
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('tipo inválido', { cause: { error: 'Apenas imagem' } }));
    }
  },
  limits: { fileSize: 1000000 },
});

export function deleteFromAWS(key: string) {
  return s3.deleteObject(
    { Key: key, Bucket: process.env.AWS_BUCKET ?? '' },
    function (err, data) {
      console.log(data);
      if (err) return false;
      else return true;
    }
  );
}
