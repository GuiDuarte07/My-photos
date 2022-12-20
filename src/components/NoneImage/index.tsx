import { CiImageOff } from 'react-icons/ci';

const NoneImage: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <CiImageOff size={120} />
      <h2 className="font-bold text-xl text-cyan-900">
        Não tem nenhuma foto nessa pasta.
      </h2>
      <h2 className="mt-2 font-bold text-xl text-cyan-900">
        Gostaria adicionar uma nova foto?
      </h2>
      <button className="mt-8 transition-all hover:bg-cyan-800 bg-cyan-600 rounded p-3 flex flex-col items-center justify-around gap-2 text-white text-sm">
        Adicionar imagem
      </button>
    </div>
  );
};

export default NoneImage;
