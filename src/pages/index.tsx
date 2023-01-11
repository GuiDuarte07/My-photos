import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

const Home: NextPage = () => <div>:D</div>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session?.user)
    return {
      redirect: { destination: '/404', permanent: false },
    };

  return {
    redirect: { destination: `/${session.user.id}`, permanent: false },
  };
};

export default Home;
