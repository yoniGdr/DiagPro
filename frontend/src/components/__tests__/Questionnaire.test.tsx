// Tests du comportement de la page Questionnaire
// Ces tests vérifient que le questionnaire dynamique fonctionne comme prévu selon différents scénarios.
//
// Scénarios testés :
// - Affichage du message "Chargement..." si le contexte React n'est pas encore disponible.
// - Redirection automatique vers la page "/result" si toutes les questions ont été répondues.
// - Appel de la fonction goToNextQuestion lorsqu'une option est sélectionnée par l'utilisateur.
//
// Ces tests améliore la stabilité de la navigation, la bonne gestion du contexte, et le bon déclenchement des actions lors de l'interaction utilisateur.

/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QuestionnaireContext } from '../../context/QuestionnaireContext';

// Mock manuel de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Questionnaire from '../../pages/Questionnaire';

describe('Questionnaire', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche "Chargement..." si le contexte est undefined', () => {
    render(
      <BrowserRouter>
        <Questionnaire />
      </BrowserRouter>
    );

    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
  });

  it('redirige vers /result si currentQuestion est null', () => {
    render(
      <BrowserRouter>
        <QuestionnaireContext.Provider value={{
          currentQuestion: null,
          answers: [],
          goToNextQuestion: () => {},
          goBack: () => {},
          reset: () => {},
        }}>
          <Questionnaire />
        </QuestionnaireContext.Provider>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/result');
  });

  it('appelle goToNextQuestion lorsqu’une option est cliquée', () => {
    const mockGoToNextQuestion = vi.fn();

    render(
      <BrowserRouter>
        <QuestionnaireContext.Provider value={{
          currentQuestion: {
            id: 'q__0',
            label: 'Quel est votre besoin ?',
            type: 'single',
            options: [
              { value: 'plomberie', label: 'Plomberie' },
              { value: 'électricité', label: 'Électricité' }
            ],
          },
          answers: [],
          goToNextQuestion: mockGoToNextQuestion,
          goBack: () => {},
          reset: () => {},
        }}>
          <Questionnaire />
        </QuestionnaireContext.Provider>
      </BrowserRouter>
    );

    const optionButton = screen.getByText(/Plomberie/i);
    fireEvent.click(optionButton);

    expect(mockGoToNextQuestion).toHaveBeenCalled();
  });

});
