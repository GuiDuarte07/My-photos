import { NextPage } from 'next';
import Link from 'next/dist/client/link';
import { GetStaticProps } from 'next/types';
import prisma from '../lib/prismadb';

import { AiFillFolderOpen } from 'react-icons/ai';
import { FaFolderPlus } from 'react-icons/fa';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import FolderList from '../components/Folder';

type Props = {
  folders: { id: string; name: string }[];
};
const Home: NextPage<Props> = ({ folders }) => {
  return (
    <div className="w-full">
      <div className="">
        <FolderList folders={folders} />
      </div>
    </div>
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
