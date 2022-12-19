import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useState } from 'react';
import { AiFillFolderOpen } from 'react-icons/ai';
import { FaFolderPlus } from 'react-icons/fa';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import refreshProps from '../../utils/refreshProps';

const FolderList: React.FC<{
  folders: { id: string; name: string }[];
  folderId?: string;
  parentId: string;
}> = ({ folders, folderId, parentId }) => {
  const [folderName, setFolderName] = useState('');
  const [search, setSearch] = useState(false);
  const router = useRouter();

  function createFolder() {
    axios.post('/api/folder', {
      name: folderName,
      ...(folderId && { parentId: folderId }),
    });
    setSearch(false);
    refreshProps(router);
  }

  function openSearch() {
    setFolderName('');
    setSearch(true);
  }

  return (
    <div>
      <div className="pl-4 py-2 rounded m-2 border border-blue-400 flex items-center gap-8">
        <Link
          href={`/${parentId}`}
          className="transition-allrounded px-2 py-1 flex items-center gap-2 text-black text-sm font-mono border-b-2 border-b-cyan-600"
        >
          <MdOutlineKeyboardBackspace />
          <span className="">Voltar</span>
        </Link>
        {folders.map(({ name, id }) => {
          return (
            <Link
              className="transition-all hover:bg-cyan-500 bg-cyan-400 rounded px-2 py-1 flex items-center gap-2 text-white text-sm font-mono"
              key={id}
              href={`/${id}`}
            >
              <AiFillFolderOpen />
              <span className="">{name}</span>
            </Link>
          );
        })}
      </div>
      <div className="flex gap-4 ml-2 items-center">
        {search && (
          <input
            onChange={(e) => setFolderName(e.target.value)}
            value={folderName}
            type="text"
            className="border border-blue-500 rounded p-1 pl-1 outline-none h-fit"
          />
        )}
        <button
          onClick={search ? () => createFolder() : () => openSearch()}
          className="hover:bg-blue-700 transition-all gap-2 p-2 rounded flex item-center bg-blue-400 text-white"
        >
          <FaFolderPlus size={24} className="" />
          <span>{search ? 'Criar' : 'Adicionar nova pasta'}</span>
        </button>
      </div>
    </div>
  );
};

export default FolderList;
