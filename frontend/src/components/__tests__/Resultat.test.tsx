// Tests du comportement de la page Résultat
// Ces tests vérifient que la page affichant le récapitulatif du questionnaire fonctionne correctement.
//
// Scénarios testés :
// - Affichage du message "Chargement..." si le contexte React n'est pas disponible.
// - Affichage d'un message d'avertissement si aucune réponse n'est présente.
// - Affichage correct des réponses si elles existent.
// - Présence des boutons "Recommencer" et "Être contacté par un expert" pour permettre à l'utilisateur de poursuivre ou de relancer.


/// <reference types="vitest" />

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QuestionnaireContext } from "../../context/QuestionnaireContext";
import Result from "../../pages/Resultat";
import { vi } from 'vitest'; 

const renderResult = (contextValue: any) => {
  render(
    <BrowserRouter>
      <QuestionnaireContext.Provider value={contextValue}>
        <Result />
      </QuestionnaireContext.Provider>
    </BrowserRouter>
  );
};

describe("Result", () => {
  it('affiche un message "Chargement..." si pas de contexte', () => {
    render(
      <BrowserRouter>
        <Result />
      </BrowserRouter>
    );
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it("affiche un message d'avertissement s'il n'y a pas de réponses", () => { 
    renderResult({ answers: [], reset: vi.fn() });
    expect(screen.getByText(/Aucune réponse n'a été enregistrée/i)).toBeInTheDocument();
  });

  it("affiche les réponses si elles existent", () => {
    renderResult({ answers: [{ questionId: "q__0", answer: "Plomberie" }], reset: vi.fn() });
    expect(screen.getByText(/Récapitulatif de vos réponses/i)).toBeInTheDocument();
    expect(screen.getByText(/Plomberie/i)).toBeInTheDocument();
  });

  it("contient le bouton Recommencer et le bouton Etre contacté par un expert", () => {
    renderResult({ answers: [{ questionId: "q__0", answer: "Plomberie" }], reset: vi.fn() });
    expect(screen.getByRole('button', { name: /Recommencer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Etre contacté par un expert/i })).toBeInTheDocument();
  });
});
