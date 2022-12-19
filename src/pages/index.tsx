import { NextPage } from 'next';
import { GetStaticProps } from 'next/types';
import prisma from '../lib/prismadb';

import FolderList from '../components/Folder';
import HomeFolderList from '../components/HomeFolder';

type Props = {
  folders: { id: string; name: string }[];
};
const Home: NextPage<Props> = ({ folders }) => {
  return (
    <>
      <title>te amo mor s3</title>
      <div className="w-full">
        <div className="">
          <HomeFolderList parentId={null} folders={folders} />
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const folders = await prisma.folder.findMany({
    where: { parent: { is: null } },
    select: { id: true, name: true },
  });

  return {
    props: {
      folders,
    },
  };
};

export default Home;
