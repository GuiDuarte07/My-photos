import { NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/dist/client/link';
import { GetServerSideProps } from 'next/types';
import FolderList from '../../../components/Folder';
import NoneImage from '../../../components/NoneImage';
import prisma from '../../../lib/prismadb';
import { isUser } from '../../../utils/isUser';
import { authOptions } from '../../api/auth/[...nextauth]';

type Images =
  | {
      title: string;
      id: string;
      createdAt: Date;
      hidden: boolean;
      url: string;
      size: bigint;
    }[]
  | null;

type Folders = { id: string; name: string }[] | null;

type Props = {
  images: Images;
  folders: Folders;
  folderId: string;
  parentId: string;
  name: string;
};

const Home: NextPage<Props> = ({
  name,
  images,
  folders,
  folderId,
  parentId,
}) => {
  return (
    <>
      <title>{name}</title>
      <div className="w-full">
        {folders && (
          <FolderList
            folderId={folderId}
            folders={folders}
            parentId={parentId}
          />
        )}
        <div className="w-full h-96">
          <NoneImage />
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
  console.log(params);
  let folderId: string;
  let userId: string;

  if (typeof params?.folder === 'string' && typeof params?.id === 'string') {
    folderId = params?.folder;
    userId = params?.id;
  } else {
    return {
      redirect: { destination: '/404', permanent: false },
    };
  }

  if (!(await isUser(res, req, userId)))
    return {
      redirect: { destination: '/404', permanent: false },
    };

  let images: Images | null;
  let folders: Folders | null = [];
  let parentId: string | '' = '';
  let name: string;

  try {
    images = await prisma.image.findMany({
      where: { folder: { id: folderId }, AND: { userId } },
      select: {
        id: true,
        createdAt: true,
        hidden: true,
        title: true,
        url: true,
        size: true,
      },
    });

    const childrens = await prisma.folder.findUnique({
      where: { id: folderId },
      select: {
        parent_id: true,
        name: true,
        children: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    folders = childrens?.children.map(({ id, name }) => ({ id, name })) ?? null;
    parentId = childrens?.parent_id ?? '';
    name = childrens?.name ?? '';
  } catch (e) {
    console.log(e);
    return {
      redirect: { destination: '/404', permanent: false },
    };
  }

  return {
    props: {
      images,
      folders,
      folderId,
      name,
      parentId,
    },
  };
};

export default Home;
