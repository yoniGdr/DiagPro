interface OptionButtonQuestionProps {
    option: { value: string; label: string };
    onClick: (value: string) => void;
  }
  
  export default function OptionButtonQuestion({ option, onClick }: OptionButtonQuestionProps) {
    return (
      <button
        onClick={() => onClick(option.value)}
        className="flex justify-between items-center bg-[#F2F2F2] hover:bg-[#FFF0F1] text-[#3C3532] hover:text-[#FF445F] font-semibold py-5 px-6 rounded-lg transition-colors duration-200"
      >
        {option.label}
        <img
          src="/icons/arrow.svg" 
          alt="Flèche avant"
          className=""
        />
      </button>
    );
  }
  