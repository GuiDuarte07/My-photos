import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export const isUser = async (res: any, req: any, userId: string) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session?.user) return false;

  if (session.user.id !== userId) return false;

  return true;
};
