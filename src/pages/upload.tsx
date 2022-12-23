import { NextPage } from 'next';
import { GetStaticProps } from 'next/types';
import prisma from '../lib/prismadb';
import Header from '../components/Header';
import React, { useState } from 'react';
import Image from 'next/image';

const Upload: NextPage = () => {
  const [image, setImage] = useState<FileList | []>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    Array.from(image).forEach((img) => {
      formData.append('file', img);
    });
  };

  return (
    <>
      <title>Importar imagens</title>
      <Header />
      <div className="w-full flex items-center flex-col">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="max-w-5xl w-full flex flex-col gap-8"
        >
          <h1 className="font-bold text-xl mt-4">Envio de imagens</h1>
          {/* upload button */}
          <div className="w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG Or JPG
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
                onChange={(e) => setImage(e.target.files ?? [])}
              />
            </label>
          </div>
          <h1 className="">Imagens que serão enviadas</h1>
          <div className="w-full grid-cols-3 gap-8 grid">
            {Array.from(image).map((img) => (
              <div key={img.name} className="w-full h-52 relative">
                <Image
                  alt={img.name}
                  src={img ? URL.createObjectURL(img) : ''}
                  fill
                />
              </div>
            ))}
          </div>
          <label htmlFor="submitImages">Enviar imagens</label>
          <input type="submit" value="submitImages" />
        </form>
      </div>
    </>
  );
};

/* export const getStaticProps: GetStaticProps = async () => {
  const folders = await prisma.folder.findMany({
    where: { parent: { is: null } },
    select: { id: true, name: true },
  });

  return {
    props: {
      folders,
    },
  };
}; */

export default Upload;
