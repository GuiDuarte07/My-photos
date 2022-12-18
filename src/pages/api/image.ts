import nextConnect from 'next-connect';
import upload from '../../utils/upload';
import prisma from '../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  IImageApiNextApiRequest,
  IImageApiNextApiResponse,
} from '../../../types/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req: IImageApiNextApiRequest, res: NextApiResponse) => {
  const { title }: { title: string } = req.body;
  const {
    file: { location: url, mimetype, size },
  }: { file: { location: string; mimetype: string; size: number } } = req;

  await prisma.image.create({
    data: {
      title,
      url,
      mimetype,
      size,
      ImageFolder: {
        connectOrCreate: { create: { name: 'test' }, where: { name: 'test' } },
      },
    },
  });

  res.status(200).send('sucess');
});

export default apiRoute;
