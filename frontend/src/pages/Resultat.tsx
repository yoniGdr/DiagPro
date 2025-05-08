/**
 * Page Result
 * 
 * Fonctionnalité :
 * - Affiche un récapitulatif des réponses données par l'utilisateur.
 * - Si aucune réponse n'a été enregistrée, affiche un message d'avertissement invitant à recommencer.
 * - Propose deux actions : recommencer le questionnaire ou être contacté par un expert.
 * 
 * Points techniques :
 * - Utilisation du Context `QuestionnaireContext` pour récupérer les réponses.
 * - Navigation avec `useNavigate` pour retourner à l'accueil ou aller vers la page de contact.
 * - Affichage conditionnel selon qu'il y ait des réponses ou non.
 */

import { useContext } from "react";
import { QuestionnaireContext } from "../context/QuestionnaireContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import questionsData from "../data/questions.json"; 

export default function Result() {
  const navigate = useNavigate();
  const questionnaireContext = useContext(QuestionnaireContext); 

  if (!questionnaireContext) return <div>Chargement...</div>;

  const { answers, reset } = questionnaireContext; // Récupération des réponses données et de la fonction de reset depuis le contexte

  // Fonction pour réinitialiser le questionnaire et revenir à la page d'accueil
  const handleRestart = () => {
    reset();
    navigate("/");
  };
  // Fonction pour naviguer vers la page de formulaire de contact
  const handleContact = () => {
    navigate("/contact");
  };
  // Permet de retrouver l'intitulé d'une question à partir de son ID
  const findQuestionLabel = (questionId: string) => {
    const question = questionsData.find(q => q.id === questionId);
    return question ? question.label : "Question inconnue";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Header />

      <div className="flex-1 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary text-center">Récapitulatif de vos réponses :</h1>

        {/* Petite vague déco */}
        <div className="my-6">
          <img
            src="/icons/wave.svg"
            alt="Décoration vague"
            className="h-4 mx-auto"
          />
        </div>
        {/* Si des réponses sont présentes :
          - Affiche la liste des réponses et un message de remerciement
          Sinon :
          - Affiche un message d'alerte demandant de recommencer */}
        {answers.length > 0 ? (
          <>
            {/* Bloc réponses */}
            <div className="space-y-4">
                {/* Affichage de chaque réponse donnée sous forme de carte */}
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-5 shadow-md"
                >
                  <span className="text-sm text-gray-500">{findQuestionLabel(answer.questionId)}</span>
                  <div className="mt-1 text-lg font-bold text-dark">{answer.answer}</div>
                </div>
              ))}
            </div>

            {/* Bloc de remerciement affiché après les réponses */}
            <div className="bg-[#FFF0F1] text-dark rounded-lg p-6 shadow-md mt-10 text-center">
              <h2 className="text-xl text-[#FF445F] font-bold mb-3">Merci d'avoir répondu à nos questions !</h2>
              <p className="text-gray-700 leading-relaxed">
                Veuillez maintenant nous fournir vos coordonnées.<br />
                Un expert vous contactera dans les <span className="font-semibold text-primary">24 heures</span> pour vous aider à résoudre votre problème.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Message d'avertissement si aucune réponse */}
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center mt-10">
              <p className="font-semibold mb-2">Attention !</p>
              <p>Aucune réponse n'a été enregistrée. Veuillez cliquer sur "Recommencer" pour débuter correctement le questionnaire.</p>
            </div>
          </>
        )}

        {/* Boutons d'actions pour l'utilisateur */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          <button
            onClick={handleRestart}
            className="border-2 border-primary text-[#FF445F] font-semibold py-3 px-8 rounded-full hover:bg-[#FFF0F1] transition-colors duration-200"
          >
            Recommencer
          </button>

          <button
            onClick={handleContact}
            className="bg-[#FF445F] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#8F0C30] transition-colors duration-200"
          >
            Etre contacté par un expert
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
