import { CiImageOff } from 'react-icons/ci';
import Link from 'next/link';

const NoneImage: React.FC<{ folderId: string }> = ({ folderId }) => {
  return (
    <div className="w-full grid-cols-3 grid-rows-none gap-8 grid">
      {imageData.map(({ file, title, keywords }, index) => (
        <div
          key={file.name + file.toString + file.lastModified}
          className="border-2 border-black p-1 relative"
        >
          <div className="z-10 rounded-full h-8 w-8 bg-red-600 top-[-16px] right-[-16px] absolute flex justify-center items-center">
            <button
              onClick={() =>
                dispatchUpload({
                  type: actionsUploadEnum.REMOVEUPLOAD,
                  payload: index,
                })
              }
            >
              <BsX size={28} className="text-white" />
            </button>
          </div>

          <div className="w-full h-52 relative cursor-pointer">
            <Image
              alt={title}
              src={file ? URL.createObjectURL(file) : ''}
              fill
              onClick={() => setFullScreenImage(index)}
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
                className="bg-gray-300 px-1 gap-2 flex text-center max-w-full"
                key={word.name}
              >
                <p className="mr-1 flex-1 text-ellipsis overflow-hidden">
                  {word.name}
                </p>
                <button
                  onClick={() =>
                    dispatchUpload({
                      type: actionsUploadEnum.DELETEKEYWORD,
                      payload: index,
                      keywordName: word.name,
                    })
                  }
                  className="h-full text-red-500 "
                >
                  <TiDelete className="mx-auto" />
                </button>
              </div>
            ))}
            {newTextKeyword === -1 && (
              <button onClick={() => setNewTextKeyword(index)} className="">
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
  );
};

export default NoneImage;
