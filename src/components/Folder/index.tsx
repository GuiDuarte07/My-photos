import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AiFillFolderOpen } from 'react-icons/ai';
import { FaFolderPlus } from 'react-icons/fa';
import {
  MdDone,
  MdOutlineDone,
  MdOutlineKeyboardBackspace,
} from 'react-icons/md';
import { RiAddBoxFill } from 'react-icons/ri';
import refreshProps from '../../utils/refreshProps';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import FolderModal from '../FolderModal';

const FolderList: React.FC<{
  folders: { id: string; name: string }[] | null;
  folderId?: string;
  parentId: string | null;
  keywords: { name: string }[] | null;
  allKeywords: { id: string; name: string }[] | null;
}> = ({ folders, folderId, parentId, keywords, allKeywords }) => {
  const [folderName, setFolderName] = useState('');
  const [folderModal, setFolderModal] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [newKeywords, setNewkeywords] = useState<{ name: string }[]>([]);

  async function createFolder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (folderName === '') return;
    try {
      await axios.post('/api/folder', {
        name: folderName,
        ...(folderId && { parentId: folderId }),
      });
      setFolderModal(false);
      refreshProps(router);
    } catch (e) {
      console.log(e);
    }
  }

  function openCloseFolderModal() {
    if (!folderModal) {
      setFolderModal(true);
    } else {
      setFolderName('');
      setFolderModal(false);
    }
  }

  function newKeywordFolder(name: string): boolean {
    if (name === '') return false;
    if (newKeywords.find((key) => key.name === name)) return false;

    setNewkeywords([...newKeywords, { name }]);
    return true;
  }

  function deleteKeywordFolder(index: number) {
    setNewkeywords((prev) => {
      const newKeys = [...prev];

      newKeys.splice(index, 1);
      return newKeys;
    });
  }

  return (
    <div>
      <FolderModal
        folderName={folderName}
        keywords={newKeywords}
        modalToggle={folderModal}
        setFolderName={setFolderName}
        openCloseModal={openCloseFolderModal}
        saveFolder={createFolder}
        newKeyword={newKeywordFolder}
        removeKeyword={deleteKeywordFolder}
      />
      <div className="flex-wrap pl-4 py-2 rounded m-2 border border-blue-400 flex items-center gap-8">
        {parentId !== null && (
          <Link
            href={`/${parentId}`}
            className="transition-allrounded px-2 py-1 flex items-center gap-2 text-black text-sm font-mono border-b-2 border-b-cyan-600"
          >
            <MdOutlineKeyboardBackspace />
            <span className="">Voltar</span>
          </Link>
        )}
        <button
          onClick={() => openCloseFolderModal()}
          className="hover:bg-blue-700 transition-all gap-2 p-2 rounded flex item-center bg-blue-400 text-white text-sm"
        >
          <div className="p-1 bg-blue-200 rounded">
            <FaFolderPlus className="" />
          </div>
          <span>Criar pasta</span>
        </button>
        {folders?.map(({ name, id }) => (
          <Link
            className="transition-all hover:bg-cyan-500 bg-cyan-400 rounded px-2 py-1 flex items-center gap-2 text-white text-sm font-mono"
            key={id}
            href={`/${sessionData?.user.id}/${id}`}
          >
            <AiFillFolderOpen />
            <span className="">{name}</span>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 ml-2 items-center">
        {/* {search && (
          <input
            onChange={(e) => setFolderName(e.target.value)}
            value={folderName}
            type="text"
            className="border border-blue-500 rounded p-1 pl-1 outline-none h-fit"
          />
        )} */}
      </div>
      <div className="mt-2 flex-wrap w-full">
        <h2 className="text-sm font-semibold text-cyan-900">
          Palavras-chaves desta pasta:
        </h2>
        <ul className="items-center flex gap-2 border border-blue-800 p-2 m-1 min-h-[40px]">
          {keywords?.map((keyword) => (
            <li
              key={keyword.name}
              className="px-2 py-[1px] rounded-sm bg-blue-50"
            >
              {keyword.name}
            </li>
          ))}
          {/* {!newKeyword ? (
            <button onClick={() => setNewKeyword(true)}>
              <RiAddBoxFill size={24} className="text-blue-500" />
            </button>
          ) : (
            <div className="">
              {<input
                autoFocus
                value={textNewKeyword}
                onChange={(e) => setTextNewKeyword(e.target.value)}
                type="search"
                className="w-52 h-6 p-1 text-sm outline-none border border-blue-200"
              />}
              <Combobox aria-labelledby="demo">
                <ComboboxInput className="w-52 h-6 p-1 text-sm outline-none border border-blue-200" />
                <ComboboxPopover>
                  <ComboboxList>
                    {allKeywords?.map((keywords) => (
                      <ComboboxOption
                        className="font-normal text-sm text-cyan-900"
                        key={keywords.id}
                        value={keywords.name}
                      />
                    ))}
                  </ComboboxList>
                </ComboboxPopover>
              </Combobox>
            </div>
          )} */}
        </ul>
      </div>
    </div>
  );
};

export default FolderList;
