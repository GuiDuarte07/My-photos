import { NextPage } from 'next';
import { GetStaticProps } from 'next/types';
import prisma from '../lib/prismadb';
import Header from '../components/Header';
import React, { useEffect, useReducer, useState } from 'react';
import Image from 'next/image';
import {
  actionsUploadEnum,
  uploadReducer,
  UploadReducer,
} from '../hooks/uploadReducer';
import { TiDelete } from 'react-icons/ti';
import { RiAddBoxFill } from 'react-icons/ri';
import { AiFillCloseSquare } from 'react-icons/ai';

const Upload: NextPage = () => {
  const [imageData, dispatchUpload] = useReducer(uploadReducer, []);
  const [uploadError, setUploadError] = useState(false);
  const [newTextKeyword, setNewTextKeyword] = useState(-1);
  //-1 para desativo e 0+ para ativado, o número diz qual dos indices do imageData vai adicionar um novo keyword
  const [textKeyword, setTextKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    /* Array.from(image).forEach((img) => {
      formData.append('file', img);
    }); */
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploadError(false);
    Array.from(e.target.files).forEach((file) => {
      if (!file.type.includes('image')) {
        setUploadError(true);
        return;
      }
    });
    dispatchUpload({
      type: actionsUploadEnum.UPLOAD,
      files: e.target.files,
    });
  };

  useEffect(() => {
    if (newTextKeyword === -1) {
      setTextKeyword('');
    }
  }, [newTextKeyword]);

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
                onChange={(e) => handleImageUpload(e)}
              />
            </label>
          </div>
          <h1 className="text-lg">Imagens que serão enviadas</h1>
          {uploadError && (
            <p className="text-red-500 text-sm">
              Um ou mais arquivos falharam na importação
            </p>
          )}

          <div className="w-full grid-cols-3 grid-rows-none gap-8 grid">
            {imageData.map(({ file, title, keywords }, index) => (
              <div key={file.name} className="border-2 border-black p-1">
                <div className="w-full h-52 relative">
                  <Image
                    alt={title}
                    src={file ? URL.createObjectURL(file) : ''}
                    fill
                  />
                </div>
                <input
                  type="text"
                  className="w-full my-1 pl-1 p-2 outline-none border-b-2 border-black"
                  value={title}
                  onChange={(e) =>
                    dispatchUpload({
                      type: actionsUploadEnum.CHANGETITLE,
                      text: e.target.value,
                      payload: index,
                    })
                  }
                />
                <h3 className="text-sm font-bold mb-1">Palavras chaves</h3>
                <div className="w-full flex flex-wrap gap-2">
                  {keywords.map((word) => (
                    <div
                      className="bg-gray-300 px-1 flex gap-2 text-center"
                      key={word.id ?? word.name}
                    >
                      <p>{word.name}</p>
                      <button
                        onClick={() =>
                          dispatchUpload({
                            type: actionsUploadEnum.DELETEKEYWORD,
                            payload: index,
                            keywordName: word.name,
                          })
                        }
                        className="text-red-500"
                      >
                        <TiDelete />
                      </button>
                    </div>
                  ))}
                  {newTextKeyword === -1 && (
                    <button
                      onClick={() => setNewTextKeyword(index)}
                      className=""
                    >
                      <RiAddBoxFill className="text-cyan-600" size={24} />
                    </button>
                  )}
                </div>
                {newTextKeyword === index && (
                  <div className="flex w-full h-6 my-2 items-center">
                    <input
                      type="search"
                      value={textKeyword}
                      onChange={(e) => setTextKeyword(e.target.value)}
                      className="bg-none h-full flex-1 outline-none border-2 pl-1 border-cyan-900"
                    />
                    <button
                      onClick={() => {
                        setNewTextKeyword(-1);
                        dispatchUpload({
                          type: actionsUploadEnum.NEWKEYWORD,
                          keywordName: textKeyword,
                          payload: index,
                        });
                      }}
                    >
                      <RiAddBoxFill size={28} className="text-cyan-600" />
                    </button>
                    <button onClick={() => setNewTextKeyword(-1)}>
                      <AiFillCloseSquare className="text-red-600" size={28} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <label
            className="cursor-pointer hover:bg-slate-600 transition-all place-self-center py-3 px-5 bg-slate-700 w-fit rounded text-white"
            htmlFor="submitImages"
          >
            Enviar imagens
          </label>
          <input type="submit" id="submitImages" className="hidden" />
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
