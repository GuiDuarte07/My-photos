import { NextPage } from 'next';
import { GetServerSideProps, GetStaticProps } from 'next/types';
import prisma from '../../lib/prismadb';

import FolderList from '../../components/Folder';
import HomeFolderList from '../../components/HomeFolder';
import Header from '../../components/Header';
import { isUser } from '../../utils/isUser';

type Props = {
  folders: { id: string; name: string }[];
};
const Home: NextPage<Props> = ({ folders }) => {
  return (
    <>
      <title>te amo mor s3</title>
      <Header />
      <div className="w-full">
        <div className="">
          <HomeFolderList parentId={null} folders={folders} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  let id: string;

  if (typeof params?.id === 'string') {
    id = params?.id;
  } else {
    return {
      redirect: { destination: '/404', permanent: true },
    };
  }

  if (!(await isUser(res, req, id)))
    return {
      redirect: { destination: '/404', permanent: true },
    };

  const folders = await prisma.folder.findMany({
    where: { parent: { is: null }, AND: { userId: id } },
    select: { id: true, name: true },
  });

  return {
    props: {
      folders,
    },
  };
};

export default Home;
