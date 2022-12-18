import axios from 'axios';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { unstable_getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Author, InscribeApiResponde } from '../../../../types/types';
import Container from '../../../components/container';
import Header from '../../../components/Header';
import validateNewAuthor from '../../../utils/Validations';
import { authOptions } from '../../api/auth/[...nextauth]';

const Article: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  const [title, setTitle] = useState<string>('');
  const [abstract, setAbstract] = useState<string>('');

  const [authors, setAuthors] = useState<Author[]>([
    {
      fullname: user.name,
      phone: '',
      email: user.email,
    },
  ]);

  const [authorNameInput, setAuthorNameInput] = useState<string>('');
  const [authorEmailInput, setAuthorEmailInput] = useState<string>('');
  const [authorPhoneInput, setAuthorPhoneInput] = useState<string>('');
  const [invalidAuthor, setInvalidAuthor] = useState<string>('');

  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState<string>('');

  const [sucessfullyModal, setSucessfullyModal] = useState<boolean>(false);

  function addNewAuthor(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const result = validateNewAuthor(
      authorNameInput,
      authorEmailInput,
      authorPhoneInput
    );

    if (!result.email || !result.name || !result.phone) {
      setInvalidAuthor('Algum dado na inscrição do autor está incorreto');
      return;
    }

    if (invalidAuthor) setInvalidAuthor('');

    setAuthorEmailInput('');
    setAuthorNameInput('');
    setAuthorPhoneInput('');

    setAuthors((prev) => {
      const prevState = structuredClone(prev);

      prevState.push({
        fullname: authorNameInput,
        phone: authorPhoneInput,
        email: authorEmailInput,
      });

      return prevState;
    });
  }

  async function submitApplication(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFileLoading(true);
    if (!selectedFile || !!!title || !!!abstract) return;

    let fileResult: { filePath: string; fileName: string } | undefined;

    try {
      const formData = new FormData();
      formData.append('pdfFile', selectedFile);
      const { data } = await axios.post('/api/articles/upload', formData);
      fileResult = data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPdfUploadError(error.response?.data.error as string);
        setFileLoading(false);
      }
    }

    if (fileResult) {
      const { fileName, filePath } = fileResult;
      try {
        const { data } = await axios.post<InscribeApiResponde>(
          '/api/articles/inscribe',
          {
            title: title,
            abstract: abstract,
            pdfName: fileName,
            pdfpath: filePath,
            authors,
            keywords: ['coming soon'],
          }
        );
        if (data) {
          setSucessfullyModal(true);
          window.scrollTo(0, 0);
          document.body.style.overflow = 'hidden';
        }
      } catch (error) {
        console.log(error);
        setFileLoading(false);
      }
    }
  }

  return (
    <div className="relative">
      {sucessfullyModal && (
        <div className="bg-opacity-90 absolute h-screen w-screen bg-slate-100 z-10 flex items-center justify-center">
          <div className="w-96 h-64 bg-white flex flex-col items-center justify-center">
            <Image
              src="/images/sign-check-svgrepo-com.svg"
              width={60}
              height={60}
              alt="Cadastro confirmado"
            />
            <h1 className="font-bold mt-8 text-lg">
              Seu artigo foi enviado para aprovação!
            </h1>
            <Link
              href="/"
              className="mt-4 p-2 rounded bg-sky-600 font-bold text-white"
            >
              Ir para a home
            </Link>
          </div>
        </div>
      )}
      <Header />
      <Container>
        <form
          onSubmit={(e) => submitApplication(e)}
          className="pb-16 w-full md:w-7/12 flex flex-col gap-4"
        >
          <div className="h-20 w-full border-b-2 border-b-gray-500 flex">
            <p className="flex-1">RepoAmazing</p>
            <div className="">
              <h3 className="">Evento científico de branqueamento de corais</h3>
              <p className="">Todos os direitos reservados - 2022</p>
            </div>
          </div>

          <h1 className="mt-10 mb-2 font-bold text-3xl ">Submeta seu artigo</h1>

          <label htmlFor="title" className="text-xl">
            Insira o título do seu artigo
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="title"
            className="outline-none border-b-2 border-b-slate-500"
            placeholder="título do artigo"
          />

          <label htmlFor="resume" className="text-xl">
            Insira um resumo do seu artigo
          </label>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            id="resume"
            className="bg-gray-100 min-h-[150px] rounded pt-1 pl-2 text-gray-700 outline-none"
          />

          <div className="flex flex-col gap-4">
            <h3 className="text-xl py-4">Autores que escreveram esse artigo</h3>
            {authors.map(({ fullname, email, phone }) => (
              <div
                key={email}
                className="pb-1 flex border-b border-b-slate-400"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold">{fullname}</h3>
                  <div className="pl-4 flex gap-8">
                    <h4 className="text-gray-500">{email}</h4>
                    <p className="my-auto text-sm text-gray-400">{phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-amber-300 w-6 rounded font-bold"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <section className="flex flex-col">
            <h3 className="text-xl py-4">Autores</h3>
            <div className="flex gap-4 w-full">
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="authorName" className="">
                  Nome
                </label>
                <input
                  id="authorName"
                  type="text"
                  className="pl-1 flex-1 border-b-2 border-gray-300"
                  value={authorNameInput}
                  onChange={(e) => setAuthorNameInput(e.target.value)}
                />
                <label htmlFor="authorEmail" className="">
                  Email
                </label>
                <input
                  id="authorEmail"
                  type="text"
                  className="pl-1 flex-1 border-b-2 border-gray-300"
                  value={authorEmailInput}
                  onChange={(e) => setAuthorEmailInput(e.target.value)}
                />
                <label htmlFor="authorPhone" className="">
                  Telefone
                </label>
                <input
                  id="authorPhone"
                  type="text"
                  className="pl-1 flex-1 border-b-2 border-gray-300"
                  value={authorPhoneInput}
                  onChange={(e) => setAuthorPhoneInput(e.target.value)}
                />
              </div>

              <button
                onClick={(e) => addNewAuthor(e)}
                className="bg-amber-400 w-8 rounded-md font-bold text-lg"
                type="submit"
              >
                +
              </button>
            </div>
          </section>

          {invalidAuthor && <p className="text-red-500">{invalidAuthor}</p>}

          <label htmlFor="pdfFile" className="text-xl">
            Enviar arquivo PDF do artigo
          </label>
          <input
            type="file"
            id="pdfFile"
            className=""
            disabled={fileLoading}
            onChange={({ target }) => {
              if (target.files) {
                const file = target.files[0];
                setSelectedFile(file);
              }
            }}
          />
          {pdfUploadError && <p className="text-red-600">{pdfUploadError}</p>}
          <button
            className="py-2 px-4 bg-sky-700 rounded mt-4 text-white text-lg"
            disabled={fileLoading || !selectedFile || !!!title || !!!abstract}
            style={{
              opacity:
                !fileLoading && selectedFile && !!title && !!abstract
                  ? '1'
                  : '0.3',
            }}
            type="submit"
          >
            Submeter Artigo
          </button>
        </form>
      </Container>
    </div>
  );
};

export default Article;

export const getServerSideProps: GetServerSideProps<{
  user: {
    role: 'USER' | 'ADMIN' | 'DEV';
    email: string;
    name: string;
    image: string;
  };
}> = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user;

  if (!user)
    return { redirect: { permanent: false, destination: '/api/auth/signin' } };

  return {
    props: {
      user,
    },
  };
};
