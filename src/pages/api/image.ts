import nextConnect from 'next-connect';
import { deleteFromAWS, upload } from '../../utils/awsS3';
import prisma from '../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { IImageApiNextApiRequest } from '../../../types/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).send(`Method '${req.method}' Not Allowed`);
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req: IImageApiNextApiRequest, res: NextApiResponse) => {
  const { title, folderId, keyword } = req.body;
  const {
    file: { location: url, mimetype, size, key },
  } = req;

  try {
    await prisma.image.create({
      data: {
        title,
        url,
        mimetype,
        size,
        awsKey: key,
        folder: {
          connect: {
            id: folderId,
          },
        },
        keyword: {
          createMany: {
            data: keyword,
          },
        },
      },
    });
  } catch (e) {
    deleteFromAWS(key);
    return res.status(400).send('failed');
  }

  res.status(200).send('sucess');
});

/* apiRoute.delete */

export default apiRoute;
