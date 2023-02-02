import { Session } from 'inspector';
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
type Keywords = { id: string; name: string }[] | null;

type Props = {
  images: Images;
  folders: Folders;
  folderId: string;
  parentId: string;
  name: string;
  keywords: Keywords;
  allKeywords: Keywords;
};

const Home: NextPage<Props> = ({
  name,
  images,
  folders,
  folderId,
  parentId,
  keywords,
  allKeywords,
}) => {
  console.log(allKeywords);
  return (
    <>
      <title>{name}</title>
      <div className="w-full">
        {folders && (
          <FolderList
            allKeywords={allKeywords}
            folderId={folderId}
            folders={folders}
            parentId={parentId}
            keywords={keywords}
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
  let folderId: string;
  let userId: string;

  if (typeof params?.folder === 'string' && typeof params?.id === 'string') {
    folderId = params?.folder;
    userId = params?.id;
  } else {
    return {
      redirect: { destination: '/404', permanent: true },
    };
  }

  if (!(await isUser(res, req, userId)))
    return {
      redirect: { destination: '/404', permanent: true },
    };

  let images: Images | null;
  let folders: Folders | null = [];
  let parentId: string | '' = '';
  let name: string;
  let keywords: Keywords;
  let allKeywords: Keywords;

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

    keywords = await prisma.keyword.findMany({
      where: {
        folder: { some: { id: folderId }, every: { user: { id: userId } } },
      },
      select: { id: true, name: true },
    });

    allKeywords = await prisma.keyword.findMany({
      where: { userId },
      select: { id: true, name: true },
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
      keywords,
      allKeywords,
    },
  };
};

export default Home;
