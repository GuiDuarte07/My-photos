import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSettings } from 'react-icons/fi';
import { FiHelpCircle } from 'react-icons/fi';

const Header: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="h-14 flex items-center justify-between bg-slate-100 px-1">
      <div className="">
        <h1 className="text-black font-bold">My-photos</h1>
      </div>
      <input
        placeholder="Pesquisar imagens"
        type="search"
        name=""
        id=""
        className="shadow bg-gray-300 outline-none px-1 rounded w-6/12 h-5/6"
      />
      <div className="flex justify-between">
        <div className="flex mx-8 gap-4">
          <button className="">
            <FiSettings size={20} className="" />
          </button>
          <button className="">
            <FiHelpCircle size={20} className="text-black" />
          </button>
        </div>
        {sessionData?.user ? (
          <>
            <div className="w-8 h-8 rounded-full relative overflow-hidden">
              <Image alt="foto de perfil" src={sessionData.user.image} fill />
            </div>
            <button onClick={() => signOut()}>Sair</button>
          </>
        ) : (
          <div className="">
            <Link
              href="/api/auth/signin"
              className="bg-blue-400 p-2 rounded text-white hover:bg-blue-700 transition-all "
            >
              Entrar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
