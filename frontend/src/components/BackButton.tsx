interface BackButtonProps {
    onClick: () => void;
  }
  
  export default function BackButton({ onClick }: BackButtonProps) {
    return (
      <div className="flex mt-6">
        <button
          onClick={onClick}
          className="flex items-center font-semibold border-2 border-[#FF445F] text-[#FF445F] py-4 px-6 rounded-full hover:bg-[#ffeaea] transition-colors duration-200"
        >
          <img
            src="/icons/arrow-right.svg" 
            alt="Retour"
            className="mr-2"
          />
          Etape précédente
        </button>
      </div>
    );
  }
  