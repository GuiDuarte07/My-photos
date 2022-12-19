import { NextPage } from 'next';
import Link from 'next/dist/client/link';
import { GetServerSideProps } from 'next/types';
import FolderList from '../../components/Folder';
import prisma from '../../lib/prismadb';

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
};

const Home: NextPage<Props> = ({ images, folders, folderId, parentId }) => {
  return (
    <div className="w-full">
      {folders && (
        <FolderList folderId={folderId} folders={folders} parentId={parentId} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  let folderId: string;

  if (typeof params?.folder === 'string') {
    folderId = params?.folder;
  } else {
    return {
      redirect: { destination: '/404', permanent: false },
    };
  }

  let images: Images | null;
  let folders: Folders | null = [];
  let parentId: string | '' = '';

  try {
    images = await prisma.image.findMany({
      where: { folder: { id: folderId } },
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

    console.log(parentId);
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
      parentId,
    },
  };
};

export default Home;