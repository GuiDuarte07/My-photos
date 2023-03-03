import {
  BsPlus,
  BsFillGrid3X3GapFill,
  BsThreeDotsVertical,
  BsSortDownAlt,
  BsSortDown,
} from 'react-icons/bs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Popup from '../Popup';

type Images = {
  title: string;
  id: string;
  createdAt: string;
  hidden: boolean;
  url: string;
  size: number;
}[];

type filteredImage = {
  title: string;
  id: string;
  createdAt: string;
  hidden: boolean;
  url: string;
  size: number;
  date: Date;
};

type Filter = {
  order: 'asc' | 'desc';
  textFilter: string;
  size: 'asc' | 'desc' | undefined;
  keywords: string[] | undefined;
};

const Galery: React.FC<{
  images: Images;
  folderId: string;
  openDetail: () => void;
}> = ({ images, folderId, openDetail }) => {
  const [optionsView, setOptionsView] = useState<boolean>(false);
  const [orderOptionsView, setOrderOptionsView] = useState<boolean>(false);
  const [filterConfig, setFilterConfig] = useState<Filter>({
    order: 'asc',
    textFilter: '',
    keywords: [],
    size: undefined,
  });
  const [rangeImageViewer, setRangeImageViewer] = useState<number>(3);
  const imageFilter: filteredImage[] = structuredClone(images).map((img) => {
    const image: any = img;
    image.date = new Date(img.createdAt);

    return image;
  });

  const filteredImages = imageFilter.filter((img) =>
    img.title.toLowerCase().includes(filterConfig.textFilter.toLowerCase())
  );

  if (filterConfig.order === 'asc') {
    filteredImages.sort((a, b) => a.date.getTime() - b.date.getTime());
  } else {
    filteredImages.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  return (
    <>
      <div>
        <nav className="flex items-center justify-between gap-8">
          <div className="flex items-center">
            <Link
              href={`/upload/${folderId}`}
              className="flex items-center m-2 font-bold text-gray-500"
            >
              <BsPlus /> Adicionar nova imagem
            </Link>
            <button
              onClick={openDetail}
              className="font-bold text-sm ml-4 border-b text-slate-500"
            >
              Detalhes da pasta
            </button>
          </div>
          <div className="relative mr-4 ">
            <button
              onClick={() => setOptionsView((prev) => !prev)}
              className="relative p-1 border border-gray-200 rounded hover:bg-slate-300"
            >
              <BsThreeDotsVertical />
            </button>
            {optionsView && (
              <Popup
                setFalse={() => setOptionsView((prev) => !prev)}
                popUpSide="right"
              >
                <label className="flex items-center gap-2" htmlFor="volume">
                  <BsFillGrid3X3GapFill size={24} />
                  <input
                    onChange={(e) =>
                      setRangeImageViewer(Number(e.target.value))
                    }
                    value={rangeImageViewer}
                    type="range"
                    id="volume"
                    min="1"
                    max="5"
                    className="outline-none bg-gray-200 rounded-lg appearance-none cursor-pointer h-2"
                  />
                </label>
                <div className="flex items-center w-48">
                  <legend className="text-slate-600 text-sm font-bold">
                    Filtrar por:{' '}
                  </legend>
                  <div className="relative min-w-fit">
                    <button
                      className="ml-2 text-slate-400 text-sm font-bold rounded p-1 border border-gray-200"
                      onClick={() => setOrderOptionsView((prev) => !prev)}
                    >
                      {filterConfig.order === 'asc'
                        ? 'Data crescente'
                        : 'Data decrescente'}
                    </button>
                    {orderOptionsView && (
                      <Popup
                        popUpSide="left"
                        sameWidth={true}
                        setFalse={() => setOrderOptionsView((prev) => !prev)}
                      >
                        <button
                          className="text-slate-400 text-sm font-bold flex items-center"
                          onClick={() => {
                            setFilterConfig((prev) => ({
                              ...prev,
                              order: 'asc',
                            }));
                            setOrderOptionsView(false);
                          }}
                        >
                          <BsSortDownAlt className="text-base" /> Ascendente
                        </button>
                        <button
                          className="text-slate-400 text-sm font-bold flex items-center"
                          onClick={() => {
                            setFilterConfig((prev) => ({
                              ...prev,
                              order: 'desc',
                            }));
                            setOrderOptionsView(false);
                          }}
                        >
                          <BsSortDown className="text-base" /> Decendente
                        </button>
                      </Popup>
                    )}
                  </div>
                </div>
              </Popup>
            )}
          </div>
        </nav>

        <div className="flex gap-2 pl-4 items-center">
          <label>
            Pesquisar por nome
            <input
              value={filterConfig.textFilter}
              onChange={(e) =>
                setFilterConfig((prev) => ({
                  ...prev,
                  textFilter: e.target.value,
                }))
              }
              type="search"
              className="outline-none border border-gray-800 rounded pl-1 ml-2"
            />
          </label>
        </div>
        <div
          style={{
            gridTemplateColumns: `repeat(${rangeImageViewer}, minmax(0, 1fr))`,
          }}
          className={`overflow-x-hidden mt-16 w-full grid-cols-3 grid-rows-none gap-8 grid px-4`}
        >
          {/* Options */}

          {filteredImages.map(({ url, title, date, id }, index) => (
            <div key={url} className="">
              <div className="border-2 border-opacity-10 border-black w-full cursor-pointer">
                <Link href={`/image/${id}`}>
                  <img
                    alt={title}
                    src={url}
                    className="w-screen"
                    //onClick={() => setFullScreenImage(index)}
                  />
                </Link>
                <h3 className="py-2 px-1 hover:overflow-auto hover:whitespace-normal whitespace-nowrap overflow-hidden">
                  {title}
                </h3>
                <div className="flex gap-2 px-1 whitespace-nowrap overflow-hidden">
                  <h3 className="">Data:</h3>
                  <p className="">{date.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Galery;
