import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { TiDelete } from 'react-icons/ti';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgb(254, 255, 255)',
    padding: '0px',
  },
};

type Props = {
  modalToggle: boolean;
  openCloseModal: () => void;
  saveFolder: (e: React.FormEvent<HTMLFormElement>) => void;
  folderName: string;
  setFolderName: (e: string) => void;
  keywords: { name: string }[] | null;
  removeKeyword: (index: number) => void;
  newKeyword: (name: string) => boolean;
};
const FolderModal: React.FC<Props> = ({
  modalToggle,
  openCloseModal,
  folderName,
  setFolderName,
  keywords,
  newKeyword,
  removeKeyword,
  saveFolder,
}) => {
  useEffect(() => Modal.setAppElement('body'), []);

  const [keywordText, setKeywordText] = useState('');
  const [keyError, setKeyError] = useState(false);

  return (
    <Modal
      isOpen={modalToggle}
      onRequestClose={openCloseModal}
      style={customStyles}
      contentLabel="Folder Modal"
    >
      <form className="pt-10 pb-2 px-10" onSubmit={(e) => saveFolder(e)}>
        <h1 className="font-semibold text- mb-4">Criar nova pasta</h1>
        <label className="block text-sm mb-2 font-bold" htmlFor="folderName">
          Nome da pasta
        </label>
        <input
          id="folderName"
          type="text"
          autoFocus
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full text-sm p-3 border focus:border-2 focus:border-blue-500 outline-none border-black rounded"
        />

        <fieldset className="mt-4">
          <legend className="font-bold">Adicionar palavras-chaves</legend>
          <div className="flex gap-2 justify-end items-end">
            <input
              className={`p-1 border-b-2 border-gray-500 outline-none w-60 ${
                keyError && 'border-red-600'
              }`}
              type="text"
              value={keywordText}
              onChange={(e) => setKeywordText(e.target.value)}
            />
            <button
              type="button"
              className="py-3 px-2 bg-blue-400 rounded text-sm font-bold text-white"
              onClick={() => {
                const sucess = newKeyword(keywordText);
                if (sucess) {
                  setKeywordText('');
                  setKeyError(false);
                } else setKeyError(true);
              }}
            >
              Adicionar
            </button>
          </div>
          <div className="w-full flex flex-wrap gap-2 mt-4 max-w-xs">
            {keywords?.map((word, index) => (
              <div
                className="rounded-sm bg-gray-500 pl-1 flex text-center max-w-full"
                key={word.name}
              >
                <p className="text-white font-bold mr-1 flex-1 text-ellipsis overflow-hidden">
                  {word.name}
                </p>
                <button
                  className="h-full text-red-700"
                  onClick={() => removeKeyword(index)}
                >
                  <TiDelete size={22} className="mx-auto" />
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="w-full flex mt-4 mb-2 justify-end">
          <button
            onClick={() => openCloseModal()}
            type="button"
            className="rounded p-3 hover:bg-slate-100 text-sm font-bold text-gray-500"
          >
            Cancelar
          </button>
          <input
            type="submit"
            className="cursor-pointer rounded p-3 hover:bg-slate-100 text-sm font-bold text-blue-400"
            value="Criar"
          />
        </fieldset>
      </form>
    </Modal>
  );
};

export default FolderModal;
