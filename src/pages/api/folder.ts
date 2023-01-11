import { IFolderApiNextApiRequest } from './../../../types/types';
import nextConnect from 'next-connect';
import prisma from '../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).send(`Method '${req.method}' Not Allowed`);
  },
});

apiRoute.post(async (req: IFolderApiNextApiRequest, res: NextApiResponse) => {
  const { name, parentId } = req.body;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(400).send('not allowed');
  }

  let data: { id: string };

  try {
    data = await prisma.folder.create({
      data: {
        name,
        ...(parentId && { parent: { connect: { id: parentId } } }),
        user: { connect: { id: session.user.id } },
      },
      select: { id: true },
    });
  } catch (e) {
    return res.status(400).send('failed');
  }

  res.status(200).json(data);
});

export default apiRoute;
