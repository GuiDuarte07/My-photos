import { IKeywordFolderApiNextApiRequest } from './../../../types/types';
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

apiRoute.post(
  async (req: IKeywordFolderApiNextApiRequest, res: NextApiResponse) => {
    const { keyword, folderId } = req.body;

    if (typeof keyword !== 'string' || !keyword)
      return res.status(400).send('invalid data');

    if (typeof folderId !== 'string' || !folderId)
      return res.status(400).send('invalid data');

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session?.user) {
      return res.status(400).send('not allowed');
    }

    try {
      const keySearch = await prisma.keyword.findFirst({
        where: { name: keyword, AND: { userId: session.user.id } },
        select: { id: true },
      });

      if (keySearch?.id) {
        await prisma.folder.update({
          where: { id: folderId },
          data: { keywords: { connect: { id: keySearch.id } } },
        });
      } else {
        await prisma.keyword.create({
          data: {
            name: keyword,
            folder: { connect: { id: folderId } },
            userId: session.user.id,
          },
        });
      }
    } catch (e) {
      return res.status(400).send('failed');
    }

    res.status(200);
  }
);

export default apiRoute;
