import axios from 'axios';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { InscribeApiResponde } from '../../../types/types';
import Container from '../../components/container';
import Header from '../../components/Header';
import prisma from '../../lib/prismadb';
import { authOptions } from '../api/auth/[...nextauth]';

type Article = {
  id: string;
  title: string;
  User: {
    name: string | null;
    email: string | null;
  };
  Authors: { fullname: string; email: string; phone: string }[];
  abstract: string;
  pdfName: string | null;
  keywords: {
    name: string;
  }[];
  approved: boolean;
};

const Article: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ article }) => {
  const router = useRouter();
  async function aprroveArticle() {
    const { data } = await axios.post<InscribeApiResponde>(
      '/api/articles/approve',
      { articleId: article.id }
    );
    if (!data.isError) router.reload();
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
      </Head>
      <Header />
      <Container>
        <section className="md:max-w-xl flex flex-col mx-auto">
          <div className="h-20 w-full border-b-2 border-b-gray-500 flex">
            <p className="flex-1">RepoAmazing</p>
            <div className="">
              <h3 className="">Evento científico de branqueamento de corais</h3>
              <p className="">Todos os direitos reservados - 2022</p>
            </div>
          </div>
          <h1 className="mt-10 mb-2 font-normal text-2xl ">{article.title}</h1>

          <p className="text-sm max-w-full mb-4 border-b-2 border-b-gray-400">
            {article.Authors.map((author) => author.fullname + ', ')}
          </p>

          <h2 className="text-lg font-bold">Resumo</h2>
          <p className="bg-gray-100 p-2 my-2">{article.abstract}</p>

          <div className="flex justify-between items-center">
            <Link
              href={`/upload/${article.pdfName}`}
              className="flex my-2 bg-sky-700 p-2 w-fit"
              target="_blank"
            >
              <Image
                width={32}
                height={32}
                alt="Baixar PDF"
                src="/images/pdf-svgrepo-com.svg"
              />
              <p className="text-xl pl-4 text-white">Baixar PDF</p>
            </Link>
            {!article.approved && (
              <button
                onClick={() => aprroveArticle()}
                className="flex p-3 rounded bg-slate-200"
              >
                <Image
                  width={24}
                  height={24}
                  alt="aprovar"
                  src="/images/sign-check-svgrepo-com.svg"
                ></Image>
                Aprovar
              </button>
            )}
          </div>
        </section>
      </Container>
    </>
  );
};

export default Article;

interface QParams extends ParsedUrlQuery {
  articleId: string;
}

export const getServerSideProps: GetServerSideProps<
  {
    article: Article;
  },
  QParams
> = async ({ params, req, res }) => {
  let articleId: string;

  if (typeof params?.articleId === 'string') {
    articleId = params?.articleId;
  } else {
    return {
      redirect: { destination: '/404', permanent: false },
    };
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      abstract: true,
      title: true,
      pdfName: true,
      Authors: { select: { email: true, phone: true, fullname: true } },
      User: { select: { name: true, email: true } },
      keywords: { select: { name: true } },
      approved: true,
    },
  });

  if (!article)
    return {
      redirect: { destination: '/404', permanent: false },
    };

  if (article.approved === false) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || session?.user?.role === 'USER')
      return {
        redirect: { destination: '/404', permanent: false },
      };
  }
  return {
    props: { article },
  };
};
