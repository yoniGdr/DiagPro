// Tests unitaires de la page Contact
// Ces tests vérifient le bon comportement du formulaire de contact selon l'état du contexte.
//
// Scénarios testés :
// - Si l'utilisateur arrive sur Contact sans réponses enregistrées, il est automatiquement redirigé vers l'accueil.
// - Si le formulaire est vide ou invalide, le bouton "Envoyer" doit être désactivé.
//

/// <reference types="vitest" />

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QuestionnaireContext } from "../../context/QuestionnaireContext";
import Contact from "../../pages/Contact";
import { vi } from 'vitest';

const renderContact = (contextValue: any) => {
  render(
    <BrowserRouter>
      <QuestionnaireContext.Provider value={contextValue}>
        <Contact />
      </QuestionnaireContext.Provider>
    </BrowserRouter>
  );
};

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Contact", () => {
  it("redirige vers l'accueil si pas de réponses", () => {
    renderContact({ answers: [], reset: vi.fn() });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  }); 

  it("désactive le bouton Envoyer si le formulaire est vide", () => {
    renderContact({ answers: [{ questionId: "q__0", answer: "Plomberie" }], reset: vi.fn() });
    const submitButton = screen.getByRole("button", { name: /Envoyer/i });
    expect(submitButton).toBeDisabled();
  });
});
