import { NextPage } from 'next';
import { GetServerSideProps, GetStaticProps } from 'next/types';
import prisma from '../../lib/prismadb';
import Header from '../../components/Header';
import React, { useEffect, useReducer, useState } from 'react';
import Image from 'next/image';
import { actionsUploadEnum, uploadReducer } from '../../hooks/uploadReducer';
import { TiDelete } from 'react-icons/ti';
import { RiAddBoxFill } from 'react-icons/ri';
import { AiFillCloseSquare } from 'react-icons/ai';
import {
  BsX,
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from 'react-icons/bs';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import axios from 'axios';

type ImageType = {
  createdAt: Date;
  url: string;
  mimetype: string;
  size: number;
  title: string;
  keyword: {
    name: string;
  }[];
  folder: {
    id: string;
    name: string;
  };
};

type Props = {
  imageId: string;
  image: ImageType;
};

const ImagePage: NextPage<Props> = ({ imageId, image }) => {
  return (
    <main className="flex items-center flex-col">
      <h1 className="text-start">{image.title}</h1>
      <div className="w-[782px] h-52 relative">
        <Image alt={'dasdasd'} src={image.url} fill />
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  params,
}) => {
  let imageId: string;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (typeof params?.imageId === 'string') {
    imageId = params?.imageId;
  } else {
    return {
      redirect: { destination: '/404', permanent: true },
    };
  }

  if (!session?.user)
    return {
      redirect: { destination: '/404', permanent: true },
    };

  const image = await prisma.image.findFirst({
    where: { id: imageId, AND: { userId: session.user.id } },
    select: {
      keyword: { select: { name: true } },
      createdAt: true,
      folder: { select: { id: true, name: true } },
      url: true,
      mimetype: true,
      size: true,
      title: true,
    },
  });

  if (image) {
    return {
      props: {
        imageId,
        image: {
          ...image,
          createdAt: image.createdAt.toString(),
          size: Number(image.size),
        },
      },
    };
  } else {
    return {
      redirect: { destination: '/404', permanent: true },
    };
  }
};

export default ImagePage;
