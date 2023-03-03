import { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/dist/client/link';
import { GetServerSideProps } from 'next/types';
import FolderList from '../../../components/Folder';
import NoneImage from '../../../components/NoneImage';
import prisma from '../../../lib/prismadb';
import { isUser } from '../../../utils/isUser';

import { BsFillGrid3X3GapFill, BsFillGridFill } from 'react-icons/bs';
import Galery from '../../../components/Galery';
import Modal from 'react-modal';

type Images =
  | {
      title: string;
      id: string;
      createdAt: string;
      hidden: boolean;
      url: string;
      size: number;
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

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgb(254, 255, 255)',
    padding: '0px',
  },
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
  const [detailsFolderModal, setDetailsFolderModal] = useState<boolean>(false);

  return (
    <>
      <Modal
        isOpen={detailsFolderModal}
        onRequestClose={() => setDetailsFolderModal((prev) => !prev)}
        style={customStyles}
        contentLabel="Folder Modal"
      >
        teste 124
      </Modal>
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

        {images?.length ? (
          <>
            <Galery
              openDetail={() => setDetailsFolderModal((prev) => !prev)}
              folderId={folderId}
              images={images}
            />
            <div className="w-full flex justify-center">
              <Link
                href={`/upload/${folderId}`}
                className="my-16 transition-all hover:bg-cyan-800 bg-cyan-600 rounded py-6 px-40 flex flex-col items-center justify-around gap-2 text-white text-lg"
              >
                Adicionar imagem
              </Link>
            </div>
          </>
        ) : (
          <div className="w-full h-96">
            <NoneImage folderId={folderId} />
          </div>
        )}
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

  let imagesSerialize: Images | null;
  let folders: Folders | null = [];
  let parentId: string | '' = '';
  let name: string;
  let keywords: Keywords;
  let allKeywords: Keywords;
  let images;

  try {
    images = await prisma.image.findMany({
      where: { userId, AND: { folderId } },
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

  imagesSerialize = images.map((image) => ({
    ...image,
    createdAt: image.createdAt.toString(),
    size: Number(image.size),
  }));

  return {
    props: {
      images: imagesSerialize,
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
