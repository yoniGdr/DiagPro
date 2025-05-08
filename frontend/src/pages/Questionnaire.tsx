/**
 * Page Questionnaire
 * 
 * Fonctionnalité : 
 * - Affiche dynamiquement une série de questions basées sur les réponses de l'utilisateur.
 * - Gère la navigation entre les questions via un système de "prochaine question" ou de "retour" (bouton + navigateur).
 * - À la fin du parcours, redirige l'utilisateur vers une page de récapitulatif (/result).
 * 
 * Points techniques :
 * - Utilisation du Context `QuestionnaireContext` pour stocker les réponses.
 * - Utilisation de `useNavigate` pour la navigation.
 * - Gestion de l'historique navigateur pour permettre de revenir en arrière.
 * - Affichage conditionnel pour la première question (style page d'accueil).
 */

// Import des librairies React et outils de navigation
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import du contexte de gestion du questionnaire et des composants personnalisés
import { QuestionnaireContext } from "../context/QuestionnaireContext";
import QuestionTitle from "../components/QuestionTitle";
import OptionButtonHome from "../components/OptionButtonHome";
import OptionButtonQuestion from "../components/OptionButtonQuestion";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Questionnaire() {
  const navigate = useNavigate();
  const questionnaireContext = useContext(QuestionnaireContext);

  // Si le contexte n'est pas encore prêt, afficher "Chargement..."
  if (!questionnaireContext) return <div>Chargement...</div>;

  const { currentQuestion, goToNextQuestion, goBack } = questionnaireContext;

  // Lorsque l'utilisateur a terminé toutes les questions, rediriger vers la page de résultat
  useEffect(() => {
    if (!currentQuestion) {
      navigate("/result");
    }
  }, [currentQuestion, navigate]);

  // Gérer le bouton "retour" du navigateur pour revenir à la question précédente
  useEffect(() => {
    const handlePopState = () => {
      goBack();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [goBack]);

  // Lorsqu'une option est cliquée, avancer dans le questionnaire
  const handleOptionClick = (optionValue: string) => {
    const option = currentQuestion?.options.find(o => o.value === optionValue);
    if (!option) return;
    goToNextQuestion(option);
    window.history.pushState({}, ""); // Ajout manuel à l'historique pour le bouton back
  };

  // Si plus de questions à afficher, ne rien afficher
  if (!currentQuestion) return null;

  return (
    <div className={`min-h-screen flex flex-col ${currentQuestion.id === "q__0" ? "bg-[#443D3C]" : "bg-[#F8F8F8]"}`}>
      
      {/* Afficher Header uniquement si ce n'est PAS la première question */}
      {currentQuestion.id !== "q__0" && <Header />}

      <div className="flex flex-col items-center pt-12 px-4">

        {/* Afficher le titre de la question actuelle */}
        <QuestionTitle label={currentQuestion.label} isFirstQuestion={currentQuestion.id === "q__0"} />

        {/* Petite vague de décoration */}
        <div className="my-6">
          <img
            src={currentQuestion.id === 'q__0' ? '/icons/wave-white.svg' : '/icons/wave.svg'}
            alt="Décoration vague"
            className="h-4 mx-auto"
          />
        </div>

        {/* Liste des options de réponse */}
        {currentQuestion.id === "q__0" ? (
          // Première question : affichage spécial style "home"
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-6">
            {currentQuestion.options.map(option => (
              <OptionButtonHome
                key={option.value}
                option={option}
                onClick={handleOptionClick}
              />
            ))}
          </div>
        ) : (
          // Questions suivantes : affichage en carte avec retour possible
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map(option => (
                <OptionButtonQuestion
                  key={option.value}
                  option={option}
                  onClick={handleOptionClick}
                />
              ))}
            </div>
            {/* Bouton retour */}
            <BackButton onClick={goBack} />
          </div>
        )}
      </div>

      {/* Pied de page */}
      <Footer />
    </div>
  );
}

export default Questionnaire;
