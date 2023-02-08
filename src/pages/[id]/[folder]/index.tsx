import { NextPage } from 'next';
import Link from 'next/dist/client/link';
import { GetServerSideProps } from 'next/types';
import FolderList from '../../../components/Folder';
import NoneImage from '../../../components/NoneImage';
import prisma from '../../../lib/prismadb';
import { isUser } from '../../../utils/isUser';

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

const Home: NextPage<Props> = ({
  name,
  images,
  folders,
  folderId,
  parentId,
  keywords,
  allKeywords,
}) => {
  console.log(images);

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

        {images ? (
          <>
            <div className="mt-16 w-full flex gap-8 flex-wrap">
              {images.map(({ url, title }, index) => (
                <div key={title} className="">
                  {/* <div className="z-10 rounded-full h-8 w-8 bg-red-600 top-[-16px] right-[-16px] absolute flex justify-center items-center">
                <button >
                  <BsX size={28} className="text-white" />
                </button>
              </div> */}

                  <div className="border-2 border-black p-1 max-w-xs w-full cursor-pointer">
                    <img
                      alt={title}
                      src={url}
                      //onClick={() => setFullScreenImage(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center">
              <Link
                href={`/upload/${folderId}`}
                className="mt-16 transition-all hover:bg-cyan-800 bg-cyan-600 rounded py-6 px-40 flex flex-col items-center justify-around gap-2 text-white text-lg"
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
