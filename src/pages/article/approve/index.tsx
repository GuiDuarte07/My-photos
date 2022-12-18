import type { GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ArticleCard from '../../../components/ArticleCard';
import Container from '../../../components/container';
import Header from '../../../components/Header';
import prisma from '../../../lib/prismadb';

type Props = {
  articles: {
    title: string;
    Authors: { fullname: string }[];
    id: string;
    pdfpath: string | null;
  }[];
};

const Approve: NextPage<Props> = ({ articles }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session?.user.role === 'USER' || status === 'unauthenticated') {
    router.push('/404');
    return <></>;
  }

  return (
    <>
      <Header />
      <Container>
        <h1 className="my-4 font-bold text-xl font-mono text-left">
          RepoAmazing - Branqueamento de Corais
        </h1>
        <h2 className="my-4 font-bold text-lg font-mono">
          Artigos para serem aprovados
        </h2>
        <section className="flex gap-4 md:flex-row flex-col">
          {articles.map(({ id, title, Authors }) => (
            <ArticleCard
              className="max-w-sm my-4"
              key={id}
              id={id}
              title={title}
              authors={Authors.map((author) => author.fullname)}
            />
          ))}
        </section>
      </Container>
    </>
  );
};

export default Approve;

export const getStaticProps: GetStaticProps = async () => {
  const articles = await prisma.article.findMany({
    where: { approved: false, published: true },
    take: 10,
    select: {
      title: true,
      Authors: { select: { fullname: true } },
      id: true,
      pdfpath: true,
    },
  });

  return {
    props: {
      articles,
    },
  };
};
