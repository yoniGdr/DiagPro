// 🎯 Contexte global qui gère l'état du questionnaire : 
// - Suivi de la question actuelle
// - Enregistrement des réponses
// - Navigation entre les questions
// - Réinitialisation complète du questionnaire

import { createContext, useState, ReactNode } from "react";
import questionsData from "../data/questions.json";

// Représente une option de réponse possible pour une question
interface Option {
  label: string;
  value: string;
  nextQuestionId?: string;
}
// Représente une question du questionnaire
interface Question {
  id: string;
  label: string;
  type: string;
  options: Option[];
}
// Représente la réponse donnée par l'utilisateur à une question
interface Answer {
  questionId: string;
  answer: string;
}
// Définition de la forme que prendra notre contexte
interface QuestionnaireContextType {
  currentQuestion: Question | null;
  answers: Answer[];
  goToNextQuestion: (selectedOption: Option) => void;
  goBack: () => void;
  reset: () => void;
}

// Création du contexte Questionnaire avec TypeScript
export const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

// Fournisseur (Provider) qui va englober toute l'application et gérer l'état du questionnaire
export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<Answer[]>([]); // Liste des réponses données par l'utilisateur
  const [history, setHistory] = useState<Question[]>([]); // Historique des questions pour pouvoir revenir en arrière
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>( // Question actuellement affichée à l'utilisateur
    questionsData.find(q => q.id === "q__0") || null
  );
  // Fonction pour enregistrer une réponse et passer à la prochaine question
  const goToNextQuestion = (selectedOption: Option) => {
    if (!currentQuestion) return;

    // Ajoute la réponse actuelle
    setAnswers(prev => [...prev, { questionId: currentQuestion.id, answer: selectedOption.value }]);
    // Ajoute la question actuelle à l'historique pour pouvoir revenir en arrière
    setHistory(prev => [...prev, currentQuestion]);

    // Cherche la prochaine question selon l'option sélectionnée
    const nextId = selectedOption.nextQuestionId;
    if (nextId) {
      const nextQuestion = questionsData.find(q => q.id === nextId);
      setCurrentQuestion(nextQuestion || null);
    } else {
      // Pas de nextQuestionId => Fin du questionnaire
      setCurrentQuestion(null);
    }
  };
  // Fonction pour revenir à la question précédente
  const goBack = () => {
    if (history.length === 0) return;
    const previousQuestion = history[history.length - 1]; // Récupère la dernière question de l'historique

    setHistory(prev => prev.slice(0, -1)); // Supprime la dernière question de l'historique
    setCurrentQuestion(previousQuestion); // Met à jour la question actuelle

    setAnswers(prev => prev.slice(0, -1)); // Supprime la dernière réponse donnée
  };
  // Fonction pour réinitialiser complètement le questionnaire (utilisée après un envoi ou lors d'un recommencement)
  const reset = () => {
    setAnswers([]);
    setHistory([]);
    setCurrentQuestion(questionsData.find(q => q.id === "q__0") || null);
  };
  // Expose les données et actions du questionnaire aux autres composants via le contexte
  return (
    <QuestionnaireContext.Provider
      value={{ currentQuestion, answers, goToNextQuestion, goBack, reset }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};



