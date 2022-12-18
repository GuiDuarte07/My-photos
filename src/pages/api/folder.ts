import { IFolderApiNextApiRequest } from './../../../types/types';
import nextConnect from 'next-connect';
import prisma from '../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).send(`Method '${req.method}' Not Allowed`);
  },
});

apiRoute.post(async (req: IFolderApiNextApiRequest, res: NextApiResponse) => {
  const { name, parentId } = req.body;

  let data: { id: string };

  try {
    data = await prisma.folder.create({
      data: {
        name,
        ...(parentId && { parent: { connect: { id: parentId } } }),
      },
      select: { id: true },
    });
  } catch (e) {
    return res.status(400).send('failed');
  }

  res.status(200).json(data);
});

export default apiRoute;
