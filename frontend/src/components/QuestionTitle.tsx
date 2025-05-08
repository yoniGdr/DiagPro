// Composent qui affiche le titre de la question et gère le style en fonction de la question actuelle
interface QuestionTitleProps {
    label: string;
    isFirstQuestion: boolean;
  }
  
  export default function QuestionTitle({ label, isFirstQuestion }: QuestionTitleProps) {
    return (
      <h1 className={`text-center font-bold ${isFirstQuestion ? "text-white text-3xl md:text-4xl" : "text-[#3C3532] text-2xl md:text-3xl"}`}>
        {label}
      </h1>
    );
  }
  