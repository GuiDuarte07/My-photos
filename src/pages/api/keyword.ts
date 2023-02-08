import { IKeywordApiNextApiRequest } from '../../../types/types';
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

apiRoute.post(async (req: IKeywordApiNextApiRequest, res: NextApiResponse) => {
  const { keyword } = req.body;

  if (!keyword) return res.status(400).send('invalid data');

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(400).send('not allowed');
  }

  try {
    await prisma.keyword.createMany({
      data: keyword.map((key) => ({ name: key, userId: session.user.id })),
    });
  } catch (e) {
    return res.status(400).send('failed');
  }

  res.status(200);
});

export default apiRoute;
